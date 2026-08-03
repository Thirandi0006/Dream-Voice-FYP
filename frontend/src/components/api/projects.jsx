// src/api/projects.js
import { apiFetch } from "./apiClient";

// Fetch all projects for a user
export const getProjects = async (userId) => {
  try {
    const res = await fetch(`http://localhost:5000/user/projects/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Ensure we always return an array
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.projects)) return data.projects;
    return []; // fallback
  } catch (err) {
    console.error("getProjects error:", err);
    throw err;
  }
};



export const getProjectByid = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/user/projects/user/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Ensure we always return an array
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.projects)) return data.project;
    return []; // fallback
  } catch (err) {
    console.error("getProjects error:", err);
    throw err;
  }
};

// Create a new project
export const createProject = async (userId, title) => {
  try {
    const res = await apiFetch(`/user/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("createProject error:", err);
    throw err;
  }
};

  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
// Update an existing project
export const updateProject = async (id, updates) => {

  try {
    const res = await apiFetch(`/user/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...updates }),   //  attach userId
    });

    return res.json();
  } catch (err) {
    console.error("updateProject error:", err);
    throw err;
  }
};
// Delete a project
export const deleteProject = async (id) => {
  try {
    const res = await apiFetch(`/user/projects/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete project: ${res.status} ${res.statusText}`);
    }

    return true; // indicate success
  } catch (err) {
    console.error("deleteProject error:", err);
    throw err;
  }
};
