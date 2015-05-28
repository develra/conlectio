var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var filefieldSchema = new Schema({
  file: String,
  key: String,
  demo: Array,
  data: Array
});

var FileField = mongoose.model('FileField', filefieldSchema);

module.exports = FileField
