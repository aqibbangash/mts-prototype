require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const normalize = require('normalize-path');
global.Promise = require('bluebird');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var multer = require('multer');
var cors = require('cors');
var path = require('path'); // node path module
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var logo = require('./modals/logo.js');
app.use(express.static('screenshots'))
app.use(express.static('headlines'))
app.use(express.static('uploads'))
var command = ffmpeg();
ffmpeg.setFfmpegPath(normalize(ffmpegInstaller.path));
const gm = require('gm');
const width = 1000;
const height = 100;
var convertVideoName = 'ary';
var stripHeight = 120;
var stripWidth = 1050;
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    callback(null,file.originalname)
  }
})

var stripHeightLogo = 110;  //ARY
var stripWidthLogo = 130; //ARY
var stripStartXLogo = 1060; //ARY
var stripStartYLogo = 550;//ARY

var timestamp = 60;
var stripStartX = 0;
var stripEndX = 1050;
var stripStartY = 600;
var stripEndY = 720;
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
var  logoName = "ary.png";
var mailer = require('express-mailer');
mailer.extend(app, {
  from: process.env.MAIL_USERNAME,
  host: 'mail.sofittech.com', // hostname
  secureConnection: false, // use SSL
  port: 25, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});
var video = require('./modals/video.js');
console.log(normalize(ffmpegInstaller.path+"/uploads"), ffmpegInstaller.version);
app.use(cors());
app.get('/sendemail/:id/:subject/:message', function (req, res, next) {
  app.mailer.send('email', {
    to: req.params.id, // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: req.params.subject, // REQUIRED.
    otherProperty: {message : req.params.message}, // All additional properties are also passed to the template as local variables.
    message: req.params.message,

  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      res.status(400).send({message:'There was an error sending the email'});
      return;
    }
    res.status(200).send({message:"Email sent"});
  });
});

app.get('/sendemail/:id/:subject/:message/:imageName', function (req, res, next) {
  app.mailer.send('email', {
    to: req.params.id, // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: req.params.subject, // REQUIRED.
    otherProperty: {message : req.params.message}, // All additional properties are also passed to the template as local variables.
    message:  req.params.message,
    attachments:[
      {filename: 'test.jpg', contents : new Buffer(fs.readFileSync(normalize(__dirname +'/headlines/'+req.params.imageName+'.jpg'))),contentType: 'image/jpeg'}
    ]
  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      res.status(400).send({message:'There was an error sending the email'});
      return;
    }
    res.status(200).send({message:"Email sent"});
  });
});
app.get('/sendVideoEmail/:id/:subject/:message/:videoName', function (req, res, next) {
  console.log("Request : ",req.params)
  app.mailer.send('email', {
    to: req.params.id, // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: req.params.subject, // REQUIRED.
    otherProperty: {message : req.params.message}, // All additional properties are also passed to the template as local variables.
    message:  req.params.message,
    attachments:[
      {filename: req.params.videoName+'.mp4', contents : new Buffer(fs.readFileSync(normalize(__dirname +'/uploads/'+req.params.videoName+'.mp4'))),contentType: 'video/mp4'}
    ]
  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      res.status(400).send({message:'There was an error sending the email'});
      return;
    }
    res.status(200).send({message:"Email sent"});
  });
});
var upload = multer({ storage: storage }).single('filename')

app.post('/uploadFile',function(req,res){

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
              console.log("Error:************************* ",err);
              res.status(500).send({error:err});
            }else{ // file uploaded to file bucket
              console.log("Uploaded to bucket *************************")
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
                  path : '/uploads/'+req.file.originalname+".mp4"
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
})
// var looksSame = require('looks-same');
//
// looksSame('./uploads/logoptv120.png', './uploads/logoptv10.png', function(error, {equal}) {
//     // equal will be true, if images looks the same
//     if(error){
//       console.log("error : ",error);
//     }else{
//       console.log("equal :",{equal} )
//     }
// });
// var resemble = require('node-resemble-js')
// var diff = resemble('./uploads/logoary20.png').compareTo('./uploads/logoptv120.png').onComplete(function(data){
//     console.log(data);
//     /*
//     {
//       misMatchPercentage : 100, // %
//       isSameDimensions: true, // or false
//       dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
//       getImageDataUrl: function(){}
//     }
//     */
// });


app.post('/sendTranscriptEmail/:id/:subject/:message/:videoName', function (req, res, next) {
  video.findOne({videoName:req.params.videoName}).exec(function(error,result){
    if(error){
      res.status(500).send({error:error});
    }else{
      if(result){
        app.mailer.send('email', {
          to: req.params.id, // REQUIRED. This can be a comma delimited string just like a normal email to field.
          subject: req.params.subject, // REQUIRED.
          otherProperty: {message : req.params.message}, // All additional properties are also passed to the template as local variables.
          message:  result.transcript
        }, function (err) {
          if (err) {
            // handle error
            console.log(err);
            res.status(400).send({message:'There was an error sending the email'});
            return;
          }
          res.status(200).send({message:"Email sent"});
        });
      }else{
        res.status(404).send({message:"video not found"});
      }
    }
  })

});
// ==========================================database connection===================================
mongoose.connect(process.env.MONGODB_URI,
  {
    poolSize: 20,
    keepAlive: 300000,
  }); // database conneciton to azure pro database
  mongoose
  .connection
  .once('connected', () => console.log('Connected to database'));
  app.use(morgan('dev'));
  // json manipulation on server side
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true,parameterLimit:50000}));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(morgan('combined'));
  app.use('/static', express.static(path.join(__dirname, 'public')));

  app.post('/getVideos',function(req, res, next){
    req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
    next()
  },function(req,res){
    console.log("request ",req.body)
    var params = req.body;
    var timeDiffrenece = 15;
    if(parseInt(req.body.timestamp)!=null && parseInt(req.body.timestamp)!=undefined && parseInt(req.body.timestamp)!=''){
      timeDiffrenece = parseInt(req.body.timestamp);
      //timeDiffrenece = 20;
    }
    if(params.videoName !=null && params.videoName !=undefined && params.videoName !=''){
      convertVideoName = params.videoName;
    }
    video.findOne({videoName : convertVideoName,timestamp:timeDiffrenece,path:'/uploads/'+convertVideoName+'.mp4'}).exec(function(error,videoFound){
      if(error){
        res.status(500).send({error:error});
      }else{
        if(videoFound && videoFound.screenshots.length>0){
          res.status(200).send({result:videoFound});
        }else{
          var promises = [];
          var previousTime = "00";
          var count = 0;
          var currentTime = "0"
          var screenshotsArray = [];
          var width = 1300;
          var height = 160;
          var x = 0;
          var y = 580;
          var tcount = 0;
          var timeString = "00";
          var promise = new Promise((reject,resolve)=>{
            for(var i = 0; i<160 ; i = i+timeDiffrenece){

              tcount = tcount+timeDiffrenece;
              if(tcount <= 59 && tcount>=0){
                //  console.log("currentTime before : ",parseInt(currentTime))
                timeString = (previousTime+":"+tcount).toString();
              }else{
                tcount = 0;
                currentTime = (parseInt(previousTime)+1).toString();
                previousTime = currentTime;
                timeString = (currentTime+":"+tcount).toString();
              }
              //    console.log("timeString : ", timeString);
              ffmpeg(normalize('./uploads/'+convertVideoName+'.mp4'))
              .output('./screenshots/screenshot'+convertVideoName+i+'.png')
              .noAudio()
              .seek(timeString)
              .on('error', function(err) {

                promises.push('/screenshots/screenshot'+i+'.png')
                screenshotsArray = screenshotsArray.concat(['/screenshots/screenshot'+convertVideoName+count+'.png']);
                // gm(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png')).crop(stripWidthLogo, stripHeightLogo, stripStartXLogo, stripStartYLogo).write(normalize(__dirname+'/uploads/logo'+convertVideoName+count+'.png'), function (err) {
                //   //if (!err) console.log(' hooray! ');
                // });
                gm(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png')).crop(stripWidth, stripHeight, stripStartX, stripStartY).write(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png'), function (err) {
                  //if (!err) console.log(' hooray! ');
                });
                resolve();
                count = count+timeDiffrenece;
                if (i == count){

                  video.update({videoName:convertVideoName,path:'/uploads/'+convertVideoName+'.mp4'},{
                    screenshots : screenshotsArray
                  }).then(function(result){
                    video.findOne({videoName:convertVideoName,path:'/uploads/'+convertVideoName+'.mp4'}).exec(function(error,foundResult){
                      if(error){
                        res.status(500).send({message:"data stored in db",result:foundResult});
                      }
                    })
                    //  res.status(200).send({message:"data stored in db",result:result});
                  })
                }
              })
              .on('end', function() {
                screenshotsArray = screenshotsArray.concat(['/screenshots/screenshot'+convertVideoName+count+'.png']);
                gm(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png')).crop(stripWidth, stripHeight, x, y).write(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png'), function (err) {
                  //if (!err) console.log(' hooray! ');
                });
                promises.push('/screenshots/screenshot'+convertVideoName+i+'.png')
                resolve();
                count = count+timeDiffrenece;
                if (i == count){
                  video.update({videoName:convertVideoName,path:'/uploads/'+convertVideoName+'.mp4'},{
                    screenshots : screenshotsArray
                  }).then(function(result){
                    video.findOne({videoName:convertVideoName,path:'/uploads/'+convertVideoName+'.mp4'}).exec(function(error,foundResult){
                      if(error){
                        res.status(500).send({message:"data stored in db",result:foundResult});
                      }
                    })
                    //  res.status(200).send({message:"data stored in db",result:result});
                  })
                }

              })
              .run();
            }
          })
          promise.all(promises)
          .then(function(data){ /* do stuff when success */
            video.create({
              name : Date.now(),
              videoName : convertVideoName,
              datetime : Date.now(),
              screenshots : screenshotsArray,
              timestamp : timeDiffrenece,
            }).then(function(result){
              console.log("stored in db");
              //  res.status(200).send({message:"data stored in db",result:result});
            })
          })
          .catch(function(err){ /* error handling */ });
        }
      }
    })
  })
  // var x = 100;
  // var y = 600;
  //  stripHeight = 20;
  //  stripWidth = 1050;
  // gm(__dirname+'/screenshots/screenshotgeo155.png').crop(stripWidth, stripHeight, x, y).write(__dirname+'/screenshots/screenshotgeo160.png', function (err) {
  //   if(err) console.log("error",err);
  //   if (!err) console.log(' hooray! ');
  // });
  app.get('/screenshots/:id',function(req,res){
    console.log(req.params)
    res.sendFile(normalize(__dirname+'/screenshots/'+req.params.id))
  })
  app.get('/headlines/:id',function(req,res){
    console.log(req.params)
    res.sendFile(normalize(__dirname+'/headlines/'+req.params.id))
  })


  app.get('/logos/:id',function(req,res){
    console.log(req.params)
    res.sendFile(normalize(__dirname+'/logos/'+req.params.id))
  })

  app.get('/uploads/:id',function(req,res){
    console.log(req.params)
    res.sendFile(normalize(__dirname+'/uploads/'+req.params.id))
  })


  app.post('/combineTickers',function(req, res, next){
    req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
    next()
  },function(req,res){
    var params = req.body;
    console.log("*****************",req.body)
    var x = gm()
    var count = 0;
    var start = (stripHeight*params.screenshots.length-1)-stripHeight;
    params.screenshots = params.screenshots.sort();
    if(params.screenshots!=null && params.screenshots!=undefined && params.screenshots.length>0){
      var headline = [];
      for(var k=params.screenshots.length-1 ; k>=0 ; k--){
        if(start == (stripHeight*params.screenshots.length-1)-stripHeight){
          x = gm()
        }
        if(params.screenshots[k][0] != '/'){
          params.screenshots[k] = "/"+params.screenshots[k];
        }
        x.in('-page', '+0+'+(start).toString())  // Custom place for each of the images
        .in(normalize(__dirname+params.screenshots[k]))
        start = start-stripHeight;
        console.log(k)
        if(k ==0 ){
          video.findOne({screenshots:{$in:[params.screenshots[0]]}}).exec(function(error,done){
            if(error){
              res.status(500).send({error:error});
            }else{
              console.log(done);
              x.in('-page', '+'+stripEndX+'+'+(0).toString())  // Custom place for each of the images
              .in(normalize(__dirname+'/uploads/'+done.videoName+'.png'))

              x.minify()  // Halves the size, 512x512 -> 256x256
              x.mosaic()  // Merges the images as a matrix
              var dir = normalize(__dirname+'/headlines/');
              if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
              }
              x.write(normalize(dir+'/'+'output'+count+'.jpg'), function (err) {
                if (err) console.log(err);
                res.status(200).send({image:'headlines/output'+count+'.jpg'});
              });
              //  count = count+1;
              //start = stripHeight*params.screenshots.length;
            }
          })

        }
      }
    }else{
      res.status(403).send({message:"screenshots must be selected"});
    }

  })


  app.post('/checkLogoChange',function(req, res, next){
    req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
    next()
  },function(req,res){

    var params = req.body;
    var baseLogo = "/uploads/logoary.png";
    var changedLogo = "";
    if(params.videoName!=null && params.videoName!=undefined && params.videoName!=''){
      logo.find({name:params.videoName}).exec(function(error,resultCheck){
        if(error){
          res.status(500).send({error:error});
        }else{
          if(resultCheck.length>0){
            res.status(200).send({message:"logo changed in this video",result:resultCheck});
          }else{
            console.log("request ",req.body)
            var params = req.body;
            var timeDiffrenece = 15;
            if(parseInt(req.body.timestamp)!=null && parseInt(req.body.timestamp)!=undefined && parseInt(req.body.timestamp)!=''){
              timeDiffrenece = parseInt(req.body.timestamp);
              //timeDiffrenece = 20;
            }
            if(params.videoName !=null && params.videoName !=undefined && params.videoName !=''){
              convertVideoName = params.videoName;
            }

            var promises = [];
            var previousTime = "00";
            var count = 0;
            var currentTime = "0"
            var screenshotsArray = [];
            var width = 1300;
            var height = 160;
            var x = 0;
            var y = 580;
            var tcount = 0;
            var timeString = "00";
            var promise = new Promise((reject,resolve)=>{
              for(var i = 0; i<=160 ; i = i+timeDiffrenece){

                tcount = tcount+timeDiffrenece;
                if(tcount <= 59 && tcount>=0){
                  //  console.log("currentTime before : ",parseInt(currentTime))
                  timeString = (previousTime+":"+tcount).toString();
                }else{
                  tcount = 0;
                  currentTime = (parseInt(previousTime)+1).toString();
                  previousTime = currentTime;
                  timeString = (currentTime+":"+tcount).toString();
                }
                console.log("timeString : ", normalize((__dirname).toString().replace("/api","/")+'uploads/'+convertVideoName+'.mp4'));
                ffmpeg('./uploads/'+convertVideoName+'.mp4')
                .output('./screenshots/screenshotlogo'+convertVideoName+i+'.png')
                .noAudio()
                .seek(timeString)
                .on('error', function(err) {
                  //console.log("i",i , err);
                  promises.push('/screenshots/screenshot'+i+'.png')
                  screenshotsArray = screenshotsArray.concat(['/screenshots/screenshotlogo'+convertVideoName+count+'.png']);
                  console.log("Address : 1 : ",(__dirname).toString().replace("/api","")+'/Screenshots/screenshotlogo'+convertVideoName+count+'.png')
                  gm(normalize((__dirname).toString().replace("/api","")+'/Screenshots/screenshotlogo'+convertVideoName+count+'.png')).crop(stripWidthLogo, stripHeightLogo, stripStartXLogo, stripStartYLogo).write(normalize((__dirname).toString().replace("/api","")+'/logos/logo'+convertVideoName+count+'.png'), function (err) {
                    if (!err) console.log(' hooray! ');
                    var resemble = require('node-resemble-js')
                    var diff = resemble("."+baseLogo).compareTo('./logos/logo'+convertVideoName+count+'.png').onComplete(function(data){
                      console.log(data);
                      if(parseFloat(data.misMatchPercentage)>80){
                        console.log("****************Logo Changed*****************")
                        logo.create({
                          name : convertVideoName,
                          changeDate : Date.now(),
                          before : baseLogo,
                          screenshot : '/screenshots/screenshotlogo'+convertVideoName+count+'.png',
                          after: '/logos/logo'+convertVideoName+count+'.png'
                        }).then(function(doneit){

                          console.log("saved");
                        })
                        baseLogo = '/logos/logo'+convertVideoName+count+'.png';
                      }
                      count = count+timeDiffrenece;
                      /*
                      {
                      misMatchPercentage : 100, // %
                      isSameDimensions: true, // or false
                      dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
                      getImageDataUrl: function(){}
                    }
                    */
                  });
                });
                resolve();
              console.log(i,count)
                if (i == count+timeDiffrenece){
                  //*****************************************************
                  logo.find({name:convertVideoName}).exec(function(error,logoResult){
                    if(error){
                      res.status(500).send({error:error});
                    }else{
                      if(logoResult.length>0){
                        res.status(200).send({message:"Logo changed in this video",result:logoResult});
                      }else{
                        res.status(200).send({message:"no logo change detected"});
                      }
                    }
                  })

                }
              })
              .on('end', function() {
                screenshotsArray = screenshotsArray.concat(['/screenshots/screenshotlogo'+convertVideoName+count+'.png']);
                console.log("Address : 2 : ",(__dirname).toString().replace("/api","")+'/Screenshots/screenshotlogo'+convertVideoName+count+'.png')
                gm(normalize((__dirname).toString().replace("/api","")+'/Screenshots/screenshotlogo'+convertVideoName+count+'.png')).crop(stripWidthLogo, stripHeightLogo, stripStartXLogo, stripStartYLogo).write(normalize((__dirname).toString().replace("/api","")+'/logos/logo'+convertVideoName+count+'.png'), function (err) {
                  if (!err) console.log(' hooray!121 ');
                });
                promises.push('/screenshots/screenshot'+convertVideoName+i+'.png')
                var resemble = require('node-resemble-js')
                var diff = resemble("."+baseLogo).compareTo('./logos/logo'+convertVideoName+count+'.png').onComplete(function(data){
                  console.log(data);
                  if(parseFloat(data.misMatchPercentage)>80){
                    console.log("****************Logo Changed*****************")
                    logo.create({
                      name : convertVideoName,
                      changeDate : Date.now(),
                      before : baseLogo,
                      screenshot : '/screenshots/screenshotlogo'+convertVideoName+count+'.png',
                      after: '/logos/logo'+convertVideoName+count+'.png'
                    }).then(function(doneit){
                      console.log("saved");
                    })
                    baseLogo = '/logos/logo'+convertVideoName+count+'.png';
                  }
                  count = count+timeDiffrenece;
                  /*
                  {
                  misMatchPercentage : 100, // %
                  isSameDimensions: true, // or false
                  dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
                  getImageDataUrl: function(){}
                }
                */
              });
              resolve();
              console.log(i,count)
              if (i == count+timeDiffrenece){
                //*****************************************************
                logo.find({name:convertVideoName}).exec(function(error,logoResult){
                  if(error){
                    res.status(500).send({error:error});
                  }else{
                    if(logoResult.length>0){
                      res.status(200).send({message:"Logo changed in this video",result:logoResult});
                    }else{
                      res.status(200).send({message:"no logo change detected"});
                    }
                  }
                })
              }

            })
            .run();
          }
        })
        promise.all(promises)
        .then(function(data){ /* do stuff when success */
          console.log("12312312312312323213123123123123123123123");
        })
        .catch(function(err){
          console.log("Error",err)
        /* error handling */ });

      }
    }
  })


}else{
  res.status(400).send({message: "videoName required"});
}

})

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(normalize(__dirname), 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(normalize(__dirname), 'client/build', 'index.html'));
  });
}
app.use('/',function(req, res, next){
  req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
  next()
}, require('./routes/unauthenticated.js')); //routes which does't require token authentication
app.listen(port, () => console.log(`Listening on port ${port}`));
