
import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, } from "lucide-react";
import { audioList } from "@/data/audioData";

import SkipBack from "/skip-back.png"
import SkipForward from "/skip-forward.png"


const STORAGE_KEY = "osho-music-player-state";


function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatRemainingTime(currentTime, duration) {
    const remaining = duration - currentTime;
    if (!remaining || isNaN(remaining)) return "-0:00";
    return "-" + formatTime(remaining);
}



export default function MusicPlayer({ onTrackChange, showText, trackSelectMethod, playPauseMethod, onPlayingStateChange }) {

    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const [current, setCurrent] = useState(audioList[0]);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const { id, currentTime, playing } = JSON.parse(saved);
            const found = audioList.find((a) => a.id === id);
            if (found) {
                setCurrent(found);
                setPlaying(playing);
                setTimeout(() => {
                    if (audioRef.current) {
                        audioRef.current.currentTime = currentTime || 0;
                        if (playing) audioRef.current.play();
                    }
                }, 500);
            }
        }
    }, []);

    useEffect(() => {
        if (onTrackChange) {
            onTrackChange(current);
        }
    }, [current, onTrackChange]);

    useEffect(() => {
        if (!audioRef.current) return;
        const hls = new Hls();
        hls.loadSource(current.url);
        hls.attachMedia(audioRef.current);

        return () => {
            hls.destroy();
        };
    }, [current]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        id: current.id,
                        currentTime: audioRef.current.currentTime,
                        playing: !audioRef.current.paused
                    })
                );
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [current]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;
        const newPlayingState = !playing;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(newPlayingState);
        if (onPlayingStateChange) {
            onPlayingStateChange(newPlayingState);
        }
    }, [playing, onPlayingStateChange]);

    const skipBackward = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    };

    const skipForward = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15);
    };

    const handleChangeTrack = (e) => {
        const newTrack = audioList.find((a) => a.id === parseInt(e.target.value));
        selectTrack(newTrack);
    };

    const selectTrack = useCallback((newTrack) => {
        setCurrent(newTrack);
        setPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        if (onPlayingStateChange) {
            onPlayingStateChange(false);
        }
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                id: newTrack.id,
                currentTime: 0,
                playing: false
            })
        );
    }, [onPlayingStateChange]);

    // Expose methods to parent component through refs
    useEffect(() => {
        if (trackSelectMethod) {
            trackSelectMethod.current = selectTrack;
        }
    }, [trackSelectMethod, selectTrack]);

    useEffect(() => {
        if (playPauseMethod) {
            playPauseMethod.current = togglePlay;
        }
    }, [playPauseMethod, togglePlay]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    };

    const handleScrub = (e) => {
        if (!audioRef.current || !progressRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = percent * duration;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="container flex justify-center items-center">

            <Card className="rounded-3xl shadow-2xl fixed bottom-2 z-50 w-full max-w-2xl">
                <CardContent >
                    <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        className="hidden"
                    />

                    <div className="flex items-center gap-4">
                        {/* Cover Image */}
                        <img
                            src={current.image}
                            className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                            onClick={() => showText()}
                        />

                        {/* Track Info */}
                        <div className="flex-1 min-w-0 text-left">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                                {current.title}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                {current.subtitle}
                            </p>

                            {/* Hidden Select for Track Change */}
                            <select
                                className="absolute opacity-0 pointer-events-none"
                                value={current.id}
                                onChange={handleChangeTrack}
                            >
                                {audioList.map((track) => (
                                    <option key={track.id} value={track.id}>
                                        {track.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Progress Bar */}
                    <div className="w-full">
                        <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 my-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatRemainingTime(currentTime, duration)}</span>
                        </div>
                        <div
                            ref={progressRef}
                            onClick={handleScrub}
                            className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer relative"
                        >
                            <div
                                className="h-1.5 bg-gray-700 dark:bg-gray-300 rounded-full absolute top-0 left-0 transition-all duration-150"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-8 pt-2">
                        <img
                            src={SkipBack}
                            alt="Skip Back 15s"
                            className="w-8 h-8 cursor-pointer dark:invert"
                            onClick={skipBackward}
                        />
                        {!playing ? (
                            <Play
                                className="w-10 h-10 text-gray-700 dark:text-gray-300 cursor-pointer"
                                onClick={togglePlay}
                            />
                        ) : (
                            <Pause
                                className="w-10 h-10 text-gray-700 dark:text-gray-300 cursor-pointer"
                                onClick={togglePlay}
                            />
                        )}
                        <img
                            src={SkipForward}
                            alt="Skip Forward 15s"
                            className="w-8 h-8 cursor-pointer dark:invert"
                            onClick={skipForward}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

    );
}
