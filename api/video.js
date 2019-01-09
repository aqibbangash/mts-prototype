var video = require("../modals/video.js");
const gm = require('gm');
const width = 1000;
const height = 100;
var fs = require('fs')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
exports.getVideos = function(req,res){
  video.find({}).exec(function(error,result){
    if(error){
      res.status(500).send({error:error});
    }else{
      res.status(200).send({result:result});
    }
  })
}

exports.combineTickers = function(req,res){
  var params = req.body;
  console.log("*****************")
  var x = gm()
  var count = 0;
  var start = 500;
  if(params.screenshots!=null && params.screenshots!=undefined && params.screenshots.length>0){
    var headline = [];
    for(var k=0 ; k<params.screenshots.length ; k++){
      if(start == 500){
         x = gm()
      }
      x.in('-page', '+0+'+(start).toString())  // Custom place for each of the images
      .in(path.join(__dirname)+parms.screenshots[k])
      start = start-50;
      if(k ==params.screenshots.length-1 || start-50<0){
        x.minify()  // Halves the size, 512x512 -> 256x256
        x.mosaic()  // Merges the images as a matrix
        var dir = path.join(__dirname)+'/headlines/'+new Date().getYear().toString()+new Date().getMonth().toString();
        if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
          }
        x.write(dir+'/output'+count+'.jpg', function (err) {
            if (err) console.log(err);
            res.sendFile(dir);
        });
        count = count+1;
        start = 500;
        if(k == params.screenshots.length-1){

        }
      }
    }
  }else{
    res.status(403).send({message:"screenshots must be selected"});
  }

}
