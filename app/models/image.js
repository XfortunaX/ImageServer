/**
 * Created by sergey on 11.09.17.
 */
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const imgSchema = new Schema({
  imgName: String,
  imgData: String,
});

const Img = mongoose.model('Image', imgSchema);

module.exports = Img;
