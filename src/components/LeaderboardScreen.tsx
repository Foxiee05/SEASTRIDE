import React, { useState, useMemo } from 'react';
import { ArrowLeft, Anchor, CircleDollarSign, Medal, Calendar, Footprints, TrendingUp } from 'lucide-react';
import { useGame } from '../context/GameContext';

import { BackToSeaStride } from './BackToSeaStride';
import { PIRATE_AVATARS } from '../assets';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const baseLeaderboard = [
  { id: 'bot_1', name: 'Captain Silver', level: 6, gold: 15200, isCurrentUser: false, avatarUrl: PIRATE_AVATARS[1]?.url },
  { id: 'bot_2', name: 'Scurvy Sally', level: 5, gold: 11850, isCurrentUser: false, avatarUrl: PIRATE_AVATARS[4]?.url },
  { id: 'bot_3', name: 'Captain Pegleg', level: 3, gold: 3400, isCurrentUser: false, avatarUrl: PIRATE_AVATARS[2]?.url },
  { id: 'bot_4', name: "Walkin' Willie", level: 2, gold: 800, isCurrentUser: false, avatarUrl: PIRATE_AVATARS[3]?.url },
];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const { profile, shipLevel, coins } = useGame();
  const [activeTab, setActiveTab] = useState<'level' | 'coins'>('level');

  const displayLevel = shipLevel || 4;

  const sortedLeaderboard = useMemo(() => {
    const currentUser = {
      id: 'current_user',
      name: profile?.username || 'Wanderer',
      level: displayLevel,
      gold: coins,
      isCurrentUser: true,
      avatarUrl: profile?.avatarUrl,
    };

    const combined = [...baseLeaderboard, currentUser];

    return combined.sort((a, b) => {
      if (activeTab === 'level') {
        return b.level === a.level ? b.gold - a.gold : b.level - a.level;
      } else {
        return b.gold === a.gold ? b.level - a.level : b.gold - a.gold;
      }
    }).map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  }, [displayLevel, coins, profile?.username, activeTab]);

  return (
    <div className="flex flex-col h-full bg-[#78350f] text-amber-100 font-serif selection:bg-[#facc15] selection:text-stone-950 overflow-hidden relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#451a03] border-b-4 sm:border-b-8 border-[#78350f] shadow-2xl px-3 sm:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackToSeaStride onClick={onBack} />
          <div className="flex items-center gap-2">
            <Anchor className="w-6 h-6 sm:w-8 sm:h-8 text-[#facc15]" />
            <h1 className="text-xl sm:text-2xl font-black text-amber-100 uppercase tracking-widest drop-shadow-md">
              Fleet
            </h1>
          </div>
        </div>

        {/* Current User Gold Pill */}
        <div className="flex items-center justify-center gap-1.5 bg-[#2e1204] border-2 border-[#451a03] rounded-full px-3 py-1 sm:px-4 sm:py-1.5 shadow-sm">
          <CircleDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#facc15]" />
          <span className="text-[#facc15] font-serif font-bold text-sm sm:text-base leading-none tracking-wide">{coins.toLocaleString()}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
        {/* Tabs */}
        <div className="flex bg-[#1c0a02] rounded-xl border-2 border-[#451a03] p-1 mb-6 shadow-inner">
          <button
            onClick={() => setActiveTab('level')}
            className={`flex-1 py-2 sm:py-3 px-4 text-xs sm:text-sm font-black uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'level'
                ? 'bg-[#451a03] text-[#facc15] shadow-md border-b-2 border-[#facc15]/30'
                : 'text-amber-100/50 hover:text-amber-100 hover:bg-[#2e1204]'
            }`}
          >
            Ship Level
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`flex-1 py-2 sm:py-3 px-4 text-xs sm:text-sm font-black uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'coins'
                ? 'bg-[#451a03] text-[#facc15] shadow-md border-b-2 border-[#facc15]/30'
                : 'text-amber-100/50 hover:text-amber-100 hover:bg-[#2e1204]'
            }`}
          >
            Coins Earned
          </button>
        </div>

        {/* Weekly Voyage Dashboard (Only visible in Coins Earned tab) */}
        {activeTab === 'coins' && (
          <div className="bg-[#451a03] border-2 border-[#b45309] rounded-2xl p-4 sm:p-5 mb-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Calendar className="w-32 h-32 text-[#facc15]" />
            </div>
            
            <h2 className="text-sm sm:text-base font-black text-amber-100 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#facc15]" /> My Weekly Voyage
            </h2>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
              {/* Distance Card */}
              <div className="bg-[#1c0a02] rounded-xl border-2 border-[#78350f] p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10"><Footprints className="w-10 h-10 text-amber-100" /></div>
                 <span className="text-[10px] sm:text-xs font-bold text-amber-100/70 uppercase tracking-wider mb-1 z-10">Distance This Week</span>
                 <span className="text-xl sm:text-2xl font-black text-amber-100 z-10">18.6 <span className="text-xs text-amber-100/70">km</span></span>
              </div>

              {/* Coins Card */}
              <div className="bg-gradient-to-br from-[#b45309]/30 to-[#78350f]/60 rounded-xl border-2 border-[#facc15]/40 p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(250,204,21,0.15)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10"><CircleDollarSign className="w-10 h-10 text-[#facc15]" /></div>
                 <span className="text-[10px] sm:text-xs font-bold text-[#fde68a]/90 uppercase tracking-wider mb-1 z-10">Coins Earned This Week</span>
                 <div className="flex items-center gap-1.5 z-10">
                   <CircleDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#facc15] drop-shadow-md" />
                   <span className="text-xl sm:text-2xl font-black text-[#fbbf24] drop-shadow-md">1,450</span>
                 </div>
              </div>
            </div>

            {/* Daily Steps Chart */}
            <div className="mt-5 pt-5 border-t-2 border-dashed border-[#78350f] relative z-10">
              <h3 className="text-[10px] sm:text-xs font-black text-amber-100/90 tracking-widest uppercase mb-4 text-center">
                Daily Steps
              </h3>
              <div className="flex items-end justify-between h-32 gap-1 sm:gap-2">
                {[
                  { day: 'M', fullDay: 'Monday', steps: 4250 },
                  { day: 'T', fullDay: 'Tuesday', steps: 6180 },
                  { day: 'W', fullDay: 'Wednesday', steps: 3920 },
                  { day: 'T', fullDay: 'Thursday', steps: 7450 },
                  { day: 'F', fullDay: 'Friday', steps: 5630 },
                  { day: 'S', fullDay: 'Saturday', steps: 8120, isMax: true },
                  { day: 'S', fullDay: 'Sunday', steps: 4870 },
                ].map((data, index) => {
                  const heightPercent = Math.min(100, Math.max(10, (data.steps / 10000) * 100));
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group relative">
                      {/* Hover tooltip for steps */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#1c0a02] border border-[#facc15]/50 rounded px-2 py-1 text-[10px] sm:text-xs text-[#facc15] font-bold whitespace-nowrap pointer-events-none shadow-lg z-20">
                        {data.steps.toLocaleString()}
                      </div>
                      
                      {/* Bar container */}
                      <div className="w-full relative flex items-end justify-center h-[100px] mb-2">
                        <div 
                          className={`w-full max-w-[24px] sm:max-w-[32px] rounded-t-md transition-all duration-500 ease-out border-t border-white/20 ${
                            data.isMax 
                              ? 'bg-gradient-to-t from-[#b45309] to-[#facc15] shadow-[0_0_15px_rgba(250,204,21,0.4)]' 
                              : 'bg-gradient-to-t from-[#451a03] to-[#92400e] group-hover:from-[#78350f] group-hover:to-[#b45309]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      
                      {/* Day label */}
                      <span className={`text-[10px] sm:text-xs font-black uppercase ${
                        data.isMax ? 'text-[#facc15]' : 'text-amber-100/60 group-hover:text-amber-100'
                      }`}>
                        {data.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Table Headers */}
        <div className="flex items-center px-4 mb-2 text-[10px] sm:text-xs font-black text-[#fde68a] uppercase tracking-widest opacity-80">
          <div className="w-12 text-center">Rank</div>
          <div className="flex-1 px-3">Pirate</div>
          <div className="w-16 text-center">Ship</div>
          <div className="w-24 text-right">Gold</div>
        </div>

        {/* Leaderboard List */}
        <div className="flex flex-col gap-3">
          {sortedLeaderboard.map((player) => (
            <div 
              key={player.id}
              className={`flex items-center p-3 sm:p-4 rounded-xl border-2 transition-all shadow-md ${
                player.isCurrentUser 
                  ? 'bg-gradient-to-r from-[#b45309]/40 to-[#78350f]/40 border-[#facc15] shadow-[0_0_15px_rgba(250,204,21,0.2)]'
                  : 'bg-[#451a03] border-[#78350f]'
              }`}
            >
              {/* Rank */}
              <div className="w-12 flex justify-center">
                <span className={`text-base sm:text-lg font-black ${
                  player.rank === 1 ? 'text-[#facc15] drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' :
                  player.rank === 2 ? 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]' :
                  player.rank === 3 ? 'text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' :
                  'text-[#fde68a]/70'
                }`}>
                  #{player.rank}
                </span>
              </div>

              {/* Pirate Avatar & Name */}
              <div className="flex-1 flex items-center gap-3 px-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-[#78350f] overflow-hidden ${
                  player.isCurrentUser ? 'border-[#facc15]' : 'border-[#b45309]'
                }`}>
                  {player.avatarUrl ? (
                    <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm">☠️</span>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className={`font-bold text-sm sm:text-base truncate ${
                    player.isCurrentUser ? 'text-[#facc15]' : 'text-amber-100'
                  }`}>
                    {player.isCurrentUser && profile?.username ? `${profile.username} (You)` : player.name}
                  </span>
                </div>
              </div>

              {/* Ship Level */}
              <div className="w-16 text-center">
                <span className="text-xs sm:text-sm font-bold text-amber-100/90">
                  Lvl {player.level}
                </span>
              </div>

              {/* Gold */}
              <div className="w-24 flex items-center justify-end gap-1.5 text-right">
                <CircleDollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#facc15]" />
                <span className="text-sm sm:text-base font-black text-[#fbbf24]">
                  {player.gold.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative gradient at bottom to indicate scroll */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0c4a6e]/50 to-transparent pointer-events-none" />
    </div>
  );
};

