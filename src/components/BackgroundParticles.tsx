import React, { useMemo } from 'react';

interface BackgroundParticlesProps {
  type?: 'hearts' | 'party' | 'dark';
}

const PARTY_EMOJIS = [
  '🎂', '🎈', '🎉', '💖', '✨', '🎁', '🌸', '🥳',
  '🍬', '💕', '👑', '💐', '🧁', '⭐', '🎊', '🍰',
  '🎀', '💌', '🌟', '🥮', '🌺', '🎈', '🎉', '💖'
];

const DARK_EMOJIS = ['✨', '⭐', '💫', '🌟', '🕯️', '✨', '🌙', '⭐'];

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ type = 'party' }) => {
  const items = useMemo(() => {
    const list = type === 'dark' ? DARK_EMOJIS : PARTY_EMOJIS;
    return Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.8 + (i % 2 === 0 ? 1 : 2.5) + Math.sin(i) * 2).toFixed(1)}%`,
      delay: `${((i * 0.45) % 7).toFixed(1)}s`,
      duration: `${(8 + (i % 5) * 1.8).toFixed(1)}s`,
      size: `${(15 + (i % 4) * 6).toFixed(0)}px`,
      opacity: (0.35 + (i % 3) * 0.18).toFixed(2),
      char: list[i % list.length],
      blur: i % 4 === 0 ? 'blur-[0.5px]' : '',
    }));
  }, [type]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {items.map((item) => (
        <span
          key={item.id}
          className={`absolute select-none transition-transform ${item.blur}`}
          style={{
            left: item.left,
            bottom: '-40px',
            fontSize: item.size,
            opacity: item.opacity,
            animationName: 'floatParty',
            animationDuration: item.duration,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: item.delay,
          }}
        >
          {item.char}
        </span>
      ))}
      <style>{`
        @keyframes floatParty {
          0% {
            transform: translateY(0) translateX(0px) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          12% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50vh) translateX(16px) rotate(12deg) scale(1.05);
            opacity: 0.85;
          }
          88% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-115vh) translateX(-14px) rotate(-15deg) scale(1.15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
