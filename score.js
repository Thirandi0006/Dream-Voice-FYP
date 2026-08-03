// scoring.js

function computeScores(voice, ideal) {
  const weights = {
    tone: 0.30,
    pitch: 0.25,
    emotion: 0.20,
    energy: 0.15,
    pace: 0.10,
  };

  let S_total = 0;

  for (const trait in weights) {
    const v = voice[trait] ?? 0;
    const c = ideal[trait] ?? 0;

    const diff = Math.abs(v - c);
    const s_i = Math.max(0, Math.min(10, 10 * (1 - diff)));

    S_total += s_i * weights[trait];
  }

  const P_total = Math.max(0, Math.min(100, (S_total / 10) * 100));

  return { S_total, P_total };
}

module.exports = { computeScores };
