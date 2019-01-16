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
app.use(express.static('screenshots'))
app.use(express.static('headlines'))
app.use(express.static('uploads'))
var command = ffmpeg();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const gm = require('gm');
const width = 1000;
const height = 100;
var convertVideoName = 'ary';
var stripHeight = 120;
var stripWidth = 1050;
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
console.log(ffmpegInstaller.path+"/uploads", ffmpegInstaller.version);
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
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
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
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });
});
// console.log that your server is up and running
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

  app.post('/getVideos',function(req,res){
    console.log("request ",req.body)
    var params = req.body;
    var timeDiffrenece = 5;
    if(parseInt(req.body.timestamp)!=null && parseInt(req.body.timestamp)!=undefined && parseInt(req.body.timestamp)!=''){
      timeDiffrenece = parseInt(req.body.timestamp);
    }
    if(params.videoName !=null && params.videoName !=undefined && params.videoName !=''){
      convertVideoName = params.videoName;
    }
    video.findOne({videoName : convertVideoName,timestamp:timeDiffrenece}).exec(function(error,videoFound){
      if(error){
        res.status(500).send({error:error});
      }else{
        if(videoFound){
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

              tcount = tcount+1;
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
                gm(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png')).crop(stripWidth, stripHeight, stripStartX, stripStartY).write(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png'), function (err) {
                  //if (!err) console.log(' hooray! ');
                });
                resolve();
                count = count+timeDiffrenece;
                if (i == count){
                  video.create({
                    name : Date.now(),
                    videoName : convertVideoName,
                    datetime : Date.now(),
                    timestamp : timeDiffrenece,
                    screenshots : screenshotsArray
                  }).then(function(result){
                    res.status(200).send({message:"data stored in db",result:result});
                  })
                }
              })
              .on('end', function() {
                //  console.log('Processing finished !',i);

                screenshotsArray = screenshotsArray.concat(['/screenshots/screenshot'+convertVideoName+count+'.png']);
                gm(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png')).crop(stripWidth, stripHeight, x, y).write(normalize(__dirname+'/screenshots/screenshot'+convertVideoName+count+'.png'), function (err) {
                  //if (!err) console.log(' hooray! ');
                });
                promises.push('/screenshots/screenshot'+convertVideoName+i+'.png')
                resolve();
                count = count+timeDiffrenece;
                if (i == count){
                  video.create({
                    name : Date.now(),
                    videoName : convertVideoName,
                    datetime : Date.now(),
                    timestamp : timeDiffrenece,
                    screenshots : screenshotsArray
                  }).then(function(result){
                    res.status(200).send({message:"data stored in db",result:result});
                  })
                }

              })
              .run();
              //screenshotsArray = screenshotsArray.concat(['/screenshots/screenshot'+i+'.png']);
              // if( i >= 158){
              //   video.create({
              //     name : Date.now(),
              //     datetime : Date.now(),
              //     screenshots : screenshotsArray
              //   }).then(function(result){
              //     console.log("stored in db")
              //   })
              // }

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

  app.get('/headlines/:id',function(req,res){
    console.log(req.params)
    res.sendFile(normalize(__dirname+'/headlines/'+req.params.id))
  })

  app.get('/uploads/:id',function(req,res){
    console.log(req.params)
    res.sendFile(normalize(__dirname+'/uploads/'+req.params.id))
  })


  app.post('/combineTickers',function(req,res){
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

  // app.get('/takeshot',function(req,res){




  //
  // const speech = require('@google-cloud/speech');
  //
  // // Creates a client
  // const client = new speech.SpeechClient();
  //
  // // The name of the audio file to transcribe
  // const fileName = path.join(__dirname)+'/uploads/audio.mp3';
  //
  // // Reads a local audio file and converts it to base64
  // const file = fs.readFileSync(fileName);
  // const audioBytes = file.toString('base64');
  //
  // // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  // const audio = {
  //   content: audioBytes,
  // };
  // const config = {
  //   encoding: 'LINEAR16',
  //   sampleRateHertz: 16000,
  //   languageCode: 'en-US',
  // };
  // const request = {
  //   audio: audio,
  //   config: config,
  // };
  //
  // // Detects speech in the audio file
  // client
  //   .recognize(request)
  //   .then(data => {
  //     const response = data[0];
  //     const transcription = response.results
  //       .map(result => result.alternatives[0].transcript)
  //       .join('\n');
  //     console.log(`Transcription: ${transcription}`);
  //   })
  //   .catch(err => {
  //     console.error('ERROR:', err);
  //   });



  //})

  // var converter = require('video-converter');
  //
  //
  // // convert mp4 to mp3
  // converter.convert("./uploads/videoplayback.mp4", "audio.wav", function(err) {
  //   if (err) throw err;
  //
  // })






  // create a GET route
  app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
  });

  if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(normalize(__dirname, 'client/build'))));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(normalize(__dirname, 'client/build', 'index.html')));
    });
  }
  app.use('/', require('./routes/unauthenticated.js')); //routes which does't require token authentication
  app.listen(port, () => console.log(`Listening on port ${port}`));
