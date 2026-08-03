// src/api/analysis.js
import { apiFetch } from "./apiClient";

export const analyzeVoice = async (urlData) => {
  // Extract URLs if nested
  const url1 = urlData?.url1 || urlData;
  const url2 = urlData?.url2 || null;

  // Function to strip the backend base URL for local paths
  const stripBase = (u) => {
    if (typeof u !== "string") return u;
    return u.replace(/^http:\/\/localhost:5000/, "");
  };

  const payload = url2
    ? { url1: stripBase(url1), url2: stripBase(url2) }
    : { url1: stripBase(url1) };

  const res = await apiFetch(`/proxy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url1: payload }),
  });

  return res.json();
};

export const finalizeAnalysis = async (voiceAnalysis, script) => {
  const res = await apiFetch(`/finalanalyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voiceAnalysis, script }),
  });

  return res.json();
};
