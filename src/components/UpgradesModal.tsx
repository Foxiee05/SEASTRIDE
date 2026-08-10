import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getShipImageForLevel, getCannonImageForLevel, getShieldImageForLevel } from '../assets';
import { useCutoutImage } from '../utils/imageUtils';
import { X, Shield, Plus, ArrowUp } from 'lucide-react';

interface UpgradesModalProps {
  onClose: () => void;
}

export const UpgradesModal: React.FC<UpgradesModalProps> = ({ onClose }) => {
  const {
    coins,
    shipLevel,
    shipMaxHp,
    cannonLevel,
    cannonCount,
    shieldLevel,
    upgradeShip,
    upgradeCannon,
    buyCannon,
    upgradeShield
  } = useGame();

  const [activeTab, setActiveTab] = useState<'ship' | 'cannons' | 'shield'>('ship');

  // Cutout images for 100% opaque render without translucent background
  const shipImg = useCutoutImage(getShipImageForLevel(shipLevel));
  const cannonImg = useCutoutImage(getCannonImageForLevel(cannonLevel));
  const shieldImg = useCutoutImage(getShieldImageForLevel(shieldLevel));

  // Next upgrade cost calculation
  const shipUpgradeCost = shipLevel === 1 ? 1000 : 1000 + (shipLevel - 1) * 500;
  const cannonUpgradeCost = 100;
  const cannonBuyCost = 100;
  const shieldUpgradeCost = 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div className="bg-[#78350f] border-8 border-[#451a03] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-amber-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#451a03] border-b-4 border-[#78350f] p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#facc15]" />
            <h2 className="text-base font-serif font-black uppercase text-[#fde68a] tracking-wider">
              Armory & Ship Upgrades
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#78350f] border-2 border-[#b45309] px-3 py-1 rounded-lg text-xs font-black text-[#fbbf24] flex items-center gap-1 shadow">
              <span>🪙</span>
              <span>{coins.toLocaleString()}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-[#78350f] hover:bg-[#92400e] rounded-lg border border-[#b45309] text-[#fde68a]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#451a03] p-2 flex border-b-2 border-[#78350f] gap-1">
          <button
            onClick={() => setActiveTab('ship')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase italic transition-all border-b-4 border-r-2 ${
              activeTab === 'ship'
                ? 'bg-[#b45309] border-[#451a03] text-white shadow'
                : 'text-[#fde68a]/80 hover:text-white bg-[#78350f] border-[#451a03]'
            }`}
          >
            ⛵ Ship (Lv.{shipLevel})
          </button>

          <button
            onClick={() => setActiveTab('cannons')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase italic transition-all border-b-4 border-r-2 ${
              activeTab === 'cannons'
                ? 'bg-[#b45309] border-[#451a03] text-white shadow'
                : 'text-[#fde68a]/80 hover:text-white bg-[#78350f] border-[#451a03]'
            }`}
          >
            💣 Cannons (Lv.{cannonLevel})
          </button>

          <button
            onClick={() => setActiveTab('shield')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase italic transition-all border-b-4 border-r-2 ${
              activeTab === 'shield'
                ? 'bg-[#b45309] border-[#451a03] text-white shadow'
                : 'text-[#fde68a]/80 hover:text-white bg-[#78350f] border-[#451a03]'
            }`}
          >
            🛡️ Shield (Lv.{shieldLevel})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">

          {/* SHIP TAB */}
          {activeTab === 'ship' && (
            <div className="space-y-4 text-center">
              <div className="bg-[#451a03] border-4 border-[#b45309] rounded-2xl p-4 flex flex-col items-center">
                <img
                  src={shipImg}
                  alt="Ship Level"
                  referrerPolicy="no-referrer"
                  className="w-36 h-36 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                />
                <div className="text-lg font-serif font-black text-[#fbbf24] mt-2">
                  Level {shipLevel} Flagship Vessel
                </div>
                <div className="text-xs text-[#fde68a]/80 font-mono mt-1">
                  Max Hull Strength: <span className="font-bold text-white">{shipMaxHp.toLocaleString()} HP</span>
                </div>
              </div>

              {/* Upgrade Info */}
              <div className="bg-[#451a03] border-2 border-[#b45309] rounded-xl p-3 text-left space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-[#fde68a]">
                  <span>Current Level HP:</span>
                  <span>{shipMaxHp.toLocaleString()} HP</span>
                </div>
                <div className="flex justify-between font-bold text-[#16a34a]">
                  <span>Next Level ({shipLevel < 10 ? shipLevel + 1 : 'MAX'}):</span>
                  <span>+5,000 HP (Total {(shipMaxHp + 5000).toLocaleString()} HP)</span>
                </div>
                <p className="text-[10px] text-[#fde68a]/70 font-mono pt-1">
                  *Permanent Purchase. Level 1→2 costs 1,000 coins (+500 per level afterwards).
                </p>
              </div>

              <button
                onClick={upgradeShip}
                disabled={shipLevel >= 10 || coins < shipUpgradeCost}
                className={`w-full py-3.5 rounded-xl font-black text-sm uppercase italic tracking-wider flex items-center justify-center gap-2 border-b-4 border-r-2 shadow-xl ${
                  shipLevel >= 10
                    ? 'bg-stone-800 border-[#451a03] text-stone-500 cursor-not-allowed'
                    : coins < shipUpgradeCost
                    ? 'bg-[#451a03] border-[#78350f] text-stone-400 cursor-not-allowed'
                    : 'bg-[#b45309] hover:bg-[#d97706] border-[#451a03] text-white active:translate-y-1'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
                <span>
                  {shipLevel >= 10 ? 'MAX LEVEL REACHED' : `Upgrade Ship (${shipUpgradeCost.toLocaleString()} Coins)`}
                </span>
              </button>
            </div>
          )}

          {/* CANNONS TAB */}
          {activeTab === 'cannons' && (
            <div className="space-y-4 text-center">
              <div className="bg-[#451a03] border-4 border-[#b45309] rounded-2xl p-4 flex flex-col items-center">
                <img
                  src={cannonImg}
                  alt="Cannon Level"
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                />
                <div className="text-lg font-serif font-black text-[#fbbf24] mt-2">
                  Level {cannonLevel} Heavy Cannon
                </div>
                <div className="text-xs text-[#fde68a]/80 font-mono mt-1">
                  Base Damage: <span className="font-bold text-white">{(2500 + (cannonLevel - 1) * 2500).toLocaleString()}</span> • Equipped: <span className="font-bold text-[#fbbf24]">{cannonCount} Cannons</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Buy New Cannon */}
                <button
                  onClick={buyCannon}
                  disabled={cannonCount >= 6 || coins < cannonBuyCost}
                  className={`p-3 rounded-xl font-black text-xs uppercase italic flex flex-col items-center justify-center gap-1 border-b-4 border-r-2 shadow-lg ${
                    cannonCount >= 6 || coins < cannonBuyCost
                      ? 'bg-stone-900 border-[#451a03] text-stone-500 cursor-not-allowed'
                      : 'bg-[#1d4ed8] hover:bg-[#2563eb] border-[#1e3a8a] text-white active:translate-y-1'
                  }`}
                >
                  <Plus className="w-4 h-4 text-[#facc15]" />
                  <span>Buy Extra Cannon</span>
                  <span className="text-[10px] text-[#fde68a] font-normal">Cost: 100 Coins</span>
                </button>

                {/* Upgrade Cannon Level */}
                <button
                  onClick={upgradeCannon}
                  disabled={cannonLevel >= 10 || coins < cannonUpgradeCost}
                  className={`p-3 rounded-xl font-black text-xs uppercase italic flex flex-col items-center justify-center gap-1 border-b-4 border-r-2 shadow-lg ${
                    cannonLevel >= 10 || coins < cannonUpgradeCost
                      ? 'bg-stone-900 border-[#451a03] text-stone-500 cursor-not-allowed'
                      : 'bg-[#b45309] hover:bg-[#d97706] border-[#451a03] text-white active:translate-y-1'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>Upgrade Cannon Lv</span>
                  <span className="text-[10px] text-[#fde68a] font-bold">Cost: 100 Coins (+2.5k Dmg)</span>
                </button>
              </div>

              <p className="text-[10px] text-[#fde68a]/80 font-mono text-left bg-[#451a03] p-3 rounded-xl border border-[#b45309]">
                ⚠️ Warning: Cannons can be looted by enemy raiders if your ship's HP falls below 30% during a battle!
              </p>
            </div>
          )}

          {/* SHIELD TAB */}
          {activeTab === 'shield' && (
            <div className="space-y-4 text-center">
              <div className="bg-[#451a03] border-4 border-[#b45309] rounded-2xl p-4 flex flex-col items-center">
                <img
                  src={shieldImg}
                  alt="Shield Level"
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                />
                <div className="text-lg font-serif font-black text-[#fbbf24] mt-2">
                  {shieldLevel === 0 ? 'No Shield Equipped' : `Level ${shieldLevel} Captain Shield`}
                </div>
                <div className="text-xs text-[#fde68a]/80 font-mono mt-1">
                  Protects from equipment loss 1 - 3 times during enemy raids.
                </div>
              </div>

              <button
                onClick={upgradeShield}
                disabled={shieldLevel >= 3 || coins < shieldUpgradeCost}
                className={`w-full py-3.5 rounded-xl font-black text-sm uppercase italic tracking-wider flex items-center justify-center gap-2 border-b-4 border-r-2 shadow-xl ${
                  shieldLevel >= 3
                    ? 'bg-stone-800 border-[#451a03] text-stone-500 cursor-not-allowed'
                    : coins < shieldUpgradeCost
                    ? 'bg-[#451a03] border-[#78350f] text-stone-400 cursor-not-allowed'
                    : 'bg-[#b45309] hover:bg-[#d97706] border-[#451a03] text-white active:translate-y-1'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
                <span>
                  {shieldLevel >= 3
                    ? 'MAX SHIELD LEVEL (3)'
                    : shieldLevel === 0
                    ? 'Buy Shield (100 Coins)'
                    : `Upgrade Shield Lv.${shieldLevel + 1} (100 Coins)`}
                </span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
