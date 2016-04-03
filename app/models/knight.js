var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KnightSchema = new Schema({
  name: String,
  rank: String,
});

module.exports = mongoose.model('Knight', KnightSchema);
