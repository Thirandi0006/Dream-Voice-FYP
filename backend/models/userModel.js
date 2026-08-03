const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  subscription: {
    type: String,
    required: true,

  },

  verificationCode: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  status: { type: String, default: "active" },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
