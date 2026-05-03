import { useRef, useEffect } from "react";

const ENERGY = [
  { id: "high", label: "高精力", icon: "⚡", color: "#FF6B35", glow: "rgba(255,107,53,0.25)" },
  { id: "mid",  label: "中精力", icon: "🎧", color: "#FBBF24", glow: "rgba(251,191,36,0.20)" },
  { id: "low",  label: "低精力", icon: "🌿", color: "#4ECDC4", glow: "rgba(78,205,196,0.20)" },
];

export default function Player({
  energyLevel,
  onEnergyChange,
  isPlaying,
  onTogglePlay,
  currentTrack,
  progress,
  onSeek,
  visualizerKey,
}) {
  const ringRef = useRef(null);
  const preset = ENERGY.find((p) => p.id === energyLevel) || ENERGY[1];

  // ring rotation animation
  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    el.style.animationPlayState = isPlaying ? "running" : "paused";
  }, [isPlaying]);

  return (
    <div style={styles.container}>
      {/* Energy pill selector */}
      <div style={styles.energyPill}>
        {ENERGY.map((e) => {
          const active = energyLevel === e.id;
          return (
            <button
              key={e.id}
              onClick={() => onEnergyChange(e.id)}
              style={{
                ...styles.energyOption,
                color: active ? "#fff" : "rgba(255,255,255,0.30)",
                background: active ? `${e.color}18` : "transparent",
                boxShadow: active ? `0 0 20px ${e.glow}` : "none",
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{e.icon}</span>
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, letterSpacing: 1 }}>
                {e.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Play button + ring */}
      <div style={styles.playArea}>
        {/* outer breathing ring */}
        <div
          ref={ringRef}
          style={{
            ...styles.ring,
            borderColor: `${preset.color}22`,
            boxShadow: isPlaying
              ? `0 0 60px ${preset.glow}, 0 0 120px ${preset.glow}, inset 0 0 60px ${preset.glow}`
              : `0 0 30px ${preset.glow}`,
          }}
        />
        {/* inner glow */}
        <div
          style={{
            ...styles.innerGlow,
            background: `radial-gradient(circle, ${preset.color}18 0%, transparent 70%)`,
            opacity: isPlaying ? 1 : 0.5,
          }}
        />
        {/* play button */}
        <button onClick={onTogglePlay} style={styles.playBtn(preset, isPlaying)}>
          <span style={{ marginLeft: isPlaying ? 0 : 4 }}>
            {isPlaying ? "⏸" : "▶"}
          </span>
        </button>
        {/* rotating dot on ring */}
        <div
          style={{
            ...styles.ringDot,
            background: preset.color,
            boxShadow: `0 0 12px ${preset.color}`,
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        />
      </div>

      {/* Track info */}
      <div style={styles.trackInfo}>
        {currentTrack ? (
          <>
            <p style={styles.trackTitle}>{currentTrack.title}</p>
            <p style={styles.trackArtist}>{currentTrack.artist}</p>
          </>
        ) : (
          <p style={styles.emptyHint}>导入音频开始收听</p>
        )}
      </div>

      {/* Progress bar */}
      {currentTrack && (
        <div onClick={onSeek} style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(progress || 0) * 100}%`,
              background: preset.color,
              boxShadow: `0 0 6px ${preset.color}66`,
            }}
          />
          <div
            style={{
              ...styles.progressThumb,
              left: `${(progress || 0) * 100}%`,
              background: preset.color,
              boxShadow: `0 0 12px ${preset.color}`,
            }}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "60px 24px 120px",
  },
  energyPill: {
    display: "flex",
    gap: 4,
    padding: 4,
    borderRadius: 28,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    marginBottom: 64,
  },
  energyOption: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    borderRadius: 24,
    border: "none",
    cursor: "pointer",
    transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
    fontFamily: "'LXGW WenKai', serif",
    whiteSpace: "nowrap",
  },
  playArea: {
    position: "relative",
    width: 240,
    height: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "2px solid",
    transition: "box-shadow 0.8s ease, border-color 0.8s ease",
    animation: "ringPulse 3s ease-in-out infinite",
  },
  innerGlow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: "50%",
    pointerEvents: "none",
    transition: "opacity 0.8s ease, background 0.8s ease",
  },
  playBtn: (preset, isPlaying) => ({
    position: "relative",
    zIndex: 2,
    width: 130,
    height: 130,
    borderRadius: "50%",
    border: `1px solid ${preset.color}22`,
    background: `radial-gradient(circle at 50% 40%, ${preset.color}18, ${preset.color}06)`,
    color: preset.color,
    fontSize: 42,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
    boxShadow: isPlaying
      ? `0 0 40px ${preset.glow}, inset 0 0 20px ${preset.glow}`
      : `0 0 20px ${preset.glow}`,
  }),
  ringDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: "50%",
    top: 2,
    left: "50%",
    marginLeft: -3,
    animation: "spin 8s linear infinite",
    transformOrigin: "3px 118px",
    zIndex: 3,
  },
  trackInfo: {
    marginTop: 48,
    minHeight: 52,
    textAlign: "center",
  },
  trackTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 500,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 0.5,
  },
  trackArtist: {
    margin: "4px 0 0",
    fontSize: 12,
    color: "rgba(255,255,255,0.30)",
    letterSpacing: 0.5,
  },
  emptyHint: {
    margin: 0,
    fontSize: 13,
    color: "rgba(255,255,255,0.18)",
  },
  progressTrack: {
    width: "100%",
    maxWidth: 200,
    height: 2,
    borderRadius: 1,
    background: "rgba(255,255,255,0.06)",
    marginTop: 36,
    cursor: "pointer",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1,
    transition: "width 0.3s linear",
  },
  progressThumb: {
    position: "absolute",
    top: -3,
    width: 8,
    height: 8,
    borderRadius: "50%",
    marginLeft: -4,
    transition: "left 0.3s linear",
  },
};
