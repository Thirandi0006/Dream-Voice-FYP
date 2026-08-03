// src/hooks/useProjects.js
import { useEffect, useState } from "react";
import { createProject, deleteProject, getProjects, updateProject } from "../api/projects";

export default function useProjects(userId) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects(userId);

      // ✅ KEEP full project fields
      setProjects(data);
      console.log("Fetched projects:", data);

    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };


  const addProject = async (projectData) => {
    const { title, status, description } = typeof projectData === "object" ? projectData : { title: projectData };
    const newProj = await createProject(userId, title);

    // Ensure newProj has the same shape as in fetchProjects
    const simplified = {
      _id: newProj.projectId || newProj._id,
      title: newProj.title,
      status: newProj.status || status,
      description: newProj.description || description,
      createdAt: newProj.createdAt,
    };

    setProjects((prev) => [...prev, simplified]);
    return simplified;
  };

  const editProject = async (id, updates) => {
    const updated = await updateProject(id, updates);
    setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  useEffect(() => { if (userId) fetchProjects(); }, [userId]);

  return { projects, loading, addProject, editProject, removeProject };
}
