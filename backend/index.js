const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const FormData = require("form-data");
const fetch = require("node-fetch"); // Node 18+ has built-in fetch
const fileRoutes = require("./routes/fileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: ["http://localhost:5173"],
}));

app.use(express.json());
const path = require("path");
const fs = require("fs");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// LLM Configuration (Local Ollama)
const OLLAMA_URL = "http://localhost:11434/api/chat";
const OLLAMA_MODEL = "dreamvoice:1.0";




// Routes
app.use("/user/files", fileRoutes);
app.use("/user/projects", projectRoutes); // New project routes
app.use("/user", userRoutes);


app.post("/proxy", async (req, res) => {
  let { url1, url2 } = req.body;

  // Clean nested structure
  if (url1 && typeof url1 === "object") {
    url2 = url1.url2 ?? url2;
    url1 = url1.url1 ?? null;
  }

  console.log("Final URLs:", { url1, url2 });

  if (!url1 && !url2) {
    return res.status(400).json({ error: "At least one audio URL is required" });
  }

  try {
    const fetchAudio = async (url) => {
      // Check if the URL is local (starts with /uploads) or remote (starts with http)
      if (url && typeof url === "string" && !url.startsWith("http")) {
        // Resolve local file path
        const filePath = path.join(__dirname, url);
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath);
        }
        throw new Error(`File not found: ${filePath}`);
      }

      if (!url || typeof url !== "string" || !url.startsWith("http")) {
        throw new Error(`Invalid URL: ${url}`);
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    };

    const form = new FormData();

    if (url1) {
      const buffer1 = await fetchAudio(url1);
      form.append("files", buffer1, {
        filename: "audio1.mp3",
        contentType: "audio/mpeg",
      });
    }

    if (url2) {
      const buffer2 = await fetchAudio(url2);
      form.append("files", buffer2, {
        filename: "audio2.mp3",
        contentType: "audio/mpeg",
      });
    }

    const pyRes = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await pyRes.json();
    res.json(data);

  } catch (err) {
    console.error("Error in /proxy:", err);
    res.status(500).json({ error: err.message });
  }
});





app.post("/finalanalyze", async (req, res) => {
  try {
    const { voiceAnalysis, script } = req.body;

    console.log("Script:", script);

    // --- Construct prompt ---
    const prompt = `
You are an expert character and voice analyst.

Character Script/Description:
${script || "No description provided."}

Voice Analysis Summary (key traits only):
${JSON.stringify(voiceAnalysis, null, 2)}

Task:
Analyze how the voice aligns with the provided character description for dubbing suitability in a **fully deterministic way**.

⚠️Instructions:
- Evaluate Voice vs Character Description for scoring.
- Major traits: pitch, tone/brightness, energy, speech rate, emotion.
- Assign points per trait:
   - Fully aligned → 2 points
   - Partially aligned → 1 point
   - Misaligned → 0 points
- Expected range or style per trait should match the character description:
   - Pitch: matches apparent age, gender, and size (e.g., low/mid/high)
   - Tone/Brightness: matches personality
   - Speech rate: matches character’s expected communication style
   - Energy: matches character's activation level
   - Emotion: matches target emotion or personality
- Total points = sum of all major traits (max 10)
- Overall Score (%) = (Total Points ÷ 10) × 100
- Verdict based strictly on total points:
   - 8–10 → Good
   - 5–7 → Moderate
   - 0–4 → Bad

1. **Voice vs Character Alignment**
- Compare measured voice traits against expected ranges/style based on character description.
- Assign points per trait as above.
- Include numeric score (0–10) and percentage (0–100%).

2. **Overall Assessment**
- Provide numeric score, percentage, and verdict from total points only.

3. **Suggestions for Improvement**
- Provide actionable adjustments for vocal delivery to improve alignment with the character description.

Requirements:
- Use clear headings and bullet points.
- Output must be human-readable markdown.
- Include numeric scores and percentages.
- Ensure results are consistent and reproducible across runs for the same input.
`;



    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama error: ${ollamaResponse.statusText}`);
    }

    const data = await ollamaResponse.json();
    const analysisText = data.message?.content || "No analysis available.";

    res.json({
      summary: "Analysis completed successfully",
      analysis: analysisText,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process analysis" });
  }
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// - sᵢ = individual alignment score (0–10)
// - wᵢ = importance weight
// - Σwᵢ = 1.0

// Weight Distribution (based on importance for visual realism):
// - Tone → 0.30
// - Pitch → 0.25
// - Emotion → 0.20
// - Energy → 0.15
// - Pace → 0.10

// For internal computation (do NOT reveal math):
// 1. Normalize numeric voice values to [0,1].
// 2. Infer “ideal visual target” for each trait from image attributes:
//    - Calm / mature face → lower pitch, low energy, slow pace.
//    - Youthful / expressive face → higher pitch, energetic tone, faster pace.
//    - Serious or neutral expression → low emotional intensity.
// 3. Compute internal similarity score per trait:
//    sᵢ = 10 × (1 − |vᵢ − cᵢ|)
// 4. Aggregate:
//    S_total = Σ (wᵢ × sᵢ)
//    P_total = (S_total / 10) × 100
// 5. Clamp results to valid range [0,10] and [0–100%].

// ─────────────────────────────────────────────
// ### 2. Verdict Classification

// - **Good** → S_total ≥ 8.0 (P_total ≥ 80%)
// - **Moderate** → 5.0 ≤ S_total < 8.0
// - **Bad** → S_total < 5.0

// ─────────────────────────────────────────────
// ### 3. Output Format (Markdown)

// Your response must include only the readable summary below — never show math or formulas.

// **1. Voice vs Image Alignment**
// - Briefly describe how each major voice trait (tone, pitch, emotion, energy, pace) matches or contrasts with the image’s expression, demeanor, and perceived personality.
// - Assign a numeric score (0–10) and note general alignment in words (e.g., “strong”, “moderate”, “weak”).

// **2. Overall Assessment**
// - Provide:
//   - Weighted Overall Score: X.X / 10
//   - Percentage: XX.X%
//   - Verdict: Good / Moderate / Bad
// - The score should reflect the mathematical evaluation internally computed, but display only human-readable explanation.

// **3. Suggestions for Improvement**
// - List 2–3 actionable recommendations to adjust voice tone, pacing, or emotion to better fit the character’s image.

// ─────────────────────────────────────────────
// ### 4. Evaluation Guidance
// - Major mismatches (tone/pitch/emotion) significantly reduce score.
// - Minor mismatches (energy/pace) cause small deductions (<10%).
// - Prioritize visual coherence and emotional believability.
// - The tone of the report should be analytical yet natural.

// ─────────────────────────────────────────────
// ### Notes
// - Perform all internal calculations using the weighted function, but do NOT display or reference them.
// - Output must be concise, clear, and in Markdown format.
// `;
