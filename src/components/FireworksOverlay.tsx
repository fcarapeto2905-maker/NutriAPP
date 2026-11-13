import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
}

const generateInitialParticles = (): Particle[] => {
  const colors = ['#38bdf8', '#0284c7', '#60a5fa', '#93c5fd', '#3b82f6', '#f59e0b', '#ec4899', '#10b981'];
  const createdParticles: Particle[] = [];
  const bursts = [
    { cx: 25, cy: 30 },
    { cx: 75, cy: 25 },
    { cx: 50, cy: 40 },
    { cx: 35, cy: 60 },
    { cx: 65, cy: 55 },
  ];

  let pId = 0;
  bursts.forEach((burst, bIdx) => {
    const pCount = 28;
    for (let i = 0; i < pCount; i++) {
      const angle = (Math.PI * 2 * i) / pCount + (Math.random() - 0.5) * 0.4;
      const speed = 1.5 + Math.random() * 3.5;
      createdParticles.push({
        id: pId++,
        x: burst.cx + (Math.random() - 0.5) * 2,
        y: burst.cy + (Math.random() - 0.5) * 2,
        color: colors[(i + bIdx * 2) % colors.length],
        size: Math.random() * 5 + 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
      });
    }
  });

  return createdParticles;
};

export const FireworksOverlay: React.FC<{ durationMs?: number }> = ({ durationMs = 4500 }) => {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<Particle[]>(() => generateInitialParticles());

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.35,
            y: p.y + p.vy * 0.35 + 0.08,
            alpha: p.alpha - 0.018,
          }))
          .filter((p) => p.alpha > 0)
      );
    }, 30);

    const timer = setTimeout(() => {
      setVisible(false);
      clearInterval(interval);
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [durationMs]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: Math.max(0, p.alpha),
            boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
          }}
          className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform pointer-events-none"
        />
      ))}
      <div className="absolute top-8 inset-x-0 flex justify-center animate-bounce">
        <span className="bg-sky-500/90 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-sky-300">
          ✨ Bem-vindo(a) ao CARAPETO Nutri&Health System! ✨
        </span>
      </div>
    </div>
  );
};
