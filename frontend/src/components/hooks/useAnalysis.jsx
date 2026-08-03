import { useState } from "react";
import { analyzeVoice, finalizeAnalysis } from "../api/analysis";
import { getProjectByid, updateProject } from "../api/projects";

export default function useAnalysis(userId) {
  const [analysisVoiceResult, setanalysisVoiceResult] = useState(null);
  const [FinalAnalyze, setFinalAnalyze] = useState("");
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [loadingFinal, setLoadingFinal] = useState(false);
  const [pastData, setPastData] = useState(null);
  const [loadingPast, setLoadingPast] = useState(false);


  const getVoiceAnalysis = async (url1, url2 = null) => {

    const body = url2 ? { url1, url2 } : { url1 };

    const data = await analyzeVoice(body);   // <-- send both if available

    console.log("Received data:", data);

    // Return as-is to let caller decide
    return data;
  };



  // Fetch Past Project
  const fetchPastProject = async (projectId) => {
    if (!projectId) return;

    try {
      setLoadingPast(true);

      const data = await getProjectByid(projectId);
      console.log("Fetched Past Project Data:", data);

      setPastData(data[0]);
      return data;
    } catch (err) {
      console.error("Fetch Past Result Error:", err);
    } finally {
      setLoadingPast(false);
    }
  };


  const handleVoiceAnalyze = async (voice1, voice2 = null) => {
    if (!voice1) return alert("Please select first voice.");

    setLoadingVoice(true);

    console.log("Analyzing voices:", voice1, voice2);

    try {
      const url1 = typeof voice1 === "string" ? voice1 : voice1.url;
      const url2 = voice2
        ? (typeof voice2 === "string" ? voice2 : voice2.url)
        : null;

      const data = await getVoiceAnalysis(url1, url2);


      if (data.voice1 && data.voice2) {
        setanalysisVoiceResult({
          voice1: data.voice1,
          voice2: data.voice2,
        });
      }


      else if (data.voice1) {
        setanalysisVoiceResult({
          voice1: data.voice1,
        });
      } else {
        throw new Error("No analysis returned");
      }
    } catch (err) {
      console.error("Voice analysis error:", err);
    } finally {
      setLoadingVoice(false);
    }
  };

  const handleUpdateProject = async (projectId, updates) => {
    if (!projectId) return alert("No project selected");

    try {
      await updateProject(projectId, { userId, ...updates });
      alert("✅ Project updated!");
    } catch (err) {
      console.error("updateProject error:", err);
      alert("❌ Failed to update");
    }
  };

  const finalAnalysis = async (voice, desc) => {
    if (!voice || !desc) return "Any one of result not exist";

    console.log("Voice:", voice);
    console.log("Desc:", desc);

    setLoadingFinal(true); // ✅ start loading
    try {
      const res = await finalizeAnalysis(voice, desc);
      setFinalAnalyze(res.analysis);
    } catch (err) {
      console.error("Final analysis error:", err);
    } finally {
      setLoadingFinal(false);
    }
  };

  return {
    analysisVoiceResult,
    handleVoiceAnalyze,
    finalAnalysis,
    handleUpdateProject,
    loadingVoice,
    loadingFinal,
    FinalAnalyze,
    fetchPastProject,
    pastData,
    loadingPast,

  };
}
