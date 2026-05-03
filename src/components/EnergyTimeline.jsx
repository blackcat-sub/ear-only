import { useRef, useCallback, useState } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function colorFor(val) {
  if (val >= 3) return "#FF6B35";
  if (val >= 2) return "#FBBF24";
  return "#4ECDC4";
}

export default function EnergyTimeline({ curve, onChange, onClose }) {
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const [hoveredHour, setHoveredHour] = useState(null);

  const getFromEvent = useCallback((e) => {
    if (!trackRef.current) return null;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hour = Math.floor((x / rect.width) * 24);
    if (hour < 0 || hour >= 24) return null;
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const val = Math.round((1 - y) * 2) + 1;
    return { hour, val };
  }, []);

  const handleDown = (e) => {
    dragging.current = true;
    const r = getFromEvent(e);
    if (r) onChange(curve.map((v, i) => i === r.hour ? r.val : v));
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const handleMove = useCallback((e) => {
    if (!dragging.current) return;
    const r = getFromEvent(e);
    if (r) onChange(curve.map((v, i) => i === r.hour ? r.val : v));
  }, [curve, onChange, getFromEvent]);

  const handleUp = useCallback(() => {
    dragging.current = false;
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleUp);
  }, [handleMove]);

  const avg = Math.round(curve.reduce((a, b) => a + b, 0) / 24 * 10) / 10;

  return (
    <div style={s.container}>
      <h2 style={s.title}>24小时精力曲线</h2>
      <p style={s.subtitle}>画出你一天的精力起伏，上下拖拽调整每小时</p>

      {/* Average badge */}
      <div style={s.badge}>
        <span style={{ ...s.badgeDot, background: colorFor(Math.round(avg)) }} />
        今日基准 · {avg >= 2.5 ? "偏高" : avg >= 1.5 ? "适中" : "偏低"}
      </div>

      {/* Chart */}
      <div style={s.chartWrap}>
        {/* Y labels */}
        <div style={s.yAxis}>
          <span>高</span>
          <span>中</span>
          <span>低</span>
        </div>

        <div
          ref={trackRef}
          onPointerDown={handleDown}
          onPointerMove={(e) => {
            if (!dragging.current) {
              const r = getFromEvent(e);
              setHoveredHour(r?.hour ?? null);
            }
          }}
          onPointerLeave={() => setHoveredHour(null)}
          style={s.chart}
        >
          {/* Grid lines */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ ...s.gridLine, bottom: `${(i / 2) * 100}%` }} />
          ))}

          {curve.map((val, hour) => {
            const isHovered = hoveredHour === hour;
            return (
              <div key={hour} style={s.barWrap}>
                <div
                  style={{
                    ...s.bar,
                    height: `${(val / 3) * 100}%`,
                    background: colorFor(val),
                    opacity: isHovered ? 1 : 0.55,
                    borderRadius: "3px 3px 0 0",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X labels */}
        <div style={s.xAxis}>
          {[0, 6, 12, 18, 23].map((h) => (
            <span key={h} style={s.xLabel}>{h}:00</span>
          ))}
        </div>
      </div>

      <p style={s.hint}>拖拽每个小时的高度来编辑精力档位</p>

      <button onClick={onClose} style={s.doneBtn}>完成</button>
    </div>
  );
}

const s = {
  container: {
    padding: "48px 20px 32px",
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "'LXGW WenKai', serif",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.30)",
    margin: "4px 0 24px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 16px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.04)",
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginBottom: 32,
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%",
  },
  chartWrap: {
    position: "relative",
    width: "100%",
    maxWidth: 360,
    paddingLeft: 28,
    paddingRight: 2,
  },
  yAxis: {
    position: "absolute",
    left: 0,
    top: 4,
    bottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontSize: 10,
    color: "rgba(255,255,255,0.15)",
  },
  chart: {
    display: "flex",
    alignItems: "flex-end",
    gap: 2,
    height: 180,
    padding: "4px 0",
    cursor: "pointer",
    touchAction: "none",
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    background: "rgba(255,255,255,0.03)",
  },
  barWrap: {
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
    minWidth: 6,
  },
  bar: {
    width: "100%",
    transition: "height 0.2s ease, opacity 0.15s ease",
  },
  xAxis: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 6,
  },
  xLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.15)",
  },
  hint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.15)",
    marginTop: 24,
  },
  doneBtn: {
    marginTop: 32,
    padding: "10px 36px",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.60)",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'LXGW WenKai', serif",
    letterSpacing: 1,
  },
};
