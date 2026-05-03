const ENERGY_PRESETS = [
  { id: "high", label: "高精力", icon: "⚡", color: "#FF6B35", density: "高密度" },
  { id: "mid", label: "中精力", icon: "🎧", color: "#FBBF24", density: "中密度" },
  { id: "low", label: "低精力", icon: "🌿", color: "#4ECDC4", density: "低密度" },
];

export default function Player({
  energyLevel,
  onEnergyChange,
  isPlaying,
  onTogglePlay,
  currentTrack,
  progress,
  onSeek,
}) {
  const preset = ENERGY_PRESETS.find((p) => p.id === energyLevel) || ENERGY_PRESETS[1];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "40px 20px",
      textAlign: "center",
    }}>
      {/* Energy slider */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 48,
        padding: "6px",
        borderRadius: 28,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {ENERGY_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onEnergyChange(p.id)}
            style={{
              padding: "10px 20px",
              borderRadius: 24,
              border: "none",
              background: energyLevel === p.id ? `${p.color}22` : "transparent",
              color: energyLevel === p.id ? p.color : "rgba(255,255,255,0.3)",
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "'LXGW WenKai', serif",
              boxShadow: energyLevel === p.id ? `0 0 16px ${p.color}11` : "none",
            }}
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {/* Play button */}
      <button
        onClick={onTogglePlay}
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          border: `2px solid ${preset.color}33`,
          background: `linear-gradient(135deg, ${preset.color}22, ${preset.color}11)`,
          color: preset.color,
          fontSize: 40,
          cursor: "pointer",
          boxShadow: isPlaying ? `0 0 80px ${preset.color}33` : `0 0 40px ${preset.color}11`,
          transition: "all 0.4s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Current track info */}
      <div style={{ marginTop: 32, minHeight: 48 }}>
        {currentTrack ? (
          <>
            <p style={{
              margin: 0,
              fontSize: 15,
              color: "rgba(255,255,255,0.8)",
              fontWeight: 500,
            }}>
              {currentTrack.title}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, opacity: 0.35 }}>
              {currentTrack.artist}
            </p>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 13, opacity: 0.25 }}>
            导入音频或开始播放
          </p>
        )}
      </div>

      {/* Progress bar */}
      {currentTrack && (
        <div
          onClick={onSeek}
          style={{
            width: "100%",
            maxWidth: 280,
            height: 3,
            borderRadius: 2,
            background: "rgba(255,255,255,0.08)",
            marginTop: 24,
            cursor: "pointer",
          }}
        >
          <div style={{
            height: "100%",
            width: `${(progress || 0) * 100}%`,
            background: preset.color,
            borderRadius: 2,
            transition: "width 0.3s linear",
          }} />
        </div>
      )}

      {/* Density hint */}
      <p style={{ fontSize: 11, opacity: 0.2, marginTop: 40 }}>
        {preset.icon} {preset.density}内容
      </p>
    </div>
  );
}
