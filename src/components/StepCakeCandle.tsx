import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mic, Wind, Sparkles, ArrowRight } from 'lucide-react';

interface StepCakeCandleProps {
  onNext: () => void;
}

export const StepCakeCandle: React.FC<StepCakeCandleProps> = ({ onNext }) => {
  const [isBlown, setIsBlown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const triggerBlowOut = () => {
    if (isBlown) return;
    setIsBlown(true);
    sounds.playCandleBlow();

    // Clean up microphone stream if active
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Confetti burst for the wish
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#fde047', '#fb923c', '#f43f5e', '#a855f7', '#60a5fa']
      });
    }, 400);
  };

  // Try to enable microphone for real blowing detection
  const enableMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlow = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // When someone blows into the mic, volume typically jumps above 65
        if (average > 65) {
          triggerBlowOut();
          return;
        }

        animationFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch {
      setMicError(true);
      setMicActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-between min-h-[580px] w-full max-w-[360px] mx-auto px-4 py-4 select-none transition-colors duration-1000 ${
      isBlown ? 'bg-gradient-to-b from-[#2a1b1b] to-[#1c1212] text-white rounded-3xl' : 'text-slate-800'
    }`}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-3"
      >
        {!isBlown ? (
          <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-950 font-serif tracking-tight">
            Blow the candle
          </h2>
        ) : (
          <div className="h-8" />
        )}
      </motion.div>

      {/* Birthday Cake and Candle Illustration */}
      <div className="relative my-auto flex flex-col items-center justify-center">
        {/* Glow halo when lit */}
        {!isBlown && (
          <div className="absolute -top-10 w-28 h-28 bg-amber-300/30 rounded-full blur-2xl pointer-events-none animate-pulse" />
        )}

        {/* The Candle */}
        <div className="relative flex flex-col items-center z-10">
          {/* Flame & Smoke */}
          <AnimatePresence>
            {!isBlown ? (
              <motion.div
                key="flame"
                exit={{ opacity: 0, scale: 0.2, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative mb-0.5"
              >
                {/* Candle flame SVG */}
                <div className="w-6 h-9 relative flex items-center justify-center animate-flicker">
                  <div className="absolute w-5 h-8 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-[50%_50%_40%_40%_/_70%_70%_30%_30%] shadow-[0_0_15px_#f59e0b]" />
                  <div className="absolute bottom-1 w-2 h-3 bg-blue-500/70 rounded-full blur-[0.8px]" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="smoke"
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: [0.8, 0], y: -30, scale: [0.8, 1.6], x: [0, 6, -4] }}
                transition={{ duration: 1.6 }}
                className="text-xs text-gray-300 font-serif mb-1"
              >
                💨
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candle Wick */}
          <div className="w-0.5 h-2.5 bg-gray-800" />

          {/* Candle Body */}
          <div className="w-3.5 h-14 bg-gradient-to-r from-rose-700 via-rose-500 to-rose-700 rounded-t-sm shadow-sm relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>

        {/* The Cake */}
        <div className="relative -mt-1 flex flex-col items-center z-0">
          {/* Cake Top Frosting */}
          <div className="w-56 h-16 bg-[#fff7ed] rounded-t-3xl shadow-md border-b-4 border-[#fed7aa] relative overflow-hidden flex items-end justify-center">
            {/* Scalloped frosting edge */}
            <div className="w-full flex justify-around absolute bottom-0 transform translate-y-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-8 h-4 bg-[#fff7ed] rounded-b-full shadow-sm" />
              ))}
            </div>
            {/* Cute sprinkles */}
            <div className="absolute top-2 left-6 w-2 h-1 bg-pink-400 rounded-full rotate-45" />
            <div className="absolute top-4 left-16 w-2 h-1 bg-yellow-400 rounded-full -rotate-12" />
            <div className="absolute top-3 right-8 w-2 h-1 bg-blue-400 rounded-full rotate-30" />
            <div className="absolute top-5 right-20 w-2 h-1 bg-emerald-400 rounded-full rotate-90" />
          </div>

          {/* Cake Base (Chocolate layer) */}
          <div className="w-56 h-12 bg-gradient-to-b from-[#451a03] to-[#290e03] rounded-b-xl shadow-lg relative" />

          {/* Cake Plate */}
          <div className="w-64 h-4 bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-full shadow-md mt-0.5 border border-gray-300/40" />
        </div>

        {/* Darkened scene text matching image_25a0d3a4.png */}
        <AnimatePresence>
          {isBlown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-center"
            >
              <h3 className="text-3xl sm:text-4xl font-serif italic text-rose-100 font-semibold tracking-wide drop-shadow-md">
                Close your eyes
              </h3>
              <h3 className="text-3xl sm:text-4xl font-serif italic text-rose-100 font-semibold tracking-wide mt-1 drop-shadow-md">
                & & make a wish
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Controls */}
      <div className="w-full flex flex-col items-center gap-3 mb-4">
        {!isBlown ? (
          <>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={triggerBlowOut}
              className="w-full max-w-[260px] py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 hover:opacity-95 text-sm"
            >
              <Wind className="w-4 h-4" />
              <span>Tap to Blow Out Candle</span>
            </motion.button>

            {!micActive ? (
              <button
                onClick={enableMic}
                className="text-xs text-rose-800 hover:text-rose-950 font-medium flex items-center gap-1.5 transition-colors underline underline-offset-4"
              >
                <Mic className="w-3.5 h-3.5 text-rose-600" />
                <span>Or use microphone to blow</span>
              </button>
            ) : (
              <div className="text-xs text-rose-700 font-medium flex items-center gap-1.5 bg-rose-100/70 py-1 px-3 rounded-full animate-pulse">
                <Mic className="w-3.5 h-3.5 text-rose-600" />
                <span>Listening... Blow now into mic! 🌬️</span>
              </div>
            )}
            {micError && (
              <span className="text-[11px] text-rose-600">Mic permission denied; please tap above!</span>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="w-full flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="py-3 px-7 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium shadow-lg shadow-rose-950/50 flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Wish Made! See Bouquet 🌹</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
