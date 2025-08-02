import { useState, useRef } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import TextDisplay from "@/components/TextDisplay";
import ThemeSwitch from "@/components/ThemeSwitch";
import TrackList from "@/components/TrackList";
import { PlusIcon, MinusIcon } from "lucide-react";

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const [fontSize, setFontSize] = useState(16);

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

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24)); // Max font size of 24px
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10)); // Min font size of 10px
  };

  return (
    <div className="container gap-2  flex flex-col ">
      <div className=" top-0 fixed right-0 p-4">
        <div className="flex items-center gap-2">
          {showText && (
            <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-lg p-1">
              <button
                onClick={decreaseFontSize}
                className="w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center text-sm font-mono"
                title="Decrease font size"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground px-1">
                {fontSize}px
              </span>
              <button
                onClick={increaseFontSize}
                className="w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center text-sm font-mono"
                title="Increase font size"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          <ThemeSwitch />

        </div>
      </div>
      {showText && (
        <TextDisplay
          textUrl={currentTrack?.text}
          title={currentTrack?.title}
          fontSize={fontSize}
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
