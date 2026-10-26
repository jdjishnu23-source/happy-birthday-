import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StepTeddyBearsProps {
  onYes: () => void;
}

export const StepTeddyBears: React.FC<StepTeddyBearsProps> = ({ onYes }) => {
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const [noLabel, setNoLabel] = useState('No');

  const playfulMessages = [
    'No',
    'Wait, no? 😂',
    'Really?! 😜',
    'Try again! 🏃',
    'Only YES allowed! 💖',
    'Akka please! 🥺',
    'Nice try! ✨',
  ];

  const handleEvadeNo = () => {
    // Generate playful offsets
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = -40 - Math.random() * 120;
    setNoButtonPos({ x: randomX, y: randomY });
    const nextCount = noCount + 1;
    setNoCount(nextCount);
    setNoLabel(playfulMessages[nextCount % playfulMessages.length]);
    sounds.playKeypad(nextCount + 4);
  };

  const handleYesClick = () => {
    sounds.playUnlock();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fbbf24', '#a855f7']
    });
    onYes();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-[360px] mx-auto px-4 py-4 select-none relative">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-2"
      >
        <h1 className="text-3xl sm:text-4xl font-bold font-cursive text-rose-900 tracking-wide drop-shadow-sm">
          Happy Birthday,
        </h1>
        <h2 className="text-4xl sm:text-5xl font-black font-cursive text-rose-900 tracking-wider mt-1 drop-shadow-sm">
          AKKA
        </h2>
      </motion.div>

      {/* Cute Milk & Mocha Bears with Birthday Cake illustration */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="my-auto relative flex flex-col items-center"
      >
        <div className="relative w-72 h-72 flex items-center justify-center">
          <img
            src="/assets/aistudio/image_c2c3141b.png"
            alt="Cute Bears Celebrating Birthday Cake"
            className="w-full h-full object-contain filter drop-shadow-md rounded-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      {/* Prompt and Interactive Buttons matching images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full text-center mb-6 relative"
      >
        <p className="text-lg font-serif italic text-rose-950 mb-5 font-semibold">
          Are you excited for what's next?
        </p>

        {/* Buttons container */}
        <div className="flex items-center justify-center gap-6 relative min-h-[54px]">
          {/* YES button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYesClick}
            className="px-8 py-3 rounded-2xl bg-rose-700 text-white font-serif font-bold text-lg shadow-lg shadow-rose-600/30 hover:bg-rose-800 transition-all z-10"
          >
            Yes
          </motion.button>

          {/* NO button that playfully runs away! */}
          <motion.button
            animate={{
              x: noButtonPos.x,
              y: noButtonPos.y,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            onMouseEnter={handleEvadeNo}
            onTouchStart={handleEvadeNo}
            onClick={handleEvadeNo}
            className="px-7 py-3 rounded-2xl bg-white text-rose-700 font-serif font-semibold text-lg border-2 border-rose-300 shadow-md shadow-pink-200/50 hover:border-rose-400 transition-colors z-20 cursor-pointer whitespace-nowrap"
          >
            {noLabel}
          </motion.button>
        </div>

        <p className="text-[11px] text-rose-500/80 mt-4">
          (Only one correct choice here, Akka! 😉)
        </p>
      </motion.div>
    </div>
  );
};
