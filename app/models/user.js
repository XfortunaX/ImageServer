/**
 * Created by sergey on 22.07.17.
 */
const mongoose  = require('mongoose');
const crypto    = require('crypto');
const Schema    = mongoose.Schema;

const userSchema = new Schema({
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String,
  salt: String,
});

userSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  if (!password) return false;
  if (!this.passwordHash) return false;
  return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
