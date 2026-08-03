const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Create new project
router.post("/", projectController.createProject);

// Get all projects for a user
router.get("/:userId", projectController.getProjectsByUser);

router.get("/user/:id" , projectController.getProjectsByperUser);

// Update a project
router.put("/:id", projectController.updateProject);

router.get("/:projectId/media", projectController.getProjectMedia);

// Delete a project
router.delete("/:id", projectController.deleteProject);

module.exports = router;
