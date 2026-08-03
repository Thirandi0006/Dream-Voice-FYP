const Project = require("../models/projectModel");


const createProject = async (data) => {
  return await Project.create({
    userId: data.userId,
    title: data.title,
    audio: "",
    // analysis fields are omitted; they will only exist when updated later
  });
};

const getProjectsByUser = async (userId) => {
  return await Project.find({ userId }).sort({ createdAt: -1 });
};


const getProjectsperUser = async (id) => {

  return await Project.find({ _id: id });
};



const getProjectMedia = async (projectId) => {
  if (!projectId) throw new Error("projectId is required");

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  return {
    projectId: project._id,
    title: project.title,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    audioUrl: project.audio || "",   // single audio string
    voiceAnalysis: project.voiceAnalysis || {},
    characterDetails: project.characterDetails || {},
    finalAnalysis: project.finalAnalysis || {},
  };
};



const updateProject = async (id, updates) => {
  try {
    const project = await Project.findById(id);
    if (!project) throw new Error("Project not found");

    console.log("Updating project:", { id, updates });

    // Handle single media fields
    if (updates.audio) {
      project.audio = updates.audio;  // replace old audio
    }

    // Handle other fields
    for (const key in updates) {
      if (key !== "audio") {
        project[key] = updates[key];
      }
    }

    await project.save();
    return project;
  } catch (err) {
    console.error("Error updating project:", err);
    throw err;
  }
};




const deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};

module.exports = {
  createProject,
  getProjectsByUser,
  getProjectMedia,
  getProjectsperUser,
  updateProject,
  deleteProject,
};
