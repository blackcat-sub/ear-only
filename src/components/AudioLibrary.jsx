import { useRef, useState } from "react";

function fmtDuration(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioLibrary({ tracks, onAddTrack, onSelectTrack, onRemoveTrack }) {
  const fileRef = useRef(null);
  const [importing, setImporting] = useState(false);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImporting(true);

    const next = [];
    let done = 0;
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const a = new Audio();
      a.addEventListener("loadedmetadata", () => {
        next.push({
          id: Date.now() + Math.random().toString(36),
          title: file.name.replace(/\.[^.]+$/, ""),
          artist: "本地音频",
          duration: fmtDuration(a.duration || 0),
          url,
          file,
          energyLabel: "",
        });
        done++;
        if (done === files.length) { onAddTrack(next); setImporting(false); }
      });
      a.src = url;
    });
  };

  return (
    <div style={{ padding: "48px 20px", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "rgba(255,255,255,0.85)", fontFamily: "'LXGW WenKai', serif" }}>
        本地音乐库
      </h2>
      <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.25)", margin: "4px 0 32px" }}>
        {tracks.length === 0 ? "导入你的音频文件" : `${tracks.length} 首音频`}
      </p>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <input ref={fileRef} type="file" accept="audio/*" multiple onChange={handleFiles} style={{ display: "none" }} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          style={{
            padding: "14px 32px",
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.02)",
            color: importing ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.50)",
            fontSize: 14,
            cursor: importing ? "default" : "pointer",
            fontFamily: "'LXGW WenKai', serif",
            transition: "all 0.3s ease",
            letterSpacing: 0.5,
          }}
        >
          {importing ? "导入中..." : "📂  导入音频文件"}
        </button>
      </div>

      {tracks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, margin: "0 auto" }}>
          {tracks.map((t, idx) => (
            <div
              key={t.id || idx}
              onClick={() => onSelectTrack(t)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: 12,
                cursor: "pointer",
                background: "transparent",
                transition: "background 0.15s ease",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, marginRight: 14,
              }}>
                🎵
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {t.title}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.20)" }}>
                  {t.duration}
                </p>
              </div>
              <button
                onClick={(ev) => { ev.stopPropagation(); onRemoveTrack(t.id); }}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.12)", fontSize: 14,
                  cursor: "pointer", padding: 4,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.08)", marginTop: 40 }}>
        mp3 · wav · ogg · m4a · aac
      </p>
    </div>
  );
}
