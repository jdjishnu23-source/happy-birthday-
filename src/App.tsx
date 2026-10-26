/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { sounds } from './utils/audio';
import { BackgroundParticles } from './components/BackgroundParticles';
import { TopBar } from './components/TopBar';
import { StepPasscode } from './components/StepPasscode';
import { StepTeddyBears } from './components/StepTeddyBears';
import { StepBalloonPop } from './components/StepBalloonPop';
import { StepCakeCandle } from './components/StepCakeCandle';
import { StepBouquet } from './components/StepBouquet';
import { StepHeartLetter } from './components/StepHeartLetter';
import { StepGiftFinale } from './components/StepGiftFinale';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const totalSteps = 7;

  // Auto-start music on first interaction
  React.useEffect(() => {
    const handleFirstTap = () => {
      sounds.initCtx();
      sounds.startBgMusic();
      setIsMusicPlaying(true);
      window.removeEventListener('click', handleFirstTap);
      window.removeEventListener('touchstart', handleFirstTap);
    };
    window.addEventListener('click', handleFirstTap, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstTap, { passive: true, once: true });
    return () => {
      window.removeEventListener('click', handleFirstTap);
      window.removeEventListener('touchstart', handleFirstTap);
    };
  }, []);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleRestart = () => {
    sounds.playUnlock();
    setCurrentStep(0);
  };

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    setIsMusicPlaying(!muted && sounds.isBgMusicPlaying);
  };

  const handleToggleMusic = () => {
    const playing = sounds.toggleMusic();
    setIsMusicPlaying(playing);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Background Floating Ambient Particles */}
      <BackgroundParticles type={currentStep === 3 ? 'dark' : 'hearts'} />

      {/* Main Frame Container */}
      <div className="w-full max-w-[440px] min-h-[100dvh] sm:min-h-[680px] sm:max-h-[850px] bg-gradient-to-b from-pink-50/90 via-white/80 to-pink-50/90 backdrop-blur-xl sm:rounded-[38px] shadow-2xl shadow-pink-300/60 border border-pink-200/60 flex flex-col relative overflow-hidden z-10">
        {/* Top bar with audio, music & download */}
        <TopBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          isMuted={isMuted}
          isMusicPlaying={isMusicPlaying}
          onToggleMute={handleToggleMute}
          onToggleMusic={handleToggleMusic}
          onJumpStep={(step) => setCurrentStep(step)}
        />

        {/* Step Transition Area */}
        <main className="flex-1 flex flex-col items-center justify-center relative overflow-y-auto overflow-x-hidden p-2">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center"
              >
                <StepPasscode onUnlock={handleNextStep} />
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center"
              >
                <StepTeddyBears onYes={handleNextStep} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center"
              >
                <StepBalloonPop onNext={handleNextStep} />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex items-center justify-center"
              >
                <StepCakeCandle onNext={handleNextStep} />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center"
              >
                <StepBouquet onNext={handleNextStep} />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center"
              >
                <StepHeartLetter onNext={handleNextStep} />
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex items-center justify-center"
              >
                <StepGiftFinale onRestart={handleRestart} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
