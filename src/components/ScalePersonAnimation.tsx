import React from 'react';

export const ScalePersonAnimation: React.FC<{ size?: number; className?: string }> = ({
  size = 76,
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
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="scaleBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="displayScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>

        {/* --- BALANÇA DIGITAL NO CHÃO --- */}
        {/* Base da balança */}
        <rect
          x="18"
          y="76"
          width="64"
          height="14"
          rx="5"
          fill="url(#scaleBody)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Pés de borracha da balança */}
        <rect x="24" y="89" width="10" height="3" rx="1.5" fill="#64748b" />
        <rect x="66" y="89" width="10" height="3" rx="1.5" fill="#64748b" />

        {/* Visor digital da balança */}
        <rect
          x="38"
          y="78"
          width="24"
          height="8"
          rx="2"
          fill="url(#displayScreen)"
          stroke="#38bdf8"
          strokeWidth="0.8"
        />
        {/* Dígitos luminosos que mudam quando pisa */}
        <text
          x="50"
          y="84.5"
          textAnchor="middle"
          fontSize="5"
          fill="#38bdf8"
          fontFamily="monospace"
          fontWeight="bold"
          className="animate-scale-digits"
        >
          68.5kg
        </text>

        {/* --- PESSOA SUBINDO E DESCENDO NA BALANÇA --- */}
        <g className="animate-person-stepping origin-bottom">
          {/* Cabeça */}
          <circle cx="50" cy="22" r="8" fill="#0284c7" />
          {/* Rostinho feliz */}
          <circle cx="47.5" cy="21" r="1" fill="#ffffff" />
          <circle cx="52.5" cy="21" r="1" fill="#ffffff" />
          <path
            d="M47.5 24.5 Q 50 27 52.5 24.5"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tronco da pessoa */}
          <path
            d="M44 32 C 44 30, 56 30, 56 32 L 54 52 C 54 53, 46 53, 46 52 Z"
            fill="#38bdf8"
          />

          {/* Braços comemorando o progresso da pesagem */}
          <path
            d="M44 34 Q 35 40 33 32"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-arm-balance-left origin-[44px_34px]"
          />
          <path
            d="M56 34 Q 65 40 67 32"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-arm-balance-right origin-[56px_34px]"
          />

          {/* Perna Esquerda */}
          <path
            d="M47 52 L 46 68 L 41 76"
            stroke="#0369a1"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Perna Direita */}
          <path
            d="M53 52 L 54 68 L 59 76"
            stroke="#0369a1"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tênis / Pés */}
          <ellipse cx="40" cy="76" rx="4" ry="2" fill="#0f172a" />
          <ellipse cx="60" cy="76" rx="4" ry="2" fill="#0f172a" />
        </g>
      </svg>
    </div>
  );
};

