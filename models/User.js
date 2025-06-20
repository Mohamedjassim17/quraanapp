const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  subscriptionPlan: { type: String, default: 'free' }, // 'monthly', 'yearly', 'trial', 'free'
  subscriptionExpiration: { type: Date, default: null }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
