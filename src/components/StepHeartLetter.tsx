import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import { downloadBirthdayCard } from '../utils/downloadCard';
import confetti from 'canvas-confetti';
import { Mail, Heart, Sparkles, ArrowRight, FastForward, Download, Loader2, Check } from 'lucide-react';

interface StepHeartLetterProps {
  onNext: () => void;
}

const FULL_LETTER_TEXT = `Dear AKKA,

Happy Birthday to someone truly special! 🎂

You are Sweet Soul, Super Loyal, My Rock, and I'm so grateful to have you in my life.

You bring so much warmth and sweetness into my life. Every moment with you is precious.

On your special day, I wish you all the happiness, love, and joy that you deserve. May this year bring you countless beautiful moments and wonderful memories.

Here's to celebrating you today and always! 🎉

With love and best wishes,
Your Special Someone ❤️`;

export const StepHeartLetter: React.FC<StepHeartLetterProps> = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const letterContainerRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    sounds.playUnlock();
    setDownloading(true);
    const success = await downloadBirthdayCard();
    setDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const handleOpenEnvelope = () => {
    sounds.playUnlock();
    setIsOpen(true);
  };

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) return;

    let index = 0;
    const interval = setInterval(() => {
      index += 2;
      if (index >= FULL_LETTER_TEXT.length) {
        setDisplayedText(FULL_LETTER_TEXT);
        setIsTypingComplete(true);
        clearInterval(interval);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fbcfe8']
        });
      } else {
        setDisplayedText(FULL_LETTER_TEXT.slice(0, index));
        if (index % 6 === 0) {
          sounds.playTypewriter();
        }
        // Auto scroll to bottom as it types
        if (letterContainerRef.current) {
          letterContainerRef.current.scrollTop = letterContainerRef.current.scrollHeight;
        }
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleFastForward = () => {
    setDisplayedText(FULL_LETTER_TEXT);
    setIsTypingComplete(true);
    sounds.playUnlock();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-[360px] mx-auto px-4 py-4 select-none relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Closed Envelope Screen matching image_42f8c078.png */
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full flex flex-col items-center justify-between h-full my-auto py-8"
          >
            <div className="text-center mt-4">
              <h2 className="text-3xl font-serif italic text-rose-900 font-bold drop-shadow-sm">
                A Message From My Heart
              </h2>
            </div>

            {/* Envelope Graphic */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpenEnvelope}
              className="my-auto cursor-pointer relative flex flex-col items-center group"
            >
              {/* Envelope Body */}
              <div className="w-64 h-44 bg-[#fffaf5] rounded-2xl shadow-xl shadow-pink-200/50 border-2 border-amber-300/70 relative overflow-hidden flex items-center justify-center">
                {/* Diagonal folds */}
                <div className="absolute inset-0 border-t-[88px] border-t-pink-200/90 border-r-[128px] border-r-transparent border-l-[128px] border-l-transparent pointer-events-none drop-shadow-sm" />
                <div className="absolute bottom-0 inset-x-0 border-b-[88px] border-b-[#fcf4ec] border-r-[128px] border-r-transparent border-l-[128px] border-l-transparent pointer-events-none" />
                
                {/* Gold rim lines */}
                <div className="absolute inset-0 border border-amber-200/50 rounded-2xl pointer-events-none" />

                {/* Heart Wax Seal */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-md shadow-rose-600/30 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              {/* Pulsing ring */}
              <div className="mt-8 text-center">
                <span className="text-lg font-serif italic text-rose-800 font-semibold tracking-wide flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500 animate-spin" />
                  <span>Tap to open</span>
                  <Sparkles className="w-4 h-4 text-pink-500 animate-spin" />
                </span>
              </div>
            </motion.div>

            <div className="h-6" />
          </motion.div>
        ) : (
          /* Unfolded Letter Screen matching image_9beea532.png */
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center justify-between h-full"
          >
            {/* Header */}
            <div className="text-center my-1">
              <h2 className="text-2xl font-serif italic text-rose-900 font-bold flex items-center justify-center gap-1.5">
                <span>A Message From My Heart</span>
                <span className="text-rose-600">💖</span>
              </h2>
            </div>

            {/* Letter Paper matching image_9beea532.png */}
            <div
              ref={letterContainerRef}
              className="w-full max-w-[335px] max-h-[430px] overflow-y-auto bg-[#fffdfa] rounded-3xl p-5 shadow-xl shadow-pink-200/50 border-2 border-rose-200 relative my-2 text-slate-800 scroll-smooth"
            >
              {/* Pink Heart Badge on top right */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-500 shadow-md shadow-rose-300 flex items-center justify-center z-10">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>

              {/* Typed letter text */}
              <div className="font-handwriting text-base sm:text-lg leading-relaxed text-slate-800 pr-4 whitespace-pre-line tracking-wide">
                {displayedText}
                {!isTypingComplete && (
                  <span className="inline-block w-1.5 h-4 bg-rose-500 ml-1 animate-pulse" />
                )}
              </div>

              {/* Cute Bunnies illustration on bottom right */}
              <div className="flex justify-end mt-4">
                <span className="text-2xl" title="Love & Hugs">
                  🐰💕🐰
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full flex items-center justify-center gap-3 mt-1 mb-1">
              {!isTypingComplete && (
                <button
                  onClick={handleFastForward}
                  className="py-2 px-3 rounded-xl bg-pink-100 hover:bg-pink-200 text-rose-700 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Show full letter</span>
                </button>
              )}

              {isTypingComplete && (
                <div className="flex items-center gap-2">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    disabled={downloading}
                    className="py-2.5 px-3.5 rounded-2xl bg-white border border-rose-200 text-rose-700 font-medium shadow-sm flex items-center gap-1.5 text-xs hover:bg-rose-50 cursor-pointer"
                  >
                    {downloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                    ) : downloadSuccess ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>{downloadSuccess ? 'Card Saved!' : 'Download Card 📥'}</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium shadow-md shadow-pink-500/25 flex items-center gap-1.5 text-xs hover:opacity-95 cursor-pointer"
                  >
                    <span>One Last Thing... 🎁</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
