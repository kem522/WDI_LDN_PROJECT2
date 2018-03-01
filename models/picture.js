const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

commentSchema.methods.isOwnedBy = function(user) {
  return this.user && user._id.equals(this.user._id);
};

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User'}
});

const schema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, maxlength: 380 },
  location: { type: String },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  comments: [ commentSchema ],
  likes: [ likeSchema ]
});

module.exports = mongoose.model( 'Picture', schema );
