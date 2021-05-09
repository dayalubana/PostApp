var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var post = new Schema({
    title: String,
    content: String,
    imagePath: String,
    creator: {type: mongoose.Schema.Types.ObjectId,required: true}
});

module.exports = mongoose.model('Post', post);