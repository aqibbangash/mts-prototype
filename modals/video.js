var mongoose = require('mongoose');
var VideoSchema = new mongoose.Schema({
  name : {type:String},
  datetime : {type:Date,default:Date.now()},
  screenshots : {type:Array , default:[]},
  headlineTicker : {type:Array , default:[]},
  transcription : {type:String,default:""},
  videoName : {type:String},
  timestamp:{type:Number,default:15},
  createdAt : {type:Date , default:Date.now()},
  path : {type:String }
});
module.exports = mongoose.model('Video', VideoSchema);
