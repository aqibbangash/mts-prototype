var video = require("../modals/video.js");
const gm = require('gm');
const width = 1000;
const height = 100;
var fs = require('fs')
var path = require('path')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
var convertVideoName = 'videoplayback.mp4';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
exports.getVideos = function(req,res){
  video.find({}).sort({createdAt:-1}).exec(function(error,result){
    if(error){
      res.status(500).send({error:error});
    }else{
      res.status(200).send({result:result[0]});
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
      .in(path.join((__dirname).toString().replace('/api',"").replace("\api","")+params.screenshots[k]))
      start = start-50;
      console.log(k)
      if(k ==0 || start-50<0){
        x.minify()  // Halves the size, 512x512 -> 256x256
        x.mosaic()  // Merges the images as a matrix
        var dir = path.join((__dirname).toString().replace('/api',"").replace("\api",""))+'/headlines/';
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
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
        process.env.GOOGLE_APPLICATION_CREDENTIALS="./mts-project-227607-06400f774c3f.json"
        // Imports the Google Cloud client library
        const speech = require('@google-cloud/speech');
        //const fs = require('fs');

        // Creates a client
        const client = new speech.SpeechClient();

        // The name of the audio file to transcribe
        //  const fileName = './sample.mp3';
        const gcsUri = 'gs://arynews/'+req.body.videoName+'.wav';
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
          video.update({videoName : req.body.videoName},{transcription:transcription},{multi:false}).then(function(completed){
            console.log(completed);
            res.status(200).send({transcription : transcription});
          })
          // resu.transcription = transcription;
          // resu.save(function(error,done){
          //   if(error){
          //     res.status(500).send({error:error});
          //   }else{
          //   res.status(200).send({transcription : done.transcription});
          //   }
          // })

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
  process.env.GOOGLE_APPLICATION_CREDENTIALS="./mts-project-227607-06400f774c3f.json"
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
  process.env.GOOGLE_APPLICATION_CREDENTIALS="./mts-project-227607-06400f774c3f.json"
  const {Storage} = require('@google-cloud/storage');

  // Your Google Cloud Platform project ID
  const projectId = 'mts-project-227607';

  // Creates a client
  const storage = new Storage({
    projectId: projectId,
  });

  // The name for the new bucket
  var bucket = storage.bucket('bolnews');
  console.log(__dirname.replace('/api',"")+'/headlines/output0.jpg')
  bucket.upload(__dirname.replace('/api',"")+'/headlines/output0.jpg', function(err, file) {
              if (err) throw new Error(err);
          });
}
