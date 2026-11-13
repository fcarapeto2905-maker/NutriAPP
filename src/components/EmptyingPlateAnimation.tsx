import React from 'react';

export const EmptyingPlateAnimation: React.FC<{ size?: number; className?: string }> = ({
  size = 72,
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
        className="drop-shadow-sm overflow-visible"
      >
        <defs>
          <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="foodGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Base / Prato de Louça */}
        <ellipse cx="50" cy="52" rx="42" ry="34" fill="#cbd5e1" opacity="0.6" />
        <ellipse cx="50" cy="50" rx="42" ry="34" fill="url(#plateGrad)" stroke="#94a3b8" strokeWidth="2" />
        {/* Borda interna do prato */}
        <ellipse cx="50" cy="50" rx="32" ry="24" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Garfinho ao lado esquerdo */}
        <path d="M12 30 L12 70 M8 30 L8 40 M16 30 L16 40" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        {/* Faquinha ao lado direito */}
        <path d="M88 30 L88 70 M88 30 Q92 40 88 48" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />

        {/* COMIDINHAS DO PRATO QUE ESVAZIAM CICLICAMENTE */}
        <g className="animate-plate-empty origin-center">
          {/* Arroz / Carboidrato */}
          <ellipse cx="40" cy="48" rx="12" ry="8" fill="#fef08a" stroke="#facc15" strokeWidth="1" />
          {/* Proteína / Grelhado */}
          <path d="M48 42 Q 62 38 64 50 Q 56 56 46 50 Z" fill="url(#foodGrad1)" />
          {/* Legumes / Saladinha verde no prato */}
          <circle cx="56" cy="44" r="5" fill="#4ade80" />
          <circle cx="62" cy="46" r="4" fill="#22c55e" />
          {/* Tomatinho */}
          <circle cx="48" cy="54" r="4" fill="#ef4444" />
          <circle cx="47" cy="53" r="1" fill="#ffffff" />
        </g>

        {/* Garfo/colher que 'come' a comida */}
        <g className="animate-fork-bite origin-center">
          <circle cx="50" cy="32" r="3" fill="#f59e0b" opacity="0.8" />
          <text x="70" y="24" fontSize="11" className="animate-bounce">✨</text>
        </g>
      </svg>
    </div>
  );
};

