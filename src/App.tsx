import React, { useState, useRef, useEffect } from 'react';
import { GameProvider } from './context/GameContext';
import { HeaderHUD } from './components/HeaderHUD';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { UpgradesModal } from './components/UpgradesModal';
import { ShopModal } from './components/ShopModal';
import { ServerModal } from './components/ServerModal';
import { RepairModal } from './components/RepairModal';
import { RaidHistoryModal } from './components/RaidHistoryModal';
import { AttackModal } from './components/AttackModal';
import { ShipInspectModal } from './components/ShipInspectModal';
import { ProfileModal } from './components/ProfileModal';
import { soundFx } from './utils/audio';

type ActiveModal = 'upgrades' | 'shop' | 'server' | 'repair' | 'raids' | 'attack' | 'shipInspect' | 'profile' | null;

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<'home' | 'game'>('game');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Auto-start pirate BGM on load & play distinct sounds for buttons
  useEffect(() => {
    // Attempt BGM start immediately
    soundFx.startBgm();

    const handleFirstUserInteraction = () => {
      soundFx.startBgm();
    };

    const handleGlobalButtonClick = (e: MouseEvent) => {
      soundFx.startBgm();
      const target = e.target as HTMLElement | null;
      if (target) {
        const button = target.closest('button, [role="button"]') as HTMLElement | null;
        if (button) {
          const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
          const title = button.getAttribute('title')?.toLowerCase() || '';
          const text = button.innerText?.trim() || '';

          const isCloseButton =
            ariaLabel.includes('close') ||
            title.includes('close') ||
            text === '✕' ||
            text === '×' ||
            text.toLowerCase().includes('close') ||
            button.querySelector('svg.lucide-x') !== null ||
            button.classList.contains('close-btn');

          if (isCloseButton) {
            soundFx.playClose();
          } else {
            soundFx.playClick();
          }
        }
      }
    };

    window.addEventListener('pointerdown', handleFirstUserInteraction);
    window.addEventListener('touchstart', handleFirstUserInteraction);
    window.addEventListener('mousedown', handleFirstUserInteraction);
    window.addEventListener('keydown', handleFirstUserInteraction);
    window.addEventListener('click', handleGlobalButtonClick, true);

    return () => {
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('mousedown', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('click', handleGlobalButtonClick, true);
    };
  }, []);

  // Touch Swipe Gesture State
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Minimum swipe threshold of 35px, and horizontal distance must exceed vertical distance
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0 && activeTab === 'home') {
        // Swiping Left: Go from Steps Bar to Game Screen
        setActiveTab('game');
      } else if (deltaX > 0 && activeTab === 'game') {
        // Swiping Right: Go from Game Screen to Steps Bar
        setActiveTab('home');
      }
    }
  };

  const openModal = (modal: NonNullable<ActiveModal>) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#0c4a6e] font-serif text-amber-100 antialiased selection:bg-[#facc15] selection:text-stone-950 flex justify-center items-center p-0 sm:p-2 relative overflow-hidden">
      {/* Background theme ambient elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 w-full h-[30%] bg-[#fde68a]/20" />
        <div className="absolute top-10 right-10 w-48 h-48 bg-[#fef08a] rounded-full blur-3xl opacity-20" />
      </div>

      {/* Mobile / Desktop Frame Container for Game App experience - Fixed viewport height for zero-scroll mobile UI */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-md sm:max-w-2xl bg-[#78350f] border-0 sm:border-8 border-[#451a03] sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden h-full max-h-[100dvh] sm:max-h-[850px] flex flex-col relative z-10"
      >
        
        {/* HUD Top Bar */}
        <HeaderHUD
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openModal={openModal}
        />

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto relative flex flex-col">
          {activeTab === 'home' ? (
            <HomeScreen />
          ) : (
            <GameScreen openModal={openModal} />
          )}
        </main>

        {/* Theme Footer - Compact */}
        <footer className="w-full h-6 sm:h-8 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 text-[9px] sm:text-[10px] tracking-widest uppercase font-bold border-t border-[#78350f] flex-shrink-0">
          Voyage Phase: The Serpent Seas • SeaStride Expedition
        </footer>

        {/* Interactive Modals */}
        {activeModal === 'upgrades' && <UpgradesModal onClose={closeModal} />}
        {activeModal === 'shop' && <ShopModal onClose={closeModal} />}
        {activeModal === 'server' && <ServerModal onClose={closeModal} />}
        {activeModal === 'repair' && <RepairModal onClose={closeModal} />}
        {activeModal === 'raids' && <RaidHistoryModal onClose={closeModal} />}
        {activeModal === 'attack' && <AttackModal onClose={closeModal} />}
        {activeModal === 'shipInspect' && (
          <ShipInspectModal
            onClose={closeModal}
            onOpenRepair={() => openModal('repair')}
            onOpenUpgrades={() => openModal('upgrades')}
          />
        )}
        {activeModal === 'profile' && <ProfileModal onClose={closeModal} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
