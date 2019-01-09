var mongoose = require('mongoose');
var VideoSchema = new mongoose.Schema({
  name : {type:String},
  datetime : {type:Date},
  screenshots : {type:Array , default:[]},
  headlineTicker : {type:Array , default:[]}
});
module.exports = mongoose.model('Video', VideoSchema);
