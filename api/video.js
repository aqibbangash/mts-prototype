var video = require("../modals/video.js");
var multer = require('multer');
const gm = require('gm');
const width = 1000;
const height = 100;
var fs = require('fs')
var path = require('path')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    callback(null,file.originalname)
  }
})
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
var upload = multer({ storage: storage }).single('filename')
const normalize = require('normalize-path');
var convertVideoName = 'videoplayback.mp4';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
exports.getVideos = function(req,res){
  var params = req.body;
  console.log("Request : ",params);
  video.findOne({videoName : params.videoName}).exec(function(error,result){
    if(error){
      res.status(500).send({error:error});
    }else{
      res.status(200).send({result:result});
    }
  })
}

exports.getVideosUrls = function(req,res){
  video.find({}).sort({createdAt:-1}).exec(function(error,result){
    if(error){
      res.status(500).send({error:error});
    }else{
      res.status(200).send({result:result});
    }
  })
}

exports.combineTickers = function(req,res){
  var params = req.body;
  console.log("*****************",req.body)
  var x = gm()
  var count = 0;
  var start = 500;
  params.screenshots = params.screenshots.sort();
  if(params.screenshots!=null && params.screenshots!=undefined && params.screenshots.length>0){
    var headline = [];
    for(var k=params.screenshots.length-1 ; k>=0 ; k--){
      if(start == 500){
        x = gm()
      }
      console.log(path.resolve(__dirname, "src"))
      if(params.screenshots[k][0] != '/'){
        params.screenshots[k] = "/"+params.screenshots[k];
      }
      x.in('-page', '+0+'+(start).toString())  // Custom place for each of the images
      .in(path.join((normalize(__dirname)).toString().replace('/api',"").replace("\api","")+params.screenshots[k]))
      start = start-50;
      console.log(k)
      if(k ==0 || start-50<0){
        x.minify()  // Halves the size, 512x512 -> 256x256
        x.mosaic()  // Merges the images as a matrix
        var dir = path.join((normalize(__dirname)).toString().replace('/api',"").replace("\api",""))+'/headlines/';
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
        dir = normalize(dir);
        x.write(dir+'output'+count+'.jpg', function (err) {
          if (err) console.log(err);
          res.status(200).send({image:'headlines/output'+count+'.jpg'});
        });
        //  count = count+1;
        start = 500;
      }
    }
  }else{
    res.status(403).send({message:"screenshots must be selected"});
  }

}


exports.createTranscription = function(req,res){
  console.log("Request : ",req.body);
  if(req.body.videoName == null || req.body.videoName == undefined){
    req.body.videoName = convertVideoName;
  }
  video.findOne({videoName : req.body.videoName, transcription:{$ne:null},transcription:{$ne:""}}).exec(function(error,resu){
    if(error){
      res.status(500).send({error:error});
    }else{
      if(resu){
        res.status(200).send({transcription : resu.transcription});
      }else{
        process.env.GOOGLE_APPLICATION_CREDENTIALS=normalize("./mts-project-227607-06400f774c3f.json")
        // Imports the Google Cloud client library
        const speech = require('@google-cloud/speech');
        // Creates a client
        const client = new speech.SpeechClient();
        // The name of the audio file to transcribe
        const fileName = '../uploads/'+req.body.videoName+'.wav';
        //const gcsUri = 'gs://arynews/'+req.body.videoName+'.wav';
        const encoding = 'LINEAR16';
        const sampleRateHertz = 44100;
        const languageCode = 'ur-PK';
        const config = {
          encoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: languageCode,
        };

        const audio = {
          uri: fileName,
        };

        const request = {
          config: config,
          audio: audio,
        };

        // Detects speech in the audio file. This creates a recognition job that you
        // can wait for now, or get its result later.
        client
        .longRunningRecognize(request)
        .then(data => {
          const operation = data[0];
          // Get a Promise representation of the final result of the job
          return operation.promise();
        })
        .then(data => {
          const response = data[0];
          const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
          console.log(`Transcription: ${transcription}`);
          video.update({videoName : req.body.videoName},{transcription:transcription},{multi:false}).then(function(completed){
            console.log(completed);
            res.status(200).send({transcription : transcription});
          })
          })
        .catch(err => {
          console.error('ERROR:', err);
          res.status(500).send({error:err});
        });
      }
    }
  })
}



exports.createbucket = function(req,res){
  // Imports the Google Cloud client library
  process.env.GOOGLE_APPLICATION_CREDENTIALS=normalize("./mts-project-227607-06400f774c3f.json")
  const {Storage} = require('@google-cloud/storage');
  // Your Google Cloud Platform project ID
  const projectId = 'mts-project-227607';
  // Creates a client
  const storage = new Storage({
    projectId: projectId,
  });
  // The name for the new bucket
  const bucketName = 'bolnews';
  // Creates the new bucket
  storage
  .createBucket(bucketName)
  .then(() => {
    console.log(`Bucket ${bucketName} created.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}

exports.uploadFileToBucket = function(req,res){
  process.env.GOOGLE_APPLICATION_CREDENTIALS=normalize("./mts-project-227607-06400f774c3f.json")
  const {Storage} = require('@google-cloud/storage');
  const projectId = 'mts-project-227607';
  const storage = new Storage({
    projectId: projectId,
  });
  var bucket = storage.bucket('bolnews');
  console.log(normalize(__dirname.replace('/api',"")+'/headlines/output0.jpg'))
  bucket.upload(normalize(__dirname.replace('/api',"")+'/headlines/output0.jpg'), function(err, file) {
    if (err) throw new Error(err);
  });
}


exports.uploadFile = function(req,res){
  console.log("file : ",req.file);
  upload(req, res, function (err) {
    if(req.file){
      console.log(req.file);
      var audioFileName = req.file.originalname.split('.');
      let  proc = new ffmpeg({source:'./uploads/'+req.file.originalname})
      .setFfmpegPath(ffmpegInstaller.path).audioChannels(1)
      .toFormat('wav')
      .saveToFile('./uploads/converted/'+audioFileName[0]+'.wav')
      console.log("123")
      setTimeout(function(){
        console.log("converted video");
        process.env.GOOGLE_APPLICATION_CREDENTIALS=normalize("./mts-project-227607-06400f774c3f.json")
        const {Storage} = require('@google-cloud/storage');
        // Your Google Cloud Platform project ID
        const projectId = 'mts-project-227607';
        // Creates a client
        const storage = new Storage({
          projectId: projectId,
        });
        // The name for the new bucket
        var bucket = storage.bucket('bolnews');
        console.log(normalize(__dirname.replace('/api',"")+'/uploads/converted/'+audioFileName[0]+'.wav'))
        bucket.upload(normalize(__dirname.replace('/api',"")+'/uploads/converted/'+audioFileName[0]+'.wav'), function(err, file) {
          if (err) {
            console.log("Error: ",err);
            res.status(500).send({error:err});
          }else{ // file uploaded to file bucket
            const speech = require('@google-cloud/speech');
            const client = new speech.SpeechClient();
            //const fileName = '../uploads/convert'+req.body.videoName+'.wav';
            const gcsUri = 'gs://bolnews/'+audioFileName[0]+'.wav';
            const encoding = 'LINEAR16';
            const sampleRateHertz = 44100;
            const languageCode = 'ur-PK';
            const config = {
              encoding: encoding,
              sampleRateHertz: sampleRateHertz,
              languageCode: languageCode,
            };
            const audio = {
              uri: gcsUri,
            };
            const request = {
              config: config,
              audio: audio,
            };
            // Detects speech in the audio file. This creates a recognition job that you
            // can wait for now, or get its result later.
            client
            .longRunningRecognize(request)
            .then(data => {
              const operation = data[0];
              // Get a Promise representation of the final result of the job
              return operation.promise();
            })
            .then(data => {
              const response = data[0];
              const transcription = response.results
              .map(result => result.alternatives[0].transcript)
              .join('\n');
              console.log(`Transcription: ${transcription}`);
              req.file.originalname = req.file.originalname.replace(".mp4","");
              video.create({
                videoName:req.file.originalname,
                name : Date.now(),
                transcription: transcription,
                path : '/uploads/'+req.file.originalname
              }).then(function(result){
                var file = bucket.file(audioFileName[0]+".wav");
                file.delete(function(err, apiResponse) {
                  if(err){
                    console.log("error in removing file from bucket",err);
                  }else{
                    res.status(200).send({result:result});
                  }
                });
              }).catch(err => {
                console.error('ERROR:', err);
                res.status(500).send({error:err});
              });
            })
            .catch(err => {
              console.error('ERROR:', err);
              res.status(500).send({error:err});
            });
          }
        });
      }, 3000);
    }else{
      res.status(400).send({meseage:"file not found"});
    }
  })
}

exports.getClip = function(req,res){
  var params = req.body;
  console.log("Request : ",params);
  if(params.videoName!=null && params.videoName!=undefined && params.videoName!='' ){
    if(params.start!=null && params.start!=undefined && params.start!=''){
      if(params.end!=null && params.end!=undefined && params.end!=''){
        ffmpeg('./uploads/'+params.videoName+'.mp4')
        .setStartTime(params.start) // "00:00:00"
        .setDuration(params.end) // "time in seconds like 50"
        .output('./uploads/'+params.videoName+'-clip.mp4')
        .on('end', function(err) {
          if(!err)
          {
            console.log('conversion Done');
            res.status(200).send({result:'/uploads/'+params.videoName+'-clip.mp4'});
          }else{
            console.log("error in clipping video",err);
            res.status(500).send({error:err})
          }
        })
        .on('error', function(err){
          console.log('error: ', +err);
          res.status(500).send({error:err})
        }).run();
      }else{
        res.status(400).send({message:"end required"});
      }
    }else{
      res.status(400).send({message:"start required"});
    }
  }else{
    res.status(400).send({message:"videoName required"});
  }
}
