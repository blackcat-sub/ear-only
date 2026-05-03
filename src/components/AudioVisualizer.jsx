// Reusable audio visualizer — animated bars
export default function AudioVisualizer({ color, isPlaying }) {
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
