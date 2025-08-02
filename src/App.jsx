import { useState, useRef } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import TextDisplay from "@/components/TextDisplay";
import ThemeSwitch from "@/components/ThemeSwitch";
import TrackList from "@/components/TrackList";

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);

  const trackSelectRef = useRef();
  const playPauseRef = useRef();

  const handleTrackChange = (track) => {
    setCurrentTrack(track);
  };

  const handleTrackSelect = (track) => {
    if (trackSelectRef.current) {
      trackSelectRef.current(track);
    }
  };


  const handlePlayingStateChange = (playing) => {
    setIsPlaying(playing);
  };

  return (
    <div className="container gap-2  flex flex-col p-2">
      <div className=" top-0 fixed right-0 p-4">
        <ThemeSwitch />
      </div>
      {showText && (
        <TextDisplay
          textUrl={currentTrack?.text}
          title={currentTrack?.title}
        />
      )}
      {!showText && (
        <TrackList
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTrackSelect={handleTrackSelect}
        />
      )}

      <MusicPlayer
        onTrackChange={handleTrackChange}
        showText={() => setShowText(!showText)}
        trackSelectMethod={trackSelectRef}
        playPauseMethod={playPauseRef}
        onPlayingStateChange={handlePlayingStateChange}
      />

    </div>
  );
}

export default App
