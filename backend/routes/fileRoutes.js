const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

const upload = require("../utils/multerConfig");

// POST - Save file (supports both multipart and JSON)
router.post("/", upload.single("voice"), fileController.saveFile);

// GET - All files
router.get("/", fileController.getFiles);

// GET - Files for a specific user
router.get("/:userId", fileController.getFilesForUser);

// DELETE - Remove a specific file URL
router.delete("/delete-file", fileController.deleteFileUrl);

module.exports = router;
