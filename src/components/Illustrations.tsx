import React from 'react';

export const CharacterIllustration: React.FC<{ size?: number; className?: string }> = ({
  size = 80,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <circle cx="50" cy="50" r="46" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
        {/* Cabelo */}
        <circle cx="50" cy="38" r="22" fill="#0f172a" />
        <ellipse cx="50" cy="32" rx="20" ry="14" fill="#1e293b" />
        {/* Rosto */}
        <circle cx="50" cy="44" r="16" fill="#fcd34d" />
        {/* Olhinhos e sorriso */}
        <circle cx="45" cy="42" r="2" fill="#0f172a" />
        <circle cx="55" cy="42" r="2" fill="#0f172a" />
        <path d="M47 48 Q 50 52 53 48" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Bochechas */}
        <circle cx="43" cy="46" r="2" fill="#f87171" opacity="0.6" />
        <circle cx="57" cy="46" r="2" fill="#f87171" opacity="0.6" />
        {/* Roupa / Tronco */}
        <path d="M30 84 C 30 65, 42 62, 50 62 C 58 62, 70 65, 70 84 Z" fill="#0284c7" />
        <path d="M46 62 L 50 72 L 54 62" stroke="#ffffff" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};

export const DoctorIllustration: React.FC<{ size?: number; className?: string }> = ({
  size = 80,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" />
        {/* Cabelo Médico */}
        <circle cx="50" cy="36" r="19" fill="#334155" />
        {/* Rosto */}
        <circle cx="50" cy="42" r="15" fill="#fde68a" />
        {/* Olhinhos e sorriso profissional */}
        <circle cx="45" cy="40" r="1.8" fill="#0f172a" />
        <circle cx="55" cy="40" r="1.8" fill="#0f172a" />
        <path d="M47 46 Q 50 49 53 46" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Jaleco Médico Branco */}
        <path d="M28 84 C 28 64, 40 60, 50 60 C 60 60, 72 64, 72 84 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M46 60 L 50 74 L 54 60" fill="#0284c7" />
        {/* Estetoscópio */}
        <path d="M43 62 Q 40 76 50 77 Q 60 76 57 62" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="79" r="3.5" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
        {/* Cruz médica verde/azul */}
        <rect x="68" y="22" width="10" height="3" rx="1" fill="#38bdf8" />
        <rect x="71.5" y="18.5" width="3" height="10" rx="1" fill="#38bdf8" />
      </svg>
    </div>
  );
};

