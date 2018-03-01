const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const followSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User'}
});

const schema = new mongoose.Schema({
  username: { type: String, minlength: 2, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  bio: { type: String, maxlength: 140 },
  password: { type: String, minlength: 8, required: true },
  followedUsers: [ followSchema ],
  followers: [ followSchema ]
});

schema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

schema.pre('validate', function checkPassword(next) {
  if(this.isModified('password') && this._passwordConfirmation !== this.password) {
    this.invalidate('passwordConfirmation', 'does not match');
  }

  next();
});

schema.pre('save', function hashPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }

  next();
});

schema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

schema.virtual('pictures', {
  ref: 'Picture',
  localField: '_id',
  foreignField: 'user'
});

schema.virtual('followedUsersPics', {
  ref: 'Picture',
  localField: 'followedUsers._id',
  foreignField: 'user'
});


module.exports = mongoose.model( 'User', schema );
