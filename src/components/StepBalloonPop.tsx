import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';

interface StepBalloonPopProps {
  onNext: () => void;
}

interface BalloonItem {
  id: number;
  word: string;
  color: string;
  gradient: string;
  border: string;
  ribbonColor: string;
}

const BALLOONS: BalloonItem[] = [
  {
    id: 1,
    word: 'You',
    color: '#93c5fd',
    gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #bfdbfe 30%, #60a5fa 70%, #3b82f6 100%)',
    border: '#60a5fa',
    ribbonColor: '#3b82f6',
  },
  {
    id: 2,
    word: 'are',
    color: '#fbcfe8',
    gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #fce7f3 30%, #f472b6 70%, #db2777 100%)',
    border: '#f472b6',
    ribbonColor: '#db2777',
  },
  {
    id: 3,
    word: 'so',
    color: '#a7f3d0',
    gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #d1fae5 30%, #34d399 70%, #059669 100%)',
    border: '#34d399',
    ribbonColor: '#059669',
  },
  {
    id: 4,
    word: 'special',
    color: '#ddd6fe',
    gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #ede9fe 30%, #a78bfa 70%, #7c3aed 100%)',
    border: '#a78bfa',
    ribbonColor: '#7c3aed',
  },
];

export const StepBalloonPop: React.FC<StepBalloonPopProps> = ({ onNext }) => {
  const [popped, setPopped] = useState<number[]>([]);

  const handlePop = (id: number, e: React.MouseEvent) => {
    if (popped.includes(id)) return;
    sounds.playBalloonPop();

    // Trigger local burst confetti
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 35,
      spread: 55,
      origin: { x, y },
      colors: ['#f43f5e', '#ec4899', '#60a5fa', '#34d399', '#a78bfa']
    });

    const nextPopped = [...popped, id];
    setPopped(nextPopped);

    if (nextPopped.length === 4) {
      setTimeout(() => {
        sounds.playUnlock();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#e11d48', '#f43f5e', '#fb7185', '#fcd34d', '#c084fc']
        });
      }, 500);
    }
  };

  const allPopped = popped.length === 4;

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-[360px] mx-auto px-4 py-4 select-none relative">
      {/* Title matching image_57ba5d4e.png */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-2"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-600 font-sans tracking-tight">
          Pop all 4 balloons
        </h2>
        <p className="text-xs text-rose-500/80 mt-1 font-medium">
          {allPopped ? '🎉 Hidden message revealed!' : `Tap each balloon to pop (${popped.length}/4)`}
        </p>
      </motion.div>

      {/* 2x2 Grid of Balloons */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 my-auto w-full max-w-[280px]">
        {BALLOONS.map((b, index) => {
          const isPopped = popped.includes(b.id);
          return (
            <div key={b.id} className="flex flex-col items-center justify-center min-h-[140px] relative">
              <AnimatePresence mode="wait">
                {!isPopped ? (
                  <motion.div
                    key="balloon"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      y: [0, -8, 0],
                      rotate: index % 2 === 0 ? [-1, 2, -1] : [2, -1, 2],
                    }}
                    exit={{ scale: 1.4, opacity: 0 }}
                    transition={{
                      y: { duration: 2.8 + index * 0.4, repeat: Infinity, ease: 'easeInOut' },
                      rotate: { duration: 3.2 + index * 0.3, repeat: Infinity, ease: 'easeInOut' },
                      duration: 0.15,
                    }}
                    onClick={(e) => handlePop(b.id, e)}
                    className="relative cursor-pointer group flex flex-col items-center"
                  >
                    {/* Balloon Body with 3D Watercolor Shading */}
                    <div
                      style={{
                        background: b.gradient,
                        boxShadow: '0 10px 20px -5px rgba(0,0,0,0.12), inset -4px -6px 12px rgba(0,0,0,0.1), inset 6px 6px 12px rgba(255,255,255,0.8)'
                      }}
                      className="w-24 h-28 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] relative transition-transform duration-200 group-hover:scale-105 active:scale-95"
                    >
                      {/* Gloss highlight */}
                      <div className="absolute top-3 left-4 w-5 h-7 rounded-full bg-white/70 -rotate-30 blur-[0.6px]" />
                      <div className="absolute top-2 left-6 w-2 h-3 rounded-full bg-white/90" />

                      {/* Balloon Tie Knot */}
                      <div
                        style={{ backgroundColor: b.ribbonColor }}
                        className="w-3.5 h-2.5 rounded-sm absolute -bottom-1 left-1/2 -translate-x-1/2"
                      />
                    </div>

                    {/* Ribbon */}
                    <svg className="w-12 h-14 -mt-1 pointer-events-none" viewBox="0 0 50 60" fill="none">
                      <path
                        d="M25 0 C22 15, 35 25, 23 40 C17 50, 27 55, 24 60"
                        stroke={b.ribbonColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.8"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="word"
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex flex-col items-center justify-center p-3"
                  >
                    <span className="text-3xl font-cursive font-bold text-rose-800 drop-shadow-sm italic">
                      {b.word}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-pink-400 mt-1 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Revealed Final Text matching image_f28963b5.png */}
      <div className="min-h-[90px] flex flex-col items-center justify-center w-full mb-4">
        {allPopped ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="text-3xl sm:text-4xl font-bold font-cursive text-rose-800 tracking-wide text-center">
              You are so special
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium shadow-md shadow-pink-500/25 flex items-center gap-2 hover:opacity-95 text-sm"
            >
              <span>Next: Blow the Candle 🎂</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <div className="text-xs text-rose-400 font-medium tracking-wide">
            Pop all balloons to reveal the message
          </div>
        )}
      </div>
    </div>
  );
};
