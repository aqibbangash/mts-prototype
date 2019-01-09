require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
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
var video = require('./modals/video.js');
 console.log(ffmpegInstaller.path+"/uploads", ffmpegInstaller.version);
app.use(cors());
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
  mongoose
  .connection
  .once("connected",()=>{
    var promises = [];
    var previousTime = "00";
    var count = 0;
    var currentTime = "0"
    var screenshotsArray = [];
    var promise = new Promise((reject,resolve)=>{
      for(var i = 0; i<40 ; i = i+2){
        var timeString = "00";

      if(i <= 38){
      //  console.log("currentTime before : ",parseInt(currentTime))
        timeString = (previousTime+":"+i).toString();
      }else{
        currentTime = (parseInt(previousTime)+1).toString();
        timeString = (currentTime+":"+i/2).toString();
      }
  //    console.log("timeString : ", timeString);
        ffmpeg('./uploads/file.mov')
        .output('./screenshots/screenshot'+i+'.png')
        .noAudio()
        .seek(timeString)
        .on('error', function(err) {
        //  console.log('An error occurred: ' + err.message);
          screenshotsArray = screenshotsArray.concat(['/screenshots/screenshot'+i+'.png']);
          promises.push('/screenshots/screenshot'+i+'.png')
          resolve();
          count = count+1;
          if (i/2 == count){
              video.create({
                name : Date.now(),
                datetime : Date.now(),
                screenshots : screenshotsArray
              }).then(function(result){
                console.log("stored in db")
              })
          }
        })
        .on('end', function() {
        //  console.log('Processing finished !',i);
          screenshotsArray = screenshotsArray.concat(['/screenshots/screenshot'+i+'.png']);
          promises.push('/screenshots/screenshot'+i+'.png')
          resolve();
          count = count+1;
          if (i/2 == count){
              video.create({
                name : Date.now(),
                datetime : Date.now(),
                screenshots : screenshotsArray
              }).then(function(result){
                console.log("stored in db")
              })
          }

        })
        .run();
        //screenshotsArray = screenshotsArray.concat(['/screenshots/screenshot'+i+'.png']);
        // if( i >= 38){
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
     datetime : Date.now(),
     screenshots : screenshotsArray
   }).then(function(result){
     console.log("stored in db")
   })
 })
 .catch(function(err){ /* error handling */ });

function checkValue(numb){
 return new Promise(function(resolve, reject){
  // place here your logic
  // return resolve([result object]) in case of success
  // return reject([error object]) in case of error
});


  }
})
app.use(morgan('dev'));
// json manipulation on server side
app.use(bodyParser.urlencoded({limit: '50mb', extended: true,parameterLimit:50000}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(morgan('combined'));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/screenshots/:id',function(req,res){
  console.log(req.params)
  res.sendFile(__dirname+'/screenshots/'+req.params.id)
})

app.get('/uploads/:id',function(req,res){
  console.log(req.params)
  res.sendFile(__dirname+'/uploads/'+req.params.id)
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


// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
  app.use('/', require('./routes/unauthenticated.js')); //routes which does't require token authentication
  app.listen(port, () => console.log(`Listening on port ${port}`));
