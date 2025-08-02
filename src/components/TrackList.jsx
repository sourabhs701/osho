import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { audioList } from "@/data/audioData";

export default function TrackList({ currentTrack, isPlaying, onTrackSelect, }) {
    return (
        <div className="w-full  mx-auto space-y-3 pb-30 ">
            {audioList.map((track) => (
                <Card
                    key={track.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${currentTrack?.id === track.id
                        ? 'border-gray-700 dark:border-gray-300 shadow-md'
                        : 'border-gray-200 dark:border-gray-700'
                        }`}
                    onClick={() => onTrackSelect(track)}
                >
                    <CardContent className="flex items-center gap-4">

                        {/* Track Info */}
                        <img
                            src={track.image}
                            className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {track.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {track.subtitle}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {track.artist} • {track.album}
                            </p>
                        </div>

                        {/* Currently Playing Indicator */}
                        {currentTrack?.id === track.id && (
                            <div className="flex-shrink-0">
                                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`}>
                                    {isPlaying && (
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}