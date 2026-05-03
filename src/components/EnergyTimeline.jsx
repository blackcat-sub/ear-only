import { useRef, useCallback } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_LABELS = [0, 6, 12, 18, 23];

function energyColor(level) {
  if (level >= 3) return "#FF6B35";
  if (level >= 2) return "#FBBF24";
  return "#4ECDC4";
}

function energyLabel(level) {
  if (level >= 3) return "高精力";
  if (level >= 2) return "中精力";
  return "低精力";
}

function energyIcon(level) {
  if (level >= 3) return "⚡";
  if (level >= 2) return "🎧";
  return "🌿";
}

export default function EnergyTimeline({ curve, onChange, onClose }) {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  const getValueFromEvent = useCallback((e) => {
    if (!trackRef.current) return null;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hour = Math.floor((x / rect.width) * 24);
    if (hour < 0 || hour >= 24) return null;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    const val = Math.max(1, Math.min(3, Math.round(y * 3)));
    return { hour, val };
  }, []);

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    const result = getValueFromEvent(e);
    if (result) {
      const next = [...curve];
      next[result.hour] = result.val;
      onChange(next);
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const result = getValueFromEvent(e);
    if (result) {
      const next = [...curve];
      next[result.hour] = result.val;
      onChange(next);
    }
  }, [curve, onChange, getValueFromEvent]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove]);

  const avg = Math.round(curve.reduce((a, b) => a + b, 0) / 24);

  return (
    <div style={{ padding: "32px 20px", textAlign: "center" }}>
      <h2 style={{
        fontSize: 20,
        fontWeight: 700,
        margin: "0 0 4px",
        color: "rgba(255,255,255,0.9)",
        fontFamily: "'LXGW WenKai', serif",
      }}>
        24小时精力曲线
      </h2>
      <p style={{ fontSize: 13, opacity: 0.4, margin: "0 0 24px" }}>
        画出你一天的精力起伏
      </p>

      {/* Current average indicator */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        marginBottom: 24,
        fontSize: 14,
        color: energyColor(avg),
      }}>
        {energyIcon(avg)} 今日精力基准：{energyLabel(avg)}
      </div>

      {/* Timeline chart */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        {/* Y-axis labels */}
        <div style={{
          position: "absolute",
          left: -32,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontSize: 10,
          color: "rgba(255,255,255,0.25)",
          padding: "4px 0",
        }}>
          <span>高</span>
          <span>中</span>
          <span>低</span>
        </div>

        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            height: 180,
            padding: "4px 0",
            cursor: "pointer",
            touchAction: "none",
            position: "relative",
          }}
        >
          {/* Grid lines */}
          {[0, 1, 2].map((line) => (
            <div
              key={line}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${(line / 2) * 100}%`,
                height: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            />
          ))}

          {curve.map((val, hour) => (
            <div
              key={hour}
              style={{
                flex: 1,
                height: `${(val / 3) * 100}%`,
                backgroundColor: energyColor(val),
                borderRadius: "2px 2px 0 0",
                opacity: 0.7,
                transition: "height 0.15s ease",
                minWidth: 6,
              }}
            />
          ))}
        </div>

        {/* X-axis hour labels */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "rgba(255,255,255,0.2)",
          padding: "8px 0 0",
        }}>
          {HOUR_LABELS.map((h) => (
            <span key={h}>{h}:00</span>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, opacity: 0.25, margin: 0 }}>
        上下拖拽调整每个小时的精力档位
      </p>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginTop: 24,
            padding: "10px 32px",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "'LXGW WenKai', serif",
          }}
        >
          完成
        </button>
      )}
    </div>
  );
}
