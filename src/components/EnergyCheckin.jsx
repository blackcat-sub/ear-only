import { useState } from "react";

const QUESTIONS = [
  {
    question: "你现在能集中注意力多久？",
    options: [
      { label: "30分钟以上", score: 3 },
      { label: "10-30分钟", score: 2 },
      { label: "几分钟都很难", score: 1 },
    ],
  },
  {
    question: "你现在想用脑还是放空？",
    options: [
      { label: "想学点东西", score: 3 },
      { label: "随便听听", score: 2 },
      { label: "什么都不想想", score: 1 },
    ],
  },
  {
    question: "你现在的状态是？",
    options: [
      { label: "精力充沛", score: 3 },
      { label: "还行", score: 2 },
      { label: "很疲惫", score: 1 },
    ],
  },
];

function scoreToLevel(total) {
  if (total >= 7) return { id: "high", label: "高精力", icon: "⚡" };
  if (total >= 4) return { id: "mid", label: "中精力", icon: "🎧" };
  return { id: "low", label: "低精力", icon: "🌿" };
}

export default function EnergyCheckin({ onComplete, onQuickSelect }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (score) => {
    const next = [...answers, score];
    setAnswers(next);
    if (next.length < QUESTIONS.length) {
      setStep((s) => s + 1);
    } else {
      const total = next.reduce((a, b) => a + b, 0);
      onComplete(scoreToLevel(total));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  if (step === 0 && answers.length === 0) {
    return (
      <div style={containerStyle}>
        <h2 style={titleStyle}>精力检测</h2>
        <p style={subtitleStyle}>帮你判断当前适合听什么</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
          <button onClick={() => onQuickSelect("high")} style={quickBtnStyle("#FF6B35")}>
            ⚡ 高精力 · 想学点东西
          </button>
          <button onClick={() => onQuickSelect("mid")} style={quickBtnStyle("#FBBF24")}>
            🎧 中精力 · 随便听听
          </button>
          <button onClick={() => onQuickSelect("low")} style={quickBtnStyle("#4ECDC4")}>
            🌿 低精力 · 需要放松
          </button>
        </div>

        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 12, opacity: 0.3, marginBottom: 12, textAlign: "center" }}>
            不确定？回答 3 个问题帮你判断
          </p>
          <button onClick={() => setStep(1)} style={startBtnStyle}>
            开始检测（10秒）
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step - 1];

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i + 1 <= step ? "#4ECDC4" : "rgba(255,255,255,0.1)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>

      <h2 style={{ ...titleStyle, marginBottom: 24 }}>{q.question}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt.score)} style={optionStyle}>
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={reset}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.3)",
          fontSize: 12,
          marginTop: 24,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        重新开始
      </button>
    </div>
  );
}

const containerStyle = {
  padding: "32px 20px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  justifyContent: "center",
};

const titleStyle = {
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
  color: "rgba(255,255,255,0.9)",
  fontFamily: "'LXGW WenKai', serif",
};

const subtitleStyle = {
  fontSize: 13,
  opacity: 0.4,
  margin: "4px 0 0",
};

const quickBtnStyle = (color) => ({
  width: "100%",
  maxWidth: 280,
  padding: "16px 20px",
  borderRadius: 16,
  border: `1px solid ${color}33`,
  background: `${color}11`,
  color: "rgba(255,255,255,0.85)",
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'LXGW WenKai', serif",
  transition: "all 0.2s ease",
});

const startBtnStyle = {
  padding: "12px 32px",
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.6)",
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "'LXGW WenKai', serif",
};

const optionStyle = {
  width: "100%",
  maxWidth: 280,
  padding: "14px 20px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "rgba(255,255,255,0.8)",
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'LXGW WenKai', serif",
  transition: "all 0.2s ease",
};
