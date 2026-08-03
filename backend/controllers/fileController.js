const fileService = require("../services/fileService");
const fs = require("fs");
const path = require("path");

const saveFile = async (req, res) => {
  try {
    const { userId } = req.body;
    let { audioUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // If a file was uploaded via multer, use its local path
    if (req.file) {
      audioUrl = `/uploads/voice/${req.file.filename}`;
    }

    // Save or append files
    const savedFile = await fileService.saveFile({ userId, audioUrl });

    res.status(201).json({ message: "File saved successfully", file: savedFile, audioUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteFileUrl = async (req, res) => {
  try {
    let { userId, url } = req.body;

    if (!userId || !url) {
      return res.status(400).json({ message: "userId and url are required" });
    }

    // Normalize URL: remove protocol and host if present
    if (url.startsWith("http")) {
      try {
        const urlObj = new URL(url);
        url = urlObj.pathname;
      } catch (e) {
        console.error("URL parsing error:", e);
      }
    }

    const updatedUser = await fileService.deleteFileUrl(userId, url);

    if (!updatedUser && updatedUser !== null) {
      return res.status(404).json({ message: "User not found or file already deleted" });
    }

    // Attempt to delete physical file from disk
    // Assuming url is like "/uploads/voice/..."
    // We need to resolve it relative to the Backend directory
    const filePath = path.join(__dirname, "..", url);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting physical file:", err);
        else console.log("Physical file deleted:", filePath);
      });
    }

    res.status(200).json({ message: "File removed successfully", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await fileService.getAllFiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getFilesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = await fileService.getFilesByUserId(userId);
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  saveFile,
  getFiles,
  deleteFileUrl,
  getFilesForUser,
};
