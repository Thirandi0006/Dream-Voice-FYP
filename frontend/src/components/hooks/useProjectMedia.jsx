import { useEffect, useState } from "react";
import { getProjectMedia } from "../api/media";
import useMediaStore from "../hooks/seMediaStore"

export default function useProjectMedia(projectId) {
  const userId = "12345";
  const { handleUpload } = useMediaStore(userId);
  const [imageFiles, setImageFiles] = useState();
  const [voiceFiles, setVoiceFiles] = useState();
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
     const data = await getProjectMedia(userId);
      if (!res.ok) throw new Error("Failed to fetch project media");
 
      setImageFiles(data.images );
      setVoiceFiles(data.voices );

    } catch (err) {
      console.error("Error fetching project media:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload file
  const uploadMedia = async (files, type) => {
    if (!projectId || !files?.length) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    formData.append("type", type);

    try {
      const res = await handleUpload(files, type);
      if (!res.ok) throw new Error("Upload failed");
      const uploaded = await res.json();

      if (type === "image") {
        setImageFiles((prev) => [...prev, ...uploaded]);
      } else if (type === "voice") {
        setVoiceFiles((prev) => [...prev, ...uploaded]);
      }
    } catch (err) {
      console.error("Error uploading media:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [projectId]);

  return { imageFiles, voiceFiles, loading, uploadMedia, fetchMedia };
}
