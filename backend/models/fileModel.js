// models/fileModel.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: Array,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Files", fileSchema);
