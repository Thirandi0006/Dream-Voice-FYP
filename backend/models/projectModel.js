const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  audio: { type: String, default: "" },
  status: { type: String, enum: ["pending", "inprogress", "completed"], default: "inprogress" },

  // Only store when updated, no default values
  voiceAnalysis: { type: mongoose.Schema.Types.Mixed },
  characterDetails: { type: mongoose.Schema.Types.Mixed },
  finalAnalysis: { type: mongoose.Schema.Types.Mixed },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt
projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Project", projectSchema);
