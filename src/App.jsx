import { useState, useEffect, useRef, useCallback } from "react";
import Player from "./components/Player.jsx";
import EnergyTimeline from "./components/EnergyTimeline.jsx";
import EnergyCheckin from "./components/EnergyCheckin.jsx";
import AudioLibrary from "./components/AudioLibrary.jsx";

const DEFAULT_CURVE = Array(24).fill(2);

function getCurrentHourEnergy(curve) {
  const hour = new Date().getHours();
  return curve[hour] || 2;
}

export default function App() {
  const [view, setView] = useState("player");
  const [energyCurve, setEnergyCurve] = useState(DEFAULT_CURVE);
  const [energyLevel, setEnergyLevel] = useState("mid");
  const [library, setLibrary] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
    });

    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // When track changes, load and play
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
      if (!audio.src && library.length > 0) {
        setCurrentTrack(library[0]);
        return;
      }
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [library]);

  const handleSeek = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
    setProgress(pct);
  }, []);

  const handleEnergyChange = useCallback((level) => {
    setEnergyLevel(level);
    // Filter library tracks by energy level if tagged, otherwise pick any
    const matching = library.filter((t) => !t.energyLabel || t.energyLabel === level);
    const candidates = matching.length > 0 ? matching : library;
    if (candidates.length > 0 && currentTrack) {
      const idx = candidates.findIndex((t) => t.id === currentTrack.id);
      const next = candidates[(idx + 1) % candidates.length];
      if (next && next.id !== currentTrack.id) {
        setCurrentTrack(next);
      }
    }
  }, [library, currentTrack]);

  const handleSelectTrack = useCallback((track) => {
    setCurrentTrack(track);
    setView("player");
  }, []);

  const handleAddTracks = useCallback((tracks) => {
    setLibrary((prev) => [...prev, ...tracks]);
    if (!currentTrack) {
      setCurrentTrack(tracks[0]);
    }
  }, [currentTrack]);

  const handleRemoveTrack = useCallback((id) => {
    setLibrary((prev) => prev.filter((t) => t.id !== id));
    if (currentTrack?.id === id) {
      const remaining = library.filter((t) => t.id !== id);
      setCurrentTrack(remaining[0] || null);
    }
  }, [library, currentTrack]);

  // Auto-apply energy curve every hour
  useEffect(() => {
    const hour = new Date().getHours();
    const curveEnergy = energyCurve[hour];
    const levels = ["low", "mid", "high"];
    const level = levels[curveEnergy - 1] || "mid";
    // Apply curve-based energy, but don't override manual selection immediately
    const timer = setInterval(() => {
      const currentHour = new Date().getHours();
      const ce = energyCurve[currentHour];
      const l = levels[ce - 1] || "mid";
      // Only auto-switch if user hasn't manually selected in the last 30 min
      // For simplicity, just set it
      setEnergyLevel(l);
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [energyCurve]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a2332 100%)",
      color: "#fff",
      fontFamily: "'LXGW WenKai', 'Noto Serif SC', Georgia, serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=LXGW+WenKai:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* Main content */}
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
        <EnergyTimeline
          curve={energyCurve}
          onChange={setEnergyCurve}
          onClose={() => setView("player")}
        />
      )}

      {view === "checkin" && (
        <EnergyCheckin
          onComplete={(result) => {
            setEnergyLevel(result.id);
            setView("player");
          }}
          onQuickSelect={(level) => {
            setEnergyLevel(level);
            setView("player");
          }}
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

      {/* Bottom navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 8,
        padding: "12px 20px 24px",
        background: "linear-gradient(transparent, rgba(13,17,23,0.95) 40%)",
      }}>
        {view === "player" ? (
          <>
            <NavBtn
              icon="⏱"
              label="精力曲线"
              onClick={() => setView("timeline")}
            />
            <NavBtn
              icon="❓"
              label="精力检测"
              onClick={() => setView("checkin")}
            />
            <NavBtn
              icon="📂"
              label={`音乐库${library.length > 0 ? ` (${library.length})` : ""}`}
              onClick={() => setView("library")}
            />
          </>
        ) : (
          <NavBtn
            icon="←"
            label="返回"
            onClick={() => setView("player")}
          />
        )}
      </div>
    </div>
  );
}

function NavBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
        cursor: "pointer",
        fontFamily: "'LXGW WenKai', serif",
        transition: "all 0.2s ease",
      }}
    >
      {icon} {label}
    </button>
  );
}
