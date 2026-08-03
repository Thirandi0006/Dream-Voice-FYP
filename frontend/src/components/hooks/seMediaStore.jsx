// src/hooks/useMediaStore.js
import { useEffect, useState } from "react";
import { deleteFile, getUserFiles, saveFileRecord } from "../api/media";

export default function useMediaStore(userId) {
  const [voiceFiles, setVoiceFiles] = useState([]);

  // Fetch user files on mount
  const fetchFiles = async () => {
    try {
      const data = await getUserFiles(userId);
      const audioUrls = Array.isArray(data?.audioUrl) ? data.audioUrl : [];

      const formatUrl = (url) => url.startsWith("http") ? url : `http://localhost:5000${url}`;

      setVoiceFiles(
        audioUrls.map((url) => ({
          url: formatUrl(url),
          name: decodeURIComponent(url.split("/").pop().split("?")[0]),
          uploadedAt: data.uploadedAt ? new Date(data.uploadedAt).toLocaleString() : null,
        }))
      );
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchFiles();
  }, [userId]);

  // Delete file
  const handleDelete = async (file) => {
    try {
      const res = await deleteFile(userId, file.url, "voice");

      if (res.success || res.message.includes("success")) {
        setVoiceFiles((prev) => prev.filter((f) => f.url !== file.url));
      } else {
        console.error("Delete failed on server:", res.message);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Upload file
  const handleUpload = async (files) => {
    if (!files?.length) return [];

    for (let file of files) {
      try {
        // Direct upload to backend for voice files
        const res = await saveFileRecord(userId, file, "voice");
        const url = res.audioUrl;

        // Construct local file object
        const newFile = {
          name: file.name,
          url: url.startsWith("http") ? url : `http://localhost:5000${url}`,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        };

        // Update local state
        setVoiceFiles((prev) => [...prev, newFile]);
      } catch (err) {
        console.error("Upload failed for file:", file.name, err);
      }
    }
  };

  return {
    voiceFiles,
    handleDelete,
    handleUpload,
    fetchFiles,
    setVoiceFiles,
  };
}



  // // Delete file
  // const handleDelete = async (file, type) => {
  //   try {
  //       const res =  deleteFile(userId, url, type);

  //     if (type === "voice") {
  //       setVoiceFiles((prev) => prev.filter((f) => f.url !== file.url));
  //     } else {
  //       setImageFiles((prev) => prev.filter((f) => f.url !== file.url));
  //     }
  //   } catch (err) {
  //     console.error("Delete failed:", err);
  //   }
  // };  
  // 
  
// Fetch project-specific media
// const fetchProjectMedia = async (projectId) => {
//   if (!projectId) return null;
//   try {
//     const res = await fetch(`http://localhost:4000/user/projects/${projectId}/media`);
//     const data = await res.json();

//     if (data) {
//       setVoiceFiles(
//         data.audioUrl?.map((url) => ({
//           url,
//           name: url.split("/").pop(),
//           uploadedAt: new Date().toLocaleString(),
//         })) || []
//       );
//       setImageFiles(
//         data.imageUrl?.map((url) => ({
//           url,
//           name: url.split("/").pop(),
//           uploadedAt: new Date().toLocaleString(),
//         })) || []
//       );
//     }

//     // Return data so useEffect can use it
//     return data;
//   } catch (err) {
//     console.error("Error fetching project media:", err);
//     return null;
//   }
// };