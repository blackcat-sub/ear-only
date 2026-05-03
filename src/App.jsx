import { useState, useEffect, useRef, useCallback } from "react";
import Player from "./components/Player.jsx";
import EnergyTimeline from "./components/EnergyTimeline.jsx";
import EnergyCheckin from "./components/EnergyCheckin.jsx";
import AudioLibrary from "./components/AudioLibrary.jsx";

const DEFAULT_CURVE = Array(24).fill(2);

const ENERGY_COLORS = {
  high: "rgba(255,107,53,0.10)",
  mid:  "rgba(251,191,36,0.08)",
  low:  "rgba(78,205,196,0.08)",
};

const NAV_ITEMS = [
  { id: "timeline", icon: "⏱", label: "精力曲线" },
  { id: "checkin",  icon: "❓", label: "精力检测" },
  { id: "library",  icon: "📂", label: "音乐库" },
];

export default function App() {
  const [view, setView] = useState("player");
  const [energyCurve, setEnergyCurve] = useState(DEFAULT_CURVE);
  const [energyLevel, setEnergyLevel] = useState("mid");
  const [library, setLibrary] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.85;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    audio.addEventListener("ended", () => { setIsPlaying(false); setProgress(0); });
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.url;
    audio.load();
    audio.play().catch(() => {});
    setProgress(0);
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (!audio.src && library.length > 0) { setCurrentTrack(library[0]); return; }
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [library]);

  const handleSeek = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const pct = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
    audio.currentTime = pct * audio.duration;
    setProgress(pct);
  }, []);

  const handleEnergyChange = useCallback((level) => {
    setEnergyLevel(level);
  }, []);

  const handleSelectTrack = useCallback((track) => {
    setCurrentTrack(track);
    setView("player");
  }, []);

  const handleAddTracks = useCallback((tracks) => {
    setLibrary((prev) => [...prev, ...tracks]);
    if (!currentTrack) setCurrentTrack(tracks[0]);
  }, [currentTrack]);

  const handleRemoveTrack = useCallback((id) => {
    setLibrary((prev) => prev.filter((t) => t.id !== id));
    if (currentTrack?.id === id) {
      const remaining = library.filter((t) => t.id !== id);
      setCurrentTrack(remaining[0] || null);
    }
  }, [library, currentTrack]);

  const glowColor = ENERGY_COLORS[energyLevel] || ENERGY_COLORS.mid;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#08090b",
      color: "#fff",
      fontFamily: "'LXGW WenKai', 'Noto Serif SC', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=LXGW+WenKai:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* Ambient glow */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        width: 500,
        height: 500,
        marginLeft: -250,
        marginTop: -280,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        transition: "background 0.8s ease",
        pointerEvents: "none",
      }} />

      {/* CSS animations */}
      <style>{`
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Views */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {view === "player" && (
          <Player
            energyLevel={energyLevel}
            onEnergyChange={handleEnergyChange}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            currentTrack={currentTrack}
            progress={progress}
            onSeek={handleSeek}
          />
        )}
        {view === "timeline" && (
          <EnergyTimeline curve={energyCurve} onChange={setEnergyCurve} onClose={() => setView("player")} />
        )}
        {view === "checkin" && (
          <EnergyCheckin
            onComplete={(r) => { setEnergyLevel(r.id); setView("player"); }}
            onQuickSelect={(l) => { setEnergyLevel(l); setView("player"); }}
          />
        )}
        {view === "library" && (
          <AudioLibrary
            tracks={library}
            onAddTrack={handleAddTracks}
            onSelectTrack={handleSelectTrack}
            onRemoveTrack={handleRemoveTrack}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: "0 20px 28px",
        display: "flex",
        justifyContent: "center",
        gap: 4,
      }}>
        {view === "player" ? (
          NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                border: "none",
                background: "rgba(255,255,255,0.02)",
                color: "rgba(255,255,255,0.25)",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: 0.5,
                transition: "color 0.3s ease",
              }}
            >
              <span style={{ marginRight: 4 }}>{item.icon}</span>
              {item.label}
              {item.id === "library" && library.length > 0 && (
                <span style={{ marginLeft: 3, opacity: 0.5 }}>{library.length}</span>
              )}
            </button>
          ))
        ) : (
          <button
            onClick={() => setView("player")}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: "none",
              background: "rgba(255,255,255,0.02)",
              color: "rgba(255,255,255,0.30)",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: 0.5,
            }}
          >
            ← 返回
          </button>
        )}
      </div>
    </div>
  );
}
