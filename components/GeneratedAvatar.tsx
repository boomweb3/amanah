
import React from 'react';

interface GeneratedAvatarProps {
  seed: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const GeneratedAvatar: React.FC<GeneratedAvatarProps> = ({ seed, size = 'md', className = '' }) => {
  // Deterministic hash function
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hash = getHash(seed);
  
  // Define dimensions based on size
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  };

  // 5x5 Grid pattern logic
  // We generate a 3x5 grid and mirror it to create a 5x5 symmetrical pattern
  const grid: boolean[][] = [];
  for (let y = 0; y < 5; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < 3; x++) {
      // Use bits from the hash to determine if a cell is filled
      const bitIndex = (y * 3) + x;
      row.push(((hash >> bitIndex) & 1) === 1);
    }
    // Mirror the row
    row.push(row[1]);
    row.push(row[0]);
    grid.push(row);
  }

  // Use the hash to pick a professional color from a neutral, low-saturation palette
  const palettes = [
    { fill: 'fill-slate-400 dark:fill-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
    { fill: 'fill-blue-400 dark:fill-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { fill: 'fill-indigo-400 dark:fill-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { fill: 'fill-teal-400 dark:fill-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    { fill: 'fill-cyan-400 dark:fill-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' }
  ];
  const palette = palettes[hash % palettes.length];

  return (
    <div className={`${sizes[size]} ${palette.bg} rounded-2xl overflow-hidden flex items-center justify-center p-1.5 transition-colors duration-500 ${className}`}>
      <svg viewBox="0 0 5 5" className={`w-full h-full ${palette.fill}`}>
        {grid.map((row, y) => 
          row.map((active, x) => 
            active ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null
          )
        )}
      </svg>
    </div>
  );
};

export default GeneratedAvatar;
