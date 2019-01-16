var mongoose = require('mongoose');
var VideoSchema = new mongoose.Schema({
  name : {type:String},
  datetime : {type:Date},
  screenshots : {type:Array , default:[]},
  headlineTicker : {type:Array , default:[]},
  transcription : {type:String,default:""},
  videoName : {type:String},
  timestamp:{type:Number},
  createdAt : {type:Date , default:Date.now()}
});
module.exports = mongoose.model('Video', VideoSchema);
