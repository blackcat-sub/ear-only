import { useState } from "react";

const QS = [
  { q: "你现在能集中注意力多久？", opts: ["30分钟以上", "10-30分钟", "几分钟都很难"] },
  { q: "你现在想用脑还是放空？",     opts: ["想学点东西", "随便听听", "什么都不想想"] },
  { q: "你现在的状态是？",           opts: ["精力充沛", "还行", "很疲惫"] },
];

function totalToLevel(total) {
  if (total >= 7) return { id: "high", label: "高精力", icon: "⚡", color: "#FF6B35" };
  if (total >= 4) return { id: "mid",  label: "中精力", icon: "🎧", color: "#FBBF24" };
  return                  { id: "low",  label: "低精力", icon: "🌿", color: "#4ECDC4" };
}

export default function EnergyCheckin({ onComplete, onQuickSelect }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handle = (score) => {
    const next = [...answers, score];
    setAnswers(next);
    if (next.length < QS.length) {
      setStep((s) => s + 1);
    } else {
      onComplete(totalToLevel(next.reduce((a, b) => a + b, 0)));
    }
  };

  const reset = () => { setStep(0); setAnswers([]); };

  // Screen 0: quick pick
  if (step === 0 && answers.length === 0) {
    return (
      <div style={c}>
        <h2 style={t}>精力检测</h2>
        <p style={st}>帮你判断当前适合听什么</p>

        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => onQuickSelect("high")} style={qk("#FF6B35")}>
            <span style={qki}>⚡</span> 高精力 · 想学点东西
          </button>
          <button onClick={() => onQuickSelect("mid")} style={qk("#FBBF24")}>
            <span style={qki}>🎧</span> 中精力 · 随便听听
          </button>
          <button onClick={() => onQuickSelect("low")} style={qk("#4ECDC4")}>
            <span style={qki}>🌿</span> 低精力 · 需要放松
          </button>
        </div>

        <div style={{ marginTop: 48 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", marginBottom: 14 }}>
            不确定？3 题帮你判断
          </p>
          <button onClick={() => setStep(1)} style={sb}>开始检测</button>
        </div>
      </div>
    );
  }

  // Question screens
  const q = QS[step - 1];

  return (
    <div style={c}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 48 }}>
        {QS.map((_, i) => (
          <div key={i} style={{
            width: i + 1 <= step ? 24 : 6,
            height: 3,
            borderRadius: 2,
            background: i + 1 <= step ? "#4ECDC4" : "rgba(255,255,255,0.08)",
            transition: "all 0.4s ease",
          }} />
        ))}
      </div>

      <h2 style={{ ...t, marginBottom: 32, lineHeight: 1.5 }}>{q.q}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => handle(3 - i)} style={ob}>{opt}</button>
        ))}
      </div>

      <button onClick={reset} style={{ ...sb, marginTop: 32, opacity: 0.3 }}>重新开始</button>
    </div>
  );
}

// shared styles
const c = {
  padding: "48px 24px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  justifyContent: "center",
};

const t = {
  fontSize: 22,
  fontWeight: 700,
  margin: 0,
  color: "rgba(255,255,255,0.85)",
  fontFamily: "'LXGW WenKai', serif",
};

const st = {
  fontSize: 13,
  color: "rgba(255,255,255,0.30)",
  margin: "4px 0 0",
};

const qki = { fontSize: 18, lineHeight: 1 };

const qk = (color) => ({
  width: 260,
  padding: "16px 20px",
  borderRadius: 16,
  border: `1px solid ${color}14`,
  background: `${color}08`,
  color: "rgba(255,255,255,0.80)",
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'LXGW WenKai', serif",
  transition: "all 0.3s ease",
  textAlign: "left",
});

const ob = {
  width: 260,
  padding: "15px 20px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(255,255,255,0.02)",
  color: "rgba(255,255,255,0.75)",
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'LXGW WenKai', serif",
  transition: "all 0.2s ease",
  textAlign: "left",
};

const sb = {
  padding: "10px 28px",
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "transparent",
  color: "rgba(255,255,255,0.45)",
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "'LXGW WenKai', serif",
  letterSpacing: 0.5,
};
