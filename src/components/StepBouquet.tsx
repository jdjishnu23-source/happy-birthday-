import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowRight, Heart } from 'lucide-react';

interface StepBouquetProps {
  onNext: () => void;
}

interface MessageBubble {
  id: number;
  text: string;
  position: string;
  delay: number;
}

const MESSAGES: MessageBubble[] = [
  { id: 1, text: 'Forever yours ♡', position: 'top-2 left-2', delay: 0.1 },
  { id: 2, text: 'You make my world beautiful', position: 'top-2 right-2', delay: 0.25 },
  { id: 3, text: 'You are my sunshine 🌞', position: 'top-[38%] -left-1', delay: 0.4 },
  { id: 4, text: 'Happy Birthday, AKKA 💖', position: 'top-[38%] -right-1', delay: 0.55 },
  { id: 5, text: "I'm lucky to have you", position: 'bottom-4 left-3', delay: 0.7 },
  { id: 6, text: 'My favorite person 💖', position: 'bottom-4 right-3', delay: 0.85 },
];

export const StepBouquet: React.FC<StepBouquetProps> = ({ onNext }) => {
  const [activeBubble, setActiveBubble] = useState<number | null>(null);

  const handleBubbleClick = (id: number, e: React.MouseEvent) => {
    setActiveBubble(id);
    sounds.playKeypad(id + 2);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { x, y },
      colors: ['#e11d48', '#f43f5e', '#fbcfe8', '#fda4af']
    });
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-[380px] mx-auto px-2 py-3 select-none relative overflow-hidden">
      {/* Title matching image_e2d1282c.png */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-1 z-20"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-rose-700 font-cursive tracking-wide flex items-center justify-center gap-1.5 drop-shadow-sm">
          <span>Your Rose Bouquet</span>
          <span className="text-2xl">🌹</span>
        </h2>
        <p className="text-xs text-rose-500/90 mt-0.5 font-medium">
          Tap the bubbles to feel the love 💕
        </p>
      </motion.div>

      {/* Bouquet Centerpiece & Floating Message Bubbles */}
      <div className="relative w-full h-[430px] my-auto flex items-center justify-center">
        {/* Soft glowing ambient ring behind the big bouquet */}
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-rose-300/30 to-pink-200/40 blur-2xl pointer-events-none" />

        {/* Big Majestic Rose Bouquet Image */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
          transition={{
            scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.6 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] relative z-10 flex items-center justify-center cursor-pointer group"
          onClick={(e) => {
            sounds.playUnlock();
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.5 },
              colors: ['#e11d48', '#f43f5e', '#fb7185']
            });
          }}
        >
          <img
            src="/src/assets/images/rose_bouquet_big_1793011185498.jpg"
            alt="Big Beautiful Rose Bouquet for AKKA"
            className="w-full h-full object-cover rounded-3xl filter drop-shadow-2xl shadow-rose-950/20 transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Floating Message Bubbles around the big bouquet */}
        {MESSAGES.map((msg) => {
          const isActive = activeBubble === msg.id;
          return (
            <motion.div
              key={msg.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -4, 0]
              }}
              transition={{
                scale: { delay: msg.delay, duration: 0.5, type: 'spring' },
                opacity: { delay: msg.delay, duration: 0.4 },
                y: { duration: 3 + msg.id * 0.4, repeat: Infinity, ease: 'easeInOut' }
              }}
              className={`absolute ${msg.position} z-20`}
            >
              <button
                onClick={(e) => handleBubbleClick(msg.id, e)}
                className={`py-2 px-3 rounded-2xl bg-white/95 backdrop-blur-md text-[11px] sm:text-xs font-semibold shadow-lg shadow-pink-300/40 border transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1 ${
                  isActive
                    ? 'border-rose-400 text-rose-700 ring-2 ring-rose-300 scale-105 bg-rose-50'
                    : 'border-pink-200 text-slate-800 hover:border-rose-300 hover:bg-pink-50/50'
                }`}
              >
                <span>{msg.text}</span>
                {isActive && <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-ping" />}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Button to proceed to Heart Letter */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full flex justify-center z-20 mb-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-full max-w-[260px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 text-sm hover:opacity-95"
        >
          <span>Open My Letter 💌</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};
