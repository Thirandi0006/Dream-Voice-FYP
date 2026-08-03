// services/fileService.js
const File = require("../models/fileModel");

const saveFile = async ({ userId, audioUrl }) => {
  // Find existing user document
  let userFiles = await File.findOne({ userId });

  if (!userFiles) {
    // If user has no document yet, create one
    userFiles = new File({ userId, audioUrl: [] });
  }

  // Append new files if provided
  if (audioUrl) userFiles.audioUrl.push(audioUrl);

  return await userFiles.save();
};

const getAllFiles = async () => {
  return await File.find().sort({ uploadedAt: -1 });
};

const deleteFileUrl = async (userId, url) => {
  const updatedUser = await File.findOneAndUpdate(
    { userId },
    { $pull: { audioUrl: url } },
    { new: true }
  );

  // Delete document if array is empty
  if (updatedUser && updatedUser.audioUrl.length === 0) {
    await File.findOneAndDelete({ userId });
    return null;
  }

  return updatedUser;
};


const getFilesByUserId = async (userId) => {
  return await File.findOne({ userId }) || { audioUrl: [] };
};


module.exports = {
  saveFile,
  getAllFiles,
  deleteFileUrl,
  getFilesByUserId,
};
