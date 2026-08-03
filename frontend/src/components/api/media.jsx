// src/api/media.js
import { apiFetch } from "./apiClient";

// Fetch all files for a user
export const getUserFiles = async (userId) => {
  try {
    const res = await apiFetch(`/user/files/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    // Ensure normalized shape
    return {
      audioUrl: data.audioUrl,
      uploadedAt: data.uploadedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error("getUserFiles error:", err);
    throw err;
  }
};

// Fetch all media for a project
export const getProjectMedia = async (projectId) => {
  try {
    const res = await apiFetch(`/user/projects/${projectId}/media`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return Array.isArray(data) ? data : data.media || [];
  } catch (err) {
    console.error("getProjectMedia error:", err);
    throw err;
  }
};

// Save a file record (image or voice)
export const saveFileRecord = async (userId, urlOrFile, type) => {
  try {
    let body;
    let headers = {};

    if (urlOrFile instanceof File) {
      body = new FormData();
      body.append("userId", userId);
      body.append("voice", urlOrFile); // field name 'voice' matches backend configuration
    } else {
      body = JSON.stringify({
        userId,
        audioUrl: urlOrFile,
      });
      headers = { "Content-Type": "application/json" };
    }

    const res = await apiFetch(`/user/files`, {
      method: "POST",
      headers,
      body,
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("saveFileRecord error:", err);
    throw err;
  }
};

// Delete a file record
export const deleteFile = async (userId, url, type) => {
  try {
    const res = await apiFetch(`/user/files/delete-file`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, url, type }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("deleteFile error:", err);
    throw err;
  }
};
