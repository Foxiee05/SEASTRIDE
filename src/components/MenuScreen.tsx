import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { ASSETS } from '../assets';
import { useCutoutImage } from '../utils/imageUtils';
import { useGame } from '../context/GameContext';
import { soundFx } from '../utils/audio';

interface MenuScreenProps {
  onSelectSteps: () => void;
  onSelectGame: () => void;
  onSelectLeaderboard: () => void;
}

export function MenuScreen({ onSelectSteps, onSelectGame, onSelectLeaderboard }: MenuScreenProps) {
  const transparentLogo = useCutoutImage(ASSETS.logo, { mode: 'edge' });
  const { isMuted, toggleMute } = useGame();

  const handleButtonClick = (action: () => void) => {
    soundFx.playClick();
    action();
  };

  return (
    <div className="absolute inset-0 w-full h-full z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ASSETS.menuBg})` }}
      />
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Top Bar / Controls */}
      <div className="absolute top-0 right-0 p-4 sm:p-6 z-20">
        <button
          onClick={toggleMute}
          className="w-12 h-12 bg-[#78350f]/80 backdrop-blur-sm border-2 border-[#d97706] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 pt-12 pb-16 sm:pb-24 h-full justify-between">
        
        {/* Logo Section */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
          className="w-full max-w-lg mt-8 sm:mt-16 flex justify-center drop-shadow-2xl"
        >
          <img 
            src={transparentLogo} 
            alt="SeaStride Logo" 
            className="w-full max-w-[420px] sm:max-w-[480px] h-auto object-contain" 
          />
        </motion.div>

        {/* Buttons Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col gap-5 w-full max-w-[280px] sm:max-w-[320px] mb-8"
        >
          {/* Steps Counter Button */}
          <button 
            onClick={() => handleButtonClick(onSelectSteps)}
            className="w-full relative group active:scale-95 transition-transform select-none"
          >
            <div className="absolute inset-0 bg-[#451a03] rounded-2xl translate-y-1.5 sm:translate-y-2"></div>
            <div className="relative h-16 sm:h-20 bg-gradient-to-b from-[#d97706] via-[#b45309] to-[#78350f] rounded-2xl border-3 sm:border-4 border-[#facc15] flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5)] overflow-hidden group-hover:brightness-110 transition-all">
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/20 pointer-events-none"></div>
              <span className="font-serif font-black text-[#fef3c7] text-xl sm:text-2xl tracking-widest uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10 text-center px-2">
                Steps Counter
              </span>
            </div>
          </button>

          {/* Gameplay Button */}
          <button 
            onClick={() => handleButtonClick(onSelectGame)}
            className="w-full relative group active:scale-95 transition-transform select-none"
          >
            <div className="absolute inset-0 bg-[#172554] rounded-2xl translate-y-1.5 sm:translate-y-2"></div>
            <div className="relative h-16 sm:h-20 bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a] rounded-2xl border-3 sm:border-4 border-[#93c5fd] flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5)] overflow-hidden group-hover:brightness-110 transition-all">
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/20 pointer-events-none"></div>
              <span className="font-serif font-black text-white text-xl sm:text-2xl tracking-widest uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10 text-center px-2">
                Gameplay
              </span>
            </div>
          </button>

          {/* Leaderboard Button */}
          <button 
            onClick={() => handleButtonClick(onSelectLeaderboard)}
            className="w-full relative group active:scale-95 transition-transform select-none"
          >
            <div className="absolute inset-0 bg-[#451a03] rounded-2xl translate-y-1.5 sm:translate-y-2"></div>
            <div className="relative h-16 sm:h-20 bg-gradient-to-b from-[#b45309] via-[#92400e] to-[#78350f] rounded-2xl border-3 sm:border-4 border-[#facc15] flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5)] overflow-hidden group-hover:brightness-110 transition-all">
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/20 pointer-events-none"></div>
              <span className="font-serif font-black text-[#fde68a] text-xl sm:text-2xl tracking-widest uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10 text-center px-2">
                Leaderboard
              </span>
            </div>
          </button>
        </motion.div>

      </div>
    </div>
  );
}
