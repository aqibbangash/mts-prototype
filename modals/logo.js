var mongoose = require('mongoose');
var LogoSchema = new mongoose.Schema({
  name : {type:String},
  changeDate : {type:Date,default:Date.now()},
  before : {type:String},
  after: {type:String},
  screenshot : {type:String}
});
module.exports = mongoose.model('Logo', LogoSchema);
