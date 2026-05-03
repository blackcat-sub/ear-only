import { useState, useEffect, useRef, useCallback } from "react";

const SCENES = [
  { id: "commute", label: "通勤", icon: "🚗", color: "#FF6B35", bgGrad: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", mood: "energetic" },
  { id: "work", label: "工作", icon: "💻", color: "#4ECDC4", bgGrad: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a2332 100%)", mood: "focused" },
  { id: "sleep", label: "睡前", icon: "🌙", color: "#A78BFA", bgGrad: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #24243e 100%)", mood: "calm" },
  { id: "exercise", label: "运动", icon: "🏃", color: "#F472B6", bgGrad: "linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #3d1f1f 100%)", mood: "intense" },
  { id: "relax", label: "放松", icon: "☕", color: "#FBBF24", bgGrad: "linear-gradient(135deg, #1a1708 0%, #2d2810 50%, #3d3518 100%)", mood: "mellow" },
];

const MOCK_TRACKS = {
  commute: [
    { title: "公路之歌", artist: "许巍", duration: "4:32" },
    { title: "奔跑", artist: "黄征", duration: "3:58" },
    { title: "旅行的意义", artist: "陈绮贞", duration: "4:15" },
  ],
  work: [
    { title: "Lo-fi Study Beat #1", artist: "ChilledCow", duration: "∞" },
    { title: "Rain + Coffee Shop", artist: "白噪声", duration: "∞" },
    { title: "Deep Focus Alpha", artist: "BrainWave", duration: "∞" },
  ],
  sleep: [
    { title: "夜曲", artist: "周杰伦", duration: "4:01" },
    { title: "Ocean Waves", artist: "白噪声", duration: "∞" },
    { title: "催眠播客 EP.12", artist: "安眠电台", duration: "28:30" },
  ],
  exercise: [
    { title: "Unstoppable", artist: "Sia", duration: "3:37" },
    { title: "Stronger", artist: "Kanye West", duration: "5:12" },
    { title: "倔强", artist: "五月天", duration: "4:16" },
  ],
  relax: [
    { title: "晴天", artist: "周杰伦", duration: "4:29" },
    { title: "小幸运", artist: "田馥甄", duration: "4:48" },
    { title: "下午茶爵士", artist: "Jazz Cafe", duration: "∞" },
  ],
};

// Visualizer component
function AudioVisualizer({ color, isPlaying }) {
  const bars = 24;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48, padding: "0 12px" }}>
      {Array.from({ length: bars }).map((_, i) => {
        const baseH = 8 + Math.sin(i * 0.7) * 6;
        const animH = isPlaying ? 12 + Math.random() * 36 : baseH;
        return (
          <div
            key={i}
            style={{
              width: 3,
              borderRadius: 2,
              backgroundColor: color,
              opacity: isPlaying ? 0.4 + Math.random() * 0.6 : 0.15,
              height: animH,
              transition: isPlaying ? `height ${0.15 + Math.random() * 0.25}s ease` : "height 0.8s ease",
            }}
          />
        );
      })}
    </div>
  );
}

// Scene ratio slider (the "滑动变阻器")
function SceneMixer({ scenes, ratios, onChange }) {
  const trackRef = useRef(null);
  const dragging = useRef(null);

  const handlePointerDown = (idx) => (e) => {
    e.preventDefault();
    dragging.current = idx;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = useCallback((e) => {
    if (dragging.current === null || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const newVal = Math.round((1 - y) * 100);
    const idx = dragging.current;
    const oldVal = ratios[idx];
    const diff = newVal - oldVal;
    if (diff === 0) return;

    const newRatios = [...ratios];
    newRatios[idx] = newVal;

    // redistribute diff among others proportionally
    const others = ratios.map((r, i) => (i === idx ? 0 : r));
    const othersSum = others.reduce((a, b) => a + b, 0);
    if (othersSum === 0) return;

    let remaining = -diff;
    for (let i = 0; i < newRatios.length; i++) {
      if (i === idx) continue;
      const share = Math.round((others[i] / othersSum) * remaining);
      newRatios[i] = Math.max(0, ratios[i] + share);
    }

    // normalize to 100
    const total = newRatios.reduce((a, b) => a + b, 0);
    if (total !== 100) {
      const fixIdx = newRatios.findIndex((_, i) => i !== idx && newRatios[i] > 0);
      if (fixIdx >= 0) newRatios[fixIdx] += 100 - total;
    }

    onChange(newRatios);
  }, [ratios, onChange]);

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove]);

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "stretch", height: 280, padding: "0 8px" }}>
      {scenes.map((scene, idx) => (
        <div key={scene.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'LXGW WenKai', serif" }}>
            {ratios[idx]}%
          </span>
          <div
            ref={idx === 0 ? trackRef : undefined}
            style={{
              flex: 1,
              width: 6,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 3,
              position: "relative",
              cursor: "pointer",
            }}
          >
            {/* filled portion */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: `${ratios[idx]}%`,
                backgroundColor: scene.color,
                borderRadius: 3,
                opacity: 0.6,
                transition: "height 0.15s ease",
              }}
            />
            {/* thumb */}
            <div
              onPointerDown={handlePointerDown(idx)}
              style={{
                position: "absolute",
                left: "50%",
                bottom: `${ratios[idx]}%`,
                transform: "translate(-50%, 50%)",
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: scene.color,
                border: "3px solid rgba(0,0,0,0.3)",
                cursor: "grab",
                boxShadow: `0 0 12px ${scene.color}66`,
                transition: "bottom 0.15s ease",
                touchAction: "none",
              }}
            />
          </div>
          <span style={{ marginTop: 8, fontSize: 20 }}>{scene.icon}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2, fontFamily: "'LXGW WenKai', serif" }}>
            {scene.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function EarOnly() {
  const [activeScene, setActiveScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showMixer, setShowMixer] = useState(false);
  const [ratios, setRatios] = useState([30, 25, 20, 15, 10]);
  const [progress, setProgress] = useState(0.35);
  const [visualizerKey, setVisualizerKey] = useState(0);

  const scene = SCENES[activeScene];
  const tracks = MOCK_TRACKS[scene.id];
  const track = tracks[currentTrack % tracks.length];

  // animate visualizer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => setVisualizerKey((k) => k + 1), 180);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // simulate progress
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.002)), 100);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const switchScene = (idx) => {
    setActiveScene(idx);
    setCurrentTrack(0);
    setProgress(0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: scene.bgGrad,
        transition: "background 0.8s ease",
        color: "#fff",
        fontFamily: "'LXGW WenKai', 'Noto Serif SC', Georgia, serif",
        display: "flex",
        justifyContent: "center",
        padding: "20px 0",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=LXGW+WenKai:wght@300;400;700&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px", marginBottom: 8 }}>
          <div>
            <h1 style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              letterSpacing: 2,
              background: `linear-gradient(135deg, #fff, ${scene.color})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              耳朵only
            </h1>
            <p style={{ fontSize: 11, margin: "2px 0 0", opacity: 0.4, letterSpacing: 1 }}>只为你的耳朵</p>
          </div>
          <button
            onClick={() => setShowMixer(!showMixer)}
            style={{
              background: showMixer ? `${scene.color}22` : "rgba(255,255,255,0.06)",
              border: `1px solid ${showMixer ? scene.color + "66" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 12,
              padding: "8px 14px",
              color: showMixer ? scene.color : "rgba(255,255,255,0.6)",
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
          >
            ⚙ 场景配比
          </button>
        </div>

        {/* Scene tabs */}
        <div style={{
          display: "flex",
          gap: 6,
          padding: "0 20px",
          marginBottom: 20,
          overflowX: "auto",
        }}>
          {SCENES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => switchScene(idx)}
              style={{
                flex: "0 0 auto",
                padding: "8px 16px",
                borderRadius: 20,
                border: "none",
                background: idx === activeScene
                  ? `linear-gradient(135deg, ${s.color}44, ${s.color}22)`
                  : "rgba(255,255,255,0.04)",
                color: idx === activeScene ? s.color : "rgba(255,255,255,0.4)",
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                boxShadow: idx === activeScene ? `0 0 20px ${s.color}22` : "none",
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Mixer panel (collapsible) */}
        {showMixer && (
          <div style={{
            margin: "0 20px 20px",
            padding: 20,
            borderRadius: 16,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{ fontSize: 12, opacity: 0.5, margin: "0 0 16px", textAlign: "center" }}>
              拖拽调整你的一天 · AI将学习你的习惯
            </p>
            <SceneMixer scenes={SCENES} ratios={ratios} onChange={setRatios} />
            <p style={{ fontSize: 10, opacity: 0.3, margin: "16px 0 0", textAlign: "center" }}>
              长期使用后，AI会在对应时段自动切换场景
            </p>
          </div>
        )}

        {/* Now Playing Card */}
        <div style={{
          margin: "0 20px",
          padding: 28,
          borderRadius: 20,
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
        }}>
          {/* Album art placeholder */}
          <div style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            margin: "0 auto 20px",
            background: `conic-gradient(from ${progress * 360}deg, ${scene.color}44, ${scene.color}11, ${scene.color}44)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: isPlaying ? "spin 8s linear infinite" : "none",
            boxShadow: isPlaying ? `0 0 40px ${scene.color}33` : "none",
            transition: "box-shadow 0.5s ease",
          }}>
            <div style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                background: `radial-gradient(circle at 40% 40%, ${scene.color}33, transparent)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
              }}>
                {scene.icon}
              </div>
            </div>
          </div>

          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{track.title}</h2>
          <p style={{ fontSize: 13, opacity: 0.5, margin: "0 0 20px" }}>{track.artist}</p>

          {/* Visualizer */}
          <div key={visualizerKey} style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <AudioVisualizer color={scene.color} isPlaying={isPlaying} />
          </div>

          {/* Progress bar */}
          <div style={{
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.08)",
            marginBottom: 20,
            cursor: "pointer",
            position: "relative",
          }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress((e.clientX - rect.left) / rect.width);
            }}
          >
            <div style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: scene.color,
              borderRadius: 2,
              transition: "width 0.1s linear",
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                right: -5,
                top: -4,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: scene.color,
                boxShadow: `0 0 8px ${scene.color}88`,
              }} />
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32 }}>
            <button
              onClick={() => { setCurrentTrack((c) => (c - 1 + tracks.length) % tracks.length); setProgress(0); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22, cursor: "pointer", padding: 8 }}
            >⏮</button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: `linear-gradient(135deg, ${scene.color}, ${scene.color}cc)`,
                border: "none",
                width: 56,
                height: 56,
                borderRadius: 28,
                color: "#000",
                fontSize: 22,
                cursor: "pointer",
                boxShadow: `0 4px 24px ${scene.color}44`,
                transition: "all 0.2s ease",
              }}
            >{isPlaying ? "⏸" : "▶"}</button>
            <button
              onClick={() => { setCurrentTrack((c) => (c + 1) % tracks.length); setProgress(0); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22, cursor: "pointer", padding: 8 }}
            >⏭</button>
          </div>
        </div>

        {/* Playlist */}
        <div style={{ margin: "20px 20px 0", padding: "16px 0" }}>
          <h3 style={{ fontSize: 13, opacity: 0.4, margin: "0 0 12px", letterSpacing: 1 }}>
            {scene.label}模式 · 播放列表
          </h3>
          {tracks.map((t, idx) => (
            <div
              key={idx}
              onClick={() => { setCurrentTrack(idx); setProgress(0); setIsPlaying(true); }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: 12,
                marginBottom: 4,
                cursor: "pointer",
                background: idx === currentTrack % tracks.length ? `${scene.color}11` : "transparent",
                border: idx === currentTrack % tracks.length ? `1px solid ${scene.color}22` : "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `${scene.color}${idx === currentTrack % tracks.length ? "33" : "11"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                marginRight: 12,
                color: scene.color,
              }}>
                {idx === currentTrack % tracks.length && isPlaying ? "♫" : idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: 0,
                  fontSize: 14,
                  color: idx === currentTrack % tracks.length ? scene.color : "rgba(255,255,255,0.8)",
                }}>{t.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.4 }}>{t.artist}</p>
              </div>
              <span style={{ fontSize: 11, opacity: 0.3 }}>{t.duration}</span>
            </div>
          ))}
        </div>

        {/* Bottom hint */}
        <div style={{ textAlign: "center", padding: "24px 20px 12px", opacity: 0.2, fontSize: 10, letterSpacing: 1 }}>
          打开即听 · 无推荐 · 无干扰
        </div>
      </div>
    </div>
  );
}
