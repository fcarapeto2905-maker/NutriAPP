import React from 'react';

export const DancingSalad: React.FC<{ size?: number; className?: string }> = ({ size = 96, className = '' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-salad-dance origin-bottom drop-shadow-md"
      >
        <defs>
          <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="lettuceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Bracinhos dançando */}
        <path
          d="M26 62 Q 10 50 16 38"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-arm-left origin-[26px_62px]"
        />
        <path
          d="M94 62 Q 110 50 104 38"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-arm-right origin-[94px_62px]"
        />

        {/* Folhas de alface saindo da tigela */}
        {/* Folha esquerda */}
        <path
          d="M32 55 C 22 42, 28 25, 42 28 C 48 30, 52 40, 50 54 Z"
          fill="url(#lettuceGrad)"
        />
        {/* Folha central/topo com carinha feliz */}
        <path
          d="M45 52 C 40 32, 50 18, 62 18 C 74 18, 80 32, 75 52 Z"
          fill="#86efac"
        />
        {/* Folha direita */}
        <path
          d="M68 54 C 66 40, 72 28, 86 30 C 98 32, 98 48, 88 56 Z"
          fill="url(#lettuceGrad)"
        />

        {/* Tomatinhos cereja e vegetais */}
        <circle cx="44" cy="46" r="6" fill="#ef4444" />
        <circle cx="42" cy="44" r="1.5" fill="#ffffff" />
        <circle cx="76" cy="48" r="6.5" fill="#f97316" />
        <circle cx="74" cy="46" r="1.5" fill="#ffffff" />
        <circle cx="60" cy="40" r="5" fill="#ef4444" />
        <circle cx="58" cy="38" r="1.2" fill="#ffffff" />

        {/* Pepino fatiado */}
        <circle cx="60" cy="50" r="7" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />

        {/* Tigela da Salada (Azul Claro Vibrante) */}
        <path
          d="M20 54 C 20 86, 40 98, 60 98 C 80 98, 100 86, 100 54 Z"
          fill="url(#bowlGrad)"
        />
        {/* Borda da tigela */}
        <ellipse cx="60" cy="54" rx="40" ry="8" fill="#bae6fd" />
        <ellipse cx="60" cy="54" rx="38" ry="6" fill="#38bdf8" />

        {/* Olhinhos fofos piscando/sorrindo na tigela */}
        <ellipse cx="48" cy="70" rx="3" ry="4" fill="#0f172a" />
        <circle cx="47" cy="68" r="1" fill="#ffffff" />
        <ellipse cx="72" cy="70" rx="3" ry="4" fill="#0f172a" />
        <circle cx="71" cy="68" r="1" fill="#ffffff" />

        {/* Bochechinhas rosadas */}
        <circle cx="40" cy="75" r="3.5" fill="#f43f5e" opacity="0.5" />
        <circle cx="80" cy="75" r="3.5" fill="#f43f5e" opacity="0.5" />

        {/* Boquinha sorrindo */}
        <path
          d="M54 75 Q 60 82 66 75"
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Perninhas dançando */}
        <path
          d="M48 97 L 42 110 L 35 110"
          stroke="#0284c7"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M72 97 L 78 110 L 85 110"
          stroke="#0284c7"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Notas musicais / estrelinhas de alegria */}
        <text x="14" y="24" fontSize="14" className="animate-bounce">🥗</text>
        <text x="96" y="26" fontSize="14" className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</text>
      </svg>
    </div>
  );
};

