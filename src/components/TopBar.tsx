import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { downloadBirthdayCard } from '../utils/downloadCard';
import { Volume2, VolumeX, Music, Download, Heart, Check, Loader2 } from 'lucide-react';

interface TopBarProps {
  currentStep: number;
  totalSteps: number;
  isMuted: boolean;
  isMusicPlaying: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onJumpStep?: (step: number) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentStep,
  totalSteps,
  isMuted,
  isMusicPlaying,
  onToggleMute,
  onToggleMusic,
  onJumpStep,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    sounds.playUnlock();
    setDownloading(true);
    const success = await downloadBirthdayCard();
    setDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-3 py-2.5 bg-white/85 backdrop-blur-md border-b border-pink-200/60 z-30">
      {/* Brand title */}
      <div className="flex items-center gap-1.5 text-rose-900 font-bold tracking-tight">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        <span className="font-serif italic text-sm sm:text-base">AKKA's Birthday</span>
      </div>

      {/* Progress Dots */}
      <div className="hidden xs:flex items-center gap-1">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onJumpStep && onJumpStep(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentStep
                ? 'w-4 h-1.5 bg-rose-500 shadow-sm'
                : idx < currentStep
                ? 'w-1.5 h-1.5 bg-rose-300'
                : 'w-1.5 h-1.5 bg-pink-100'
            }`}
            title={`Step ${idx + 1}`}
          />
        ))}
      </div>

      {/* Controls: Music, Sound, and Download */}
      <div className="flex items-center gap-1.5">
        {/* Background Music button */}
        <button
          onClick={onToggleMusic}
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
            isMusicPlaying
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-400/40 animate-pulse'
              : 'bg-pink-100 hover:bg-pink-200 text-rose-700'
          }`}
          title={isMusicPlaying ? 'Pause Birthday Music' : 'Play Birthday Music'}
        >
          <Music className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">{isMusicPlaying ? 'Music ON' : 'Music'}</span>
        </button>

        {/* Download Keepsake Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-2 py-1 rounded-full bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 text-xs font-medium flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
          title="Download Birthday Card PNG"
        >
          {downloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
          ) : downloadSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Download className="w-3.5 h-3.5 text-rose-600" />
          )}
          <span className="text-[11px] font-semibold">
            {downloadSuccess ? 'Saved!' : 'Download'}
          </span>
        </button>

        {/* Sound FX Mute toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-rose-700 transition-colors cursor-pointer"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
