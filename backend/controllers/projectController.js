const projectService = require("../services/projectService");

const createProject = async (req, res) => {
  try {
    const { userId, title } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ error: "userId and title are required" });
    }

    const project = await projectService.createProject({ userId, title });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating project" });
  }
};


const getProjectMedia = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return res.status(400).json({ error: "projectId is required" });

    const project = await projectService.getProjectMedia(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });
    console.log("Project media fetched:", project);
    res.json(project);

  } catch (err) {
    console.error("Error fetching project media:", err);
    res.status(500).json({ error: "Server error while fetching project media" });
  }
};


const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await projectService.getProjectsByUser(userId);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


const getProjectsByperUser = async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await projectService.getProjectsperUser(id);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "title",
      "audio",
      "status",
      "voiceAnalysis",
      "characterDetails",
      "finalAnalysis"
    ];

    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Normalize status
    if (updates.status) {
      const validStatuses = ["pending", "inprogress", "completed"];
      const normalized = updates.status.toLowerCase();
      if (!validStatuses.includes(normalized)) {
        return res
          .status(400)
          .json({ error: `Invalid status: ${validStatuses.join(", ")}` });
      }
      updates.status = normalized;
    }

    const updatedProject = await projectService.updateProject(id, updates);

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(updatedProject);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectService.deleteProject(id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createProject,
  getProjectsByUser,
  updateProject,
  getProjectsByperUser,
  getProjectMedia,
  deleteProject,
};
