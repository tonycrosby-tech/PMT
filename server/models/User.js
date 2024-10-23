const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');
// https://www.npmjs.com/package/passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, required: false },
  role: { type: String, enum: ['admin', 'member', 'guest'], default: 'member' },
  dateCreated: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }], // Reference to Projects
  
});

userSchema.plugin(passportLocalMongoose);

module.exports = model('User', userSchema);
