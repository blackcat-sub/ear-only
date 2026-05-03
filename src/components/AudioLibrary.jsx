import { useRef, useState, useEffect } from "react";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioLibrary({ tracks, onAddTrack, onSelectTrack, onRemoveTrack }) {
  const fileRef = useRef(null);
  const [importing, setImporting] = useState(false);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImporting(true);

    const newTracks = [];
    let loaded = 0;
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        newTracks.push({
          id: Date.now() + Math.random().toString(36),
          title: file.name.replace(/\.[^.]+$/, ""),
          artist: "本地音频",
          duration: formatDuration(audio.duration || 0),
          url,
          file,
          energyLabel: "",
        });
        loaded++;
        if (loaded === files.length) {
          onAddTrack(newTracks);
          setImporting(false);
        }
      });
      audio.src = url;
    });
  };

  return (
    <div style={{ padding: "24px 20px" }}>
      <h2 style={{
        fontSize: 20,
        fontWeight: 700,
        margin: "0 0 4px",
        color: "rgba(255,255,255,0.9)",
        fontFamily: "'LXGW WenKai', serif",
        textAlign: "center",
      }}>
        本地音乐库
      </h2>
      <p style={{ fontSize: 13, opacity: 0.4, margin: "0 0 24px", textAlign: "center" }}>
        {tracks.length === 0 ? "导入你的音频文件开始收听" : `${tracks.length} 首音频`}
      </p>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFiles}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          style={{
            padding: "14px 28px",
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.04)",
            color: importing ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)",
            fontSize: 14,
            cursor: importing ? "default" : "pointer",
            fontFamily: "'LXGW WenKai', serif",
          }}
        >
          {importing ? "导入中..." : "📂 导入音频文件"}
        </button>
      </div>

      {tracks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tracks.map((t, idx) => (
            <div
              key={t.id || idx}
              onClick={() => onSelectTrack(t)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: 12,
                cursor: "pointer",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.04)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                marginRight: 12,
              }}>
                🎵
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>{t.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.3 }}>{t.duration}</p>
              </div>
              {onRemoveTrack && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveTrack(t.id); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: 16,
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 10, opacity: 0.15, textAlign: "center", marginTop: 32 }}>
        支持 mp3, wav, ogg, m4a 等常见格式
      </p>
    </div>
  );
}
