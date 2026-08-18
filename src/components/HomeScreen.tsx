import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Footprints, CircleDollarSign, Flame, Compass, ChevronRight, Route, Timer, Swords, Calendar, TrendingUp, Shield, Map as MapIcon, BarChart3 } from 'lucide-react';
import { usePedometer } from '../hooks/usePedometer';
import { StepMapView } from './StepMapView';
import { soundFx } from '../utils/audio';

const DAILY_QUESTS = [
  { id: 'q1', title: 'Morning Stroll', desc: 'Walk 1,500 steps', target: 1500, xp: 50 },
  { id: 'q2', title: 'Afternoon Sprint', desc: 'Walk 3,000 steps', target: 3000, xp: 100 },
  { id: 'q3', title: 'Treasure Hunter', desc: 'Walk 5,000 steps', target: 5000, xp: 150 },
  { id: 'q4', title: 'Ocean Voyager', desc: 'Walk 10,000 steps', target: 10000, xp: 300 },
];

export const HomeScreen: React.FC = () => {
  const { totalStepsToday, addSteps, shipLevel, profile, stepRecords, stepStats, questIndex, questXp, claimedQuests, claimQuest, playerLevel, playerXp } = useGame();
  
  const [activeTab, setActiveTab] = useState<'map' | 'chart'>('map');
  const [chartMode, setChartMode] = useState<'day' | 'week' | 'month'>('week');
  const [animating, setAnimating] = useState(false);

  const currentQuest = DAILY_QUESTS[Math.min(questIndex, DAILY_QUESTS.length - 1)];
  const isAllQuestsDone = questIndex >= DAILY_QUESTS.length;
  const questProgress = Math.min(totalStepsToday, currentQuest.target);
  const isClaimable = !isAllQuestsDone && questProgress >= currentQuest.target && !claimedQuests.has(currentQuest.id);

  const handleClaimQuest = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isClaimable || animating) return;
    
    soundFx.playVictory();
    setAnimating(true);
    
    setTimeout(() => {
      claimQuest(currentQuest.id, currentQuest.xp);
      setTimeout(() => {
        setAnimating(false);
      }, 50);
    }, 300);
  };

  // Chart data calculation
  const dayData = [
    { label: '6am', steps: 400 },
    { label: '9am', steps: 1200 },
    { label: '12pm', steps: 850 },
    { label: '3pm', steps: 1100 },
    { label: '6pm', steps: 700 },
    { label: '9pm', steps: 300 },
  ];

  const weekData = stepRecords.map(r => ({
    label: r.dayOfWeek,
    steps: r.steps,
  }));

  const monthData = [
    { label: 'Wk 1', steps: 48000 },
    { label: 'Wk 2', steps: 52000 },
    { label: 'Wk 3', steps: 45000 },
    { label: 'Wk 4', steps: totalStepsToday + 32000 },
  ];

  const activeChart = chartMode === 'day' ? dayData : chartMode === 'week' ? weekData : monthData;
  const maxChartSteps = Math.max(...activeChart.map(d => d.steps), 1000);


  // Integrated Pedometer Sensor Hook
  const { permissionStatus, requestPermission } = usePedometer({
    onStep: (count) => {
      addSteps(count);
    },
  });

  // Calculate calories burned & distance approx
  const caloriesBurned = Math.round(totalStepsToday * 0.04);
  const distanceKm = (totalStepsToday * 0.0008).toFixed(1);
  const activeTimeMin = Math.round(totalStepsToday * 0.012);
  const goldEarnedToday = Math.floor(totalStepsToday / 100) * 10;
  
  // Mock weekly statistics based on requirements
  const weeklyDistanceKm = 18.6;
  const weeklyGoldEarned = 1450;
  const weeklyDistanceGoal = 25;

  const currentXp = playerXp;
  const maxXp = 500;
  const displayLevel = playerLevel;

  // If user hasn't granted motion pedometer permission yet, show permission prompt box only
  if (permissionStatus !== 'granted') {
    return (
      <div className="p-4 max-w-md mx-auto my-auto text-amber-100 select-none flex-1 flex flex-col justify-center items-center">
        <div className="bg-[#78350f] border-2 sm:border-4 border-[#451a03] rounded-2xl p-5 sm:p-6 shadow-2xl text-center space-y-4 w-full relative overflow-hidden">
          {/* Decorative corner skulls */}
          <div className="absolute top-2 left-2 text-lg opacity-40">☠️</div>
          <div className="absolute top-2 right-2 text-lg opacity-40">☠️</div>

          <div className="w-16 h-16 bg-[#451a03] border-2 border-[#b45309] rounded-full flex items-center justify-center mx-auto text-amber-300 shadow-inner">
            <Footprints className="w-8 h-8 text-[#facc15] animate-bounce" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-serif font-black uppercase text-[#fde68a] tracking-wide">
              Allow Motion Pedometer
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              SeaStride uses your phone's motion sensor to track physical footsteps while walking.
              Allow pedometer access to unlock your step box, earn Gold Coins, and voyage the seas!
            </p>
          </div>

          <button
            onClick={() => requestPermission()}
            className="w-full bg-[#16a34a] hover:bg-[#22c55e] active:scale-95 text-white font-serif font-black text-xs sm:text-sm py-3 px-4 rounded-xl border-b-4 border-[#064e3b] shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider transition-transform cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#fde68a]" />
            <span>Allow Motion Pedometer</span>
          </button>
        </div>
      </div>
    );
  }

  // Circular progress calculation
  const circleRadius = 110;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const stepGoal = 10000;
  const progressOffset = circleCircumference - (circleCircumference * Math.min(totalStepsToday, stepGoal)) / stepGoal;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto text-amber-100 select-none flex-1 flex flex-col w-full font-serif">
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-amber-100/70 text-sm font-medium">Welcome back</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 mt-0.5">{profile?.username || 'Wanderer'}</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#451a03] border-2 border-[#b45309] rounded-full px-3 py-1.5 shadow-md">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-orange-500" />
          <span className="text-sm sm:text-base font-bold text-amber-100">5 Days</span>
        </div>
      </div>

      {/* Level & XP Progress Card */}
      <div className="bg-[#78350f]/40 border border-[#b45309]/50 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-100 tracking-wider text-sm sm:text-base uppercase">LEVEL {displayLevel}</span>
            <span className="text-[10px] sm:text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
              +200 🪙 on Level Up
            </span>
          </div>
          <span className="text-sm font-bold text-[#fde68a]">{currentXp} / {maxXp} XP</span>
        </div>
        <div className="w-full bg-[#1c0a02]/60 h-2 sm:h-2.5 rounded-full overflow-hidden border border-[#451a03]">
          <div 
             className="bg-[#16a34a] h-full shadow-[0_0_10px_#16a34a] transition-all duration-500 rounded-full"
             style={{ width: `${(currentXp / maxXp) * 100}%` }} 
           />
        </div>
      </div>

      {/* Steps Circle Hero */}
      <div className="flex justify-center mb-10 sm:mb-12 relative">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          <svg viewBox="0 0 256 256" className="w-full h-full transform -rotate-90 filter drop-shadow-xl">
            <circle 
              cx="128" 
              cy="128" 
              r={circleRadius} 
              stroke="#1c0a02" 
              strokeWidth="16" 
              fill="transparent" 
            />
            <circle 
              cx="128" 
              cy="128" 
              r={circleRadius} 
              stroke="#16a34a" 
              strokeWidth="16" 
              fill="transparent" 
              strokeDasharray={circleCircumference} 
              strokeDashoffset={progressOffset} 
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Footprints className="w-8 h-8 sm:w-10 sm:h-10 text-[#facc15] mb-2 sm:mb-3 opacity-90" />
            <span className="text-5xl sm:text-6xl font-black text-[#fbbf24] tracking-tight drop-shadow-lg">
              {totalStepsToday.toLocaleString()}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#fde68a] mt-2 uppercase tracking-widest opacity-80">Goal: 10,000</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
        <div className="bg-gradient-to-b from-[#78350f] to-[#451a03] border-2 border-[#b45309] border-t-[#d97706]/60 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-[0_8px_16px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#facc15]/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#fde68a]/5 pointer-events-none" />
          <div className="bg-gradient-to-br from-[#b45309] to-[#78350f] p-2.5 sm:p-3 rounded-full border border-[#fde68a]/30 shadow-inner mb-3 group-hover:scale-110 transition-transform relative z-10">
            <Route className="w-5 h-5 sm:w-6 sm:h-6 text-[#facc15] drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" />
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#fde68a] mb-1 font-bold uppercase tracking-widest relative z-10 opacity-90">
            Distance
          </div>
          <div className="font-black text-amber-100 text-xl sm:text-3xl drop-shadow-md flex items-baseline gap-1 relative z-10">
            {distanceKm}
            <span className="text-[10px] sm:text-xs text-[#fde68a]/70 font-bold uppercase">km</span>
          </div>
        </div>
        <div className="bg-gradient-to-b from-[#78350f] to-[#451a03] border-2 border-[#b45309] border-t-[#d97706]/60 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-[0_8px_16px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#facc15]/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#fde68a]/5 pointer-events-none" />
          <div className="bg-gradient-to-br from-[#b45309] to-[#78350f] p-2.5 sm:p-3 rounded-full border border-[#fde68a]/30 shadow-inner mb-3 group-hover:scale-110 transition-transform relative z-10">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#facc15] drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" />
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#fde68a] mb-1 font-bold uppercase tracking-widest relative z-10 opacity-90">
            Calories
          </div>
          <div className="font-black text-amber-100 text-xl sm:text-3xl drop-shadow-md flex items-baseline gap-1 relative z-10">
            {caloriesBurned}
            <span className="text-[10px] sm:text-xs text-[#fde68a]/70 font-bold uppercase">kcal</span>
          </div>
        </div>
        <div className="bg-gradient-to-b from-[#78350f] to-[#451a03] border-2 border-[#b45309] border-t-[#d97706]/60 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-[0_8px_16px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#facc15]/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#fde68a]/5 pointer-events-none" />
          <div className="bg-gradient-to-br from-[#b45309] to-[#78350f] p-2.5 sm:p-3 rounded-full border border-[#fde68a]/30 shadow-inner mb-3 group-hover:scale-110 transition-transform relative z-10">
            <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-[#facc15] drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" />
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#fde68a] mb-1 font-bold uppercase tracking-widest relative z-10 opacity-90">
            Active Time
          </div>
          <div className="font-black text-amber-100 text-xl sm:text-3xl drop-shadow-md flex items-baseline gap-1 relative z-10">
            {activeTimeMin}
            <span className="text-[10px] sm:text-xs text-[#fde68a]/70 font-bold uppercase">min</span>
          </div>
        </div>
      </div>

      {/* TODAY'S BOOTY & SAFETY Card */}
      <div className="bg-[#78350f] border-2 border-[#451a03] rounded-2xl p-5 mb-8 shadow-xl">
        <h2 className="text-sm sm:text-base font-black text-amber-100 uppercase tracking-widest mb-4">TODAY'S BOOTY & SAFETY</h2>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-amber-100/90 font-bold text-xs sm:text-sm tracking-wide">
            <CircleDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#facc15]" />
            Gold Earned Today
          </div>
          <div className="font-black text-[#facc15] text-sm sm:text-base">
            +{goldEarnedToday} Gold
          </div>
        </div>

        <hr className="border-t-2 border-dashed border-[#b45309]/50 my-4" />

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-bold text-amber-100/90 tracking-wide">Today's Shield Goal</span>
          <span className="text-xs sm:text-sm font-bold text-[#fde68a]">{totalStepsToday.toLocaleString()} / 10,000 Steps</span>
        </div>
        <div className="w-full bg-[#1c0a02] h-3 sm:h-4 rounded-full overflow-hidden border border-[#451a03] shadow-inner">
          <div 
            className="bg-[#16a34a] h-full shadow-[0_0_10px_#16a34a] transition-all duration-500"
            style={{ width: `${Math.min(100, (totalStepsToday / stepGoal) * 100)}%` }} 
          />
        </div>
      </div>

      {/* Daily Quests */}
      <div className="mt-auto pb-4">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-black text-[#fde68a] mb-3 sm:mb-4 uppercase tracking-widest">
          <Swords className="w-5 h-5 text-[#facc15]" /> Daily Quests
        </h2>
        
        <div 
          className={`bg-gradient-to-r from-[#78350f] to-[#451a03] border-2 ${isClaimable ? 'border-[#16a34a]' : 'border-[#b45309]'} rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all relative overflow-hidden`}
        >
          {/* Progress Bar (Background) */}
          {!isAllQuestsDone && (
            <div 
              className="absolute left-0 top-0 bottom-0 bg-[#facc15]/10 transition-all duration-500 ease-in-out"
              style={{ width: `${(questProgress / currentQuest.target) * 100}%` }}
            />
          )}
          <div className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent ${isClaimable && !animating ? 'animate-[shimmer_1.5s_infinite]' : ''}`} />
          
          <div className={`flex items-center gap-3 sm:gap-4 relative z-10 transition-all duration-300 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <div className={`bg-gradient-to-br from-[#b45309] to-[#78350f] p-3 sm:p-4 rounded-xl border-2 ${isClaimable ? 'border-[#4ade80]' : 'border-[#facc15]/30'} shadow-inner`}>
              <Compass className={`w-6 h-6 sm:w-7 sm:h-7 ${isClaimable ? 'text-[#4ade80]' : 'text-[#facc15]'} drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]`} />
            </div>
            <div>
              <h3 className="font-black text-amber-100 text-base sm:text-lg tracking-wide">
                {isAllQuestsDone ? 'All Quests Completed!' : currentQuest.title}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/70 mt-0.5 font-medium">
                {isAllQuestsDone ? 'Come back tomorrow for more quests.' : currentQuest.desc}
              </p>
              
              {!isAllQuestsDone && (
                <div className="inline-flex items-center gap-1.5 bg-[#1c0a02]/80 border border-[#b45309] px-2.5 py-1 rounded-md mt-2 shadow-sm">
                  <span className="text-[10px] sm:text-xs font-black text-[#fbbf24] uppercase tracking-wider">Reward:</span>
                  <span className="text-[10px] sm:text-xs font-black text-[#4ade80]">+{currentQuest.xp} XP</span>
                </div>
              )}
            </div>
          </div>
          
          {!isAllQuestsDone && (
            <div 
              onClick={isClaimable ? handleClaimQuest : undefined}
              className={`
                transition-all duration-300 relative z-10 flex items-center justify-center rounded-full border
                ${isClaimable 
                  ? 'bg-[#16a34a] border-[#22c55e] cursor-pointer hover:bg-[#22c55e] hover:scale-105 hover:brightness-110 active:scale-95 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.4)] p-2' 
                  : 'bg-gray-800/80 border-gray-600 opacity-60 cursor-not-allowed px-3 py-1.5 grayscale'
                }
                ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
              `}
            >
              {isClaimable ? (
                <span className="text-[10px] sm:text-xs font-black text-white px-1 sm:px-2 drop-shadow-md">CLAIM</span>
              ) : (
                <span className="text-[10px] sm:text-xs font-black text-gray-300 whitespace-nowrap tracking-wide">
                  {questProgress.toLocaleString()} / {currentQuest.target.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* VIEW SWITCHER TABS: Map View vs Step Charts */}
      <div className="flex items-center justify-center gap-1.5 bg-[#451a03] border-2 sm:border-3 border-[#78350f] rounded-xl p-1 shadow-lg mt-6">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-serif font-black text-[11px] sm:text-xs uppercase italic flex items-center justify-center gap-1.5 transition-all shadow-md ${
            activeTab === 'map'
              ? 'bg-[#b45309] border border-[#facc15] text-white'
              : 'bg-[#78350f] text-[#fde68a] hover:bg-[#92400e]'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-[#facc15]" />
          <span>Footprint Voyage Map</span>
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-serif font-black text-[11px] sm:text-xs uppercase italic flex items-center justify-center gap-1.5 transition-all shadow-md ${
            activeTab === 'chart'
              ? 'bg-[#b45309] border border-[#facc15] text-white'
              : 'bg-[#78350f] text-[#fde68a] hover:bg-[#92400e]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-sky-300" />
          <span>Step Activity</span>
        </button>
      </div>

      {/* MODE 1: FOOTPRINT GPS MAP VIEW */}
      {activeTab === 'map' ? (
        <div className="w-full flex-1 flex flex-col mt-4">
          <StepMapView />
        </div>
      ) : (
        /* MODE 2: STEP CHART VIEW */
        <div className="bg-[#78350f] border-2 sm:border-4 border-[#451a03] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-xl space-y-2 mt-4">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <h2 className="text-[11px] sm:text-sm font-serif font-black uppercase text-[#fde68a] tracking-wider flex items-center gap-1">
              <span>📊</span> Step Activity History
            </h2>
            <div className="flex bg-[#451a03] border border-[#b45309] rounded-md p-0.5">
              {(['day', 'week', 'month'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    chartMode === mode
                      ? 'bg-[#b45309] text-white shadow'
                      : 'text-[#fde68a]/70 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className="h-32 sm:h-44 bg-[#451a03] border border-[#b45309] rounded-lg p-2 flex items-end justify-between gap-1.5 pt-4">
            {activeChart.map((item, idx) => {
              const heightPercent = Math.min(100, Math.max(12, (item.steps / maxChartSteps) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[8px] sm:text-[9px] font-mono text-[#fde68a] mb-0.5 opacity-80 group-hover:opacity-100 font-bold">
                    {item.steps >= 1000 ? `${(item.steps / 1000).toFixed(1)}k` : item.steps}
                  </span>
                  <div className="w-full max-w-[24px] bg-[#1c0a02] rounded-t-md h-full flex items-end overflow-hidden p-0.5 border border-[#78350f]">
                    <div
                      className="w-full bg-[#16a34a] rounded-t-sm transition-all duration-500 shadow-[0_0_8px_#16a34a]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#fde68a] mt-1 font-serif uppercase leading-none">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
