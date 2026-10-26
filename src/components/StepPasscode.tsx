import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Lock, Heart } from 'lucide-react';

interface StepPasscodeProps {
  onUnlock: () => void;
}

export const StepPasscode: React.FC<StepPasscodeProps> = ({ onUnlock }) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleKeyPress = (num: string) => {
    if (digits.length >= 4) return;
    const newDigits = [...digits, num];
    setDigits(newDigits);
    sounds.playKeypad(parseInt(num, 10));

    if (newDigits.length === 4) {
      // Trigger success unlock
      setIsSuccess(true);
      sounds.playUnlock();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#f59e0b']
      });
      setTimeout(() => {
        onUnlock();
      }, 700);
    }
  };

  const handleDelete = () => {
    if (digits.length === 0) return;
    sounds.playKeypad(0);
    setDigits(digits.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[590px] w-full max-w-[380px] mx-auto px-2 py-2 select-none">
      {/* Top illustration: Big 3D Pink heart lock with key and confetti */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center text-center w-full"
      >
        {/* Large 3D Heart Lock with Golden Key */}
        <div className="relative w-full max-w-[280px] h-[135px] flex items-center justify-center my-0.5">
          <motion.img
            src="/assets/aistudio/lock_with_key_clean.png"
            alt="Pink Heart Lock with Key and Confetti"
            animate={isSuccess ? { scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] } : { y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: isSuccess ? 0 : Infinity, ease: 'easeInOut' }}
            className="w-full h-full object-contain filter drop-shadow-lg select-none pointer-events-none"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-rose-900 font-sans uppercase mt-1">
          ENTER PASSCODE
        </h2>

        {/* 4 Digit Squares - Big and prominent */}
        <div className="flex items-center justify-center gap-3.5 my-3.5">
          {[0, 1, 2, 3].map((index) => {
            const filled = index < digits.length;
            return (
              <motion.div
                key={index}
                animate={filled ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md ${
                  filled 
                    ? 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-rose-400/50' 
                    : 'bg-[#e74c76] shadow-sm'
                }`}
              >
                {filled && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-bold"
                  >
                    💖
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-xs sm:text-sm text-rose-800/85 font-medium">
          Something special is waiting for you
        </p>

        {/* Dashed line */}
        <div className="text-rose-300 tracking-widest text-xs my-1 font-mono">
          - - - - - - -
        </div>
      </motion.div>

      {/* Numeric Keypad - Large, comfortable circular buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-[290px] grid grid-cols-3 gap-y-3 gap-x-4 mb-2"
      >
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="w-16 h-16 sm:w-[68px] sm:h-[68px] mx-auto rounded-full bg-white/95 shadow-md shadow-pink-200/60 border border-pink-100 flex items-center justify-center text-2xl italic font-serif text-rose-900 active:scale-90 active:bg-pink-100 transition-all hover:bg-pink-50 hover:shadow-lg cursor-pointer"
          >
            {key}
          </button>
        ))}

        {/* Row 4: Empty space, 0, x button */}
        <div />
        <button
          onClick={() => handleKeyPress('0')}
          className="w-16 h-16 sm:w-[68px] sm:h-[68px] mx-auto rounded-full bg-white/95 shadow-md shadow-pink-200/60 border border-pink-100 flex items-center justify-center text-2xl italic font-serif text-rose-900 active:scale-90 active:bg-pink-100 transition-all hover:bg-pink-50 hover:shadow-lg cursor-pointer"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 sm:w-[68px] sm:h-[68px] mx-auto rounded-full bg-white/95 shadow-md shadow-pink-200/60 border border-pink-100 flex items-center justify-center text-lg font-sans text-rose-800 active:scale-90 active:bg-pink-100 transition-all hover:bg-pink-50 hover:shadow-lg cursor-pointer"
          title="Delete"
        >
          ✕
        </button>
      </motion.div>

      <div className="text-[11px] text-rose-500/80 mb-1">
        Tip: Press any 4 numbers (e.g. 1 2 3 4) to unlock
      </div>
    </div>
  );
};
