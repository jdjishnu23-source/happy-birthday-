import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import { downloadBirthdayCard } from '../utils/downloadCard';
import confetti from 'canvas-confetti';
import { Gift, RotateCcw, Volume2, Sparkles, Heart, Share2, Check, Download, Loader2 } from 'lucide-react';

interface StepGiftFinaleProps {
  onRestart: () => void;
}

export const StepGiftFinale: React.FC<StepGiftFinaleProps> = ({ onRestart }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingTune, setIsPlayingTune] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    sounds.playUnlock();
    setDownloading(true);
    const success = await downloadBirthdayCard();
    setDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handleOpenGift = () => {
    if (isOpened) return;
    setIsOpened(true);
    sounds.playGiftOpen();

    // Big grand fireworks confetti
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ec4899', '#f43f5e', '#fb7185'] });
    fire(0.2, { spread: 60, colors: ['#fbcfe8', '#f472b6', '#f59e0b'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#e11d48', '#fbbf24', '#c084fc'] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#38bdf8', '#34d399'] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ['#f43f5e', '#a855f7'] });

    // Automatically start playing the music box tune!
    setTimeout(() => {
      sounds.playBirthdayTune();
      setIsPlayingTune(true);
    }, 600);
  };

  const handlePlayMelody = () => {
    sounds.playBirthdayTune();
    setIsPlayingTune(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleShare = () => {
    const text = "Happy Birthday, AKKA! 🎂 Lots of love for you! You are so special! 💕";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-[360px] mx-auto px-4 py-4 select-none relative">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* Gift Box Screen matching image_1bf410e3.png */
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full flex flex-col items-center justify-between h-full my-auto py-8"
          >
            <div className="text-center mt-4">
              <h2 className="text-3xl sm:text-4xl font-cursive font-bold text-pink-600 drop-shadow-sm">
                One Last Thing...
              </h2>
              <p className="text-lg font-serif italic text-rose-800 font-semibold mt-3">
                Tap the gift
              </p>
            </div>

            {/* Gift Box Graphic */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              animate={{
                y: [0, -10, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              onClick={handleOpenGift}
              className="my-auto cursor-pointer relative flex flex-col items-center group"
            >
              {/* Pink Striped Gift Box SVG */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-pink-300/40 rounded-full blur-xl group-hover:bg-pink-400/50 transition-colors" />

                {/* Gift Box Container */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Ribbon Bow */}
                  <div className="relative -mb-3 z-20">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-10 h-7 rounded-[50%_50%_0_50%] border-4 border-pink-400 bg-pink-300 shadow-sm transform -rotate-12" />
                      <div className="w-4 h-4 rounded-full bg-pink-500 shadow-md z-30" />
                      <div className="w-10 h-7 rounded-[50%_50%_50%_0] border-4 border-pink-400 bg-pink-300 shadow-sm transform rotate-12" />
                    </div>
                  </div>

                  {/* Gift Box Lid */}
                  <div className="w-36 h-9 rounded-lg bg-pink-200 border-2 border-pink-300 shadow-md relative overflow-hidden flex items-center justify-center">
                    <div className="w-6 h-full bg-pink-400/80 shadow-inner" />
                  </div>

                  {/* Gift Box Base with Stripes */}
                  <div className="w-32 h-28 rounded-b-xl bg-pink-100 border-2 border-pink-200 shadow-xl relative overflow-hidden flex justify-between">
                    {/* Vertical candy stripes */}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-full ${i % 2 === 0 ? 'bg-pink-300/80' : 'bg-transparent'}`}
                      />
                    ))}
                    {/* Center ribbon */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-pink-400/90 shadow-inner" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-rose-600 font-medium text-xs bg-white/80 py-1.5 px-4 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Surprise ready inside!</span>
              </div>
            </motion.div>

            <div className="h-6" />
          </motion.div>
        ) : (
          /* Opened Finale Card Screen matching image_4882cb71.png */
          <motion.div
            key="opened"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center justify-between h-full"
          >
            {/* The Cony & Brown Birthday Card */}
            <div className="w-full max-w-[325px] bg-white rounded-3xl p-5 shadow-2xl shadow-pink-300/50 border border-pink-200 relative my-auto flex flex-col items-center">
              {/* Heart Badge Top Right */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 shadow-md shadow-rose-300 flex items-center justify-center z-10">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>

              {/* Brown and Cony Celebration Image */}
              <div className="w-full h-56 flex items-center justify-center relative rounded-2xl overflow-hidden mb-3">
                <img
                  src="/assets/aistudio/image_4882cb71.png"
                  alt="Brown & Cony Celebrating Birthday"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Heartfelt Text matching image_4882cb71.png */}
              <div className="text-center mt-1">
                <h3 className="text-2xl sm:text-3xl font-cursive font-bold text-rose-600 flex items-center justify-center gap-1.5 drop-shadow-sm">
                  <span>Lots of love for you</span>
                  <span className="text-xl">💕</span>
                </h3>
                <h4 className="text-lg sm:text-xl font-serif italic text-rose-900 font-semibold mt-1">
                  Once again, Happy Birthday AKKA!
                </h4>
                <p className="text-xs text-rose-500/90 mt-2 font-medium">
                  அன்பான அக்காவுக்கு இனிய பிறந்தநாள் நல்வாழ்த்துகள்! 🎂✨
                </p>
              </div>
            </div>

            {/* Interaction Action Row */}
            <div className="w-full flex flex-col gap-2.5 mt-2 mb-1">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handlePlayMelody}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-pink-100 hover:bg-pink-200 text-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isPlayingTune ? 'Replay Song 🎵' : 'Play Birthday Song 🎵'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-400/30 cursor-pointer"
                >
                  {downloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : downloadSuccess ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{downloadSuccess ? 'Card Downloaded! 🎉' : 'Download Card 📥'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-white border border-pink-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-pink-50 transition-colors shadow-sm cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Greeting 💌'}</span>
                </button>

                <button
                  onClick={onRestart}
                  className="py-2.5 px-4 rounded-2xl bg-pink-50 border border-pink-200 text-rose-700 font-medium text-xs shadow-xs flex items-center justify-center gap-1.5 hover:bg-pink-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart 🔄</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
