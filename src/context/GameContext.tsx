import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, ServerInfo, BattleResult, RaidLog, StepRecord, StepStats } from '../types';
import { INITIAL_SERVERS } from '../data/mockPlayers';
import { soundFx } from '../utils/audio';

import { PIRATE_AVATARS } from '../assets';

export interface PlayerProfile {
  username: string;
  aboutMe: string;
  avatarUrl: string;
}

interface GameContextType {
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  
  // Profile
  profile: PlayerProfile;
  updateProfile: (newProfile: Partial<PlayerProfile>) => void;
  
  // Ship State
  shipLevel: number; // 1 - 10
  shipCondition: number; // 0 - 100%
  shipMaxHp: number;
  shipCurrentHp: number;
  
  // Equipment
  cannonLevel: number; // 1 - 10
  cannonCount: number; // 1 - 6
  shieldLevel: number; // 0 - 3
  shieldCharges: number;
  
  // Customization
  ownedDecorations: string[];
  equippedDecorations: string[];
  
  // Servers
  currentServer: ServerInfo;
  servers: ServerInfo[];
  switchServer: (serverCode: string) => void;
  createPrivateServer: (serverName: string) => string;
  
  // Steps & Activity
  totalStepsToday: number;
  stepRecords: StepRecord[];
  stepStats: StepStats;
  addSteps: (amount: number) => void;
  isAutoWalking: boolean;
  toggleAutoWalk: () => void;
  
  // Actions
  attackPlayer: (target: Player) => BattleResult | null;
  repairShip: (percentToRepair: number) => boolean;
  rebuildShip: () => boolean;
  upgradeShip: () => boolean;
  upgradeCannon: () => boolean;
  buyCannon: () => boolean;
  upgradeShield: () => boolean;
  buyDecoration: (decId: string, currency: 'coins' | 'gems', price: number) => boolean;
  toggleEquipDecoration: (decId: string) => void;
  watchAdForGems: () => void;
  
  // Logs
  raidLogs: RaidLog[];
  
  // Audio state
  isMuted: boolean;
  toggleMute: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_STEP_RECORDS: StepRecord[] = [
  { date: '2026-08-04', dayOfWeek: 'Mon', steps: 6200 },
  { date: '2026-08-05', dayOfWeek: 'Tue', steps: 8400 },
  { date: '2026-08-06', dayOfWeek: 'Wed', steps: 4900 },
  { date: '2026-08-07', dayOfWeek: 'Thu', steps: 9100 },
  { date: '2026-08-08', dayOfWeek: 'Fri', steps: 7300 },
  { date: '2026-08-09', dayOfWeek: 'Sat', steps: 11200 },
  { date: '2026-08-10', dayOfWeek: 'Sun', steps: 4250 },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<number>(1250);
  const [gems, setGems] = useState<number>(20);
  const [energy, setEnergy] = useState<number>(5);
  const maxEnergy = 5;

  // Profile State
  const [profile, setProfile] = useState<PlayerProfile>({
    username: 'Captain Blackbeard',
    aboutMe: 'Sailing the Seven Seas in search of legendary step treasures and gold!',
    avatarUrl: PIRATE_AVATARS[0]?.url || '',
  });

  const updateProfile = (newProfile: Partial<PlayerProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
    soundFx.playUpgrade();
  };

  // Player Ship Specs
  const [shipLevel, setShipLevel] = useState<number>(1);
  const [shipCondition, setShipCondition] = useState<number>(95);
  
  // Equipment
  const [cannonLevel, setCannonLevel] = useState<number>(1);
  const [cannonCount, setCannonCount] = useState<number>(1);
  const [shieldLevel, setShieldLevel] = useState<number>(0);
  const [shieldCharges, setShieldCharges] = useState<number>(0);

  // Customization
  const [ownedDecorations, setOwnedDecorations] = useState<string[]>(['dec_jolly_roger']);
  const [equippedDecorations, setEquippedDecorations] = useState<string[]>(['dec_jolly_roger']);

  // Servers
  const [servers, setServers] = useState<ServerInfo[]>(INITIAL_SERVERS);
  const [currentServer, setCurrentServer] = useState<ServerInfo>(INITIAL_SERVERS[0]);

  // Steps
  const [totalStepsToday, setTotalStepsToday] = useState<number>(4250);
  const [stepRecords, setStepRecords] = useState<StepRecord[]>(INITIAL_STEP_RECORDS);
  const [isAutoWalking, setIsAutoWalking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Logs
  const [raidLogs, setRaidLogs] = useState<RaidLog[]>([
    {
      id: 'log_1',
      timestamp: '10 mins ago',
      type: 'attack',
      opponentName: 'Calico Jack',
      outcome: 'victory',
      coinsChange: 100,
      damage: 5000,
      cannonLostOrWon: 'Looted Cannon Lv1!',
    },
    {
      id: 'log_2',
      timestamp: '1 hour ago',
      type: 'defense',
      opponentName: 'Redbeard Drake',
      outcome: 'defended',
      coinsChange: 0,
      damage: 2500,
    }
  ]);

  // Derived ship HP
  const shipMaxHp = 5000 + (shipLevel - 1) * 5000;
  const shipCurrentHp = Math.round(shipMaxHp * (shipCondition / 100));

  // Add Steps & Reward logic (100 steps = 10 coins)
  const addSteps = (amount: number) => {
    setTotalStepsToday(prev => {
      const updated = prev + amount;
      const coinsEarned = Math.floor(amount / 100) * 10;
      if (coinsEarned > 0) {
        setCoins(c => c + coinsEarned);
        soundFx.playCoin();
      }
      return updated;
    });

    // update today's record in chart
    setStepRecords(prev => {
      const next = [...prev];
      const todayIndex = next.length - 1;
      if (todayIndex >= 0) {
        next[todayIndex] = { ...next[todayIndex], steps: next[todayIndex].steps + amount };
      }
      return next;
    });
  };

  // Auto walk simulator timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoWalking) {
      interval = setInterval(() => {
        addSteps(15);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoWalking]);

  // Step statistics
  const weeklyTotal = stepRecords.reduce((acc, r) => acc + r.steps, 0);
  const stepStats: StepStats = {
    dailyAverage: Math.round(weeklyTotal / stepRecords.length),
    weeklyAverage: Math.round(weeklyTotal),
    monthlyAverage: Math.round((weeklyTotal / 7) * 30),
    totalStepsToday,
    stepsToNextReward: 100 - (totalStepsToday % 100),
  };

  const toggleAutoWalk = () => {
    setIsAutoWalking(prev => !prev);
    soundFx.playClick();
  };

  const toggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Switch server
  const switchServer = (serverCode: string) => {
    const target = servers.find(s => s.code === serverCode);
    if (target) {
      setCurrentServer(target);
      soundFx.playClick();
    }
  };

  // Create private beach server
  const createPrivateServer = (serverName: string): string => {
    if (gems < 10) {
      alert('Not enough gems! Creating a Private Beach costs 10 gems.');
      return '';
    }
    setGems(g => g - 10);
    const newCode = `PRIV-${Math.floor(100 + Math.random() * 900)}`;
    const newServer: ServerInfo = {
      code: newCode,
      type: 'private',
      name: serverName || 'My Private Island Cove',
      playerCount: 1,
      maxPlayers: 20,
      players: INITIAL_SERVERS[1].players.slice(0, 10),
    };
    setServers(prev => [...prev, newServer]);
    setCurrentServer(newServer);
    soundFx.playVictory();
    return newCode;
  };

  // BOMB / Attack Player logic
  const attackPlayer = (target: Player): BattleResult | null => {
    if (energy < 1) {
      alert('Not enough Energy! You need 1 Energy to launch a Bomb raid. Energy refills daily!');
      return null;
    }
    if (shipCondition <= 50) {
      alert('Ship condition is too low (<= 50%)! Repair your ship before entering battle.');
      return null;
    }

    setEnergy(e => e - 1);
    soundFx.playCannonBomb();

    // Damage calculation: base 2500 * level * count * condition factor
    const baseDamage = (2500 + (cannonLevel - 1) * 2500) * cannonCount;
    const actualDamage = Math.round(baseDamage * (shipCondition / 100));

    // Target HP logic
    const enemyRemainingHp = Math.max(0, target.currentHp - actualDamage);
    const enemyHpPercent = Math.round((enemyRemainingHp / target.maxHp) * 100);

    // Damage percentage relative to target's existing HP before attack
    const hpReduced = target.currentHp - enemyRemainingHp;
    const hpRatioReduced = target.currentHp > 0 ? (hpReduced / target.currentHp) : 1;

    let coinsEarned = 0;
    if (hpRatioReduced >= 1) {
      coinsEarned = 150; // 100% of existing HP destroyed
    } else if (hpRatioReduced >= 0.5) {
      coinsEarned = 100; // 50% of existing HP
    } else if (hpRatioReduced >= 0.3) {
      coinsEarned = 50;  // 30% of existing HP
    } else {
      coinsEarned = 25;  // minor hit
    }

    // 1% chance for gems drop
    const dropGemChance = Math.random();
    const gemsEarned = dropGemChance <= 0.05 ? 1 : 0; // boosted slightly to 5% for fun demo feel!

    // Cannon Looting logic: if enemy ship HP drops below 30%, chance to loot their cannon
    let cannonLooted = false;
    let lootedCannonLevel = target.cannonLevel;
    if (enemyHpPercent < 30 && target.cannonCount > 0) {
      const lootChance = Math.random();
      if (lootChance <= 0.6) {
        cannonLooted = true;
        setCannonCount(c => Math.min(6, c + 1));
      }
    }

    setCoins(c => c + coinsEarned);
    if (gemsEarned > 0) setGems(g => g + gemsEarned);

    // Log the raid
    const newLog: RaidLog = {
      id: `log_${Date.now()}`,
      timestamp: 'Just now',
      type: 'attack',
      opponentName: target.name,
      outcome: 'victory',
      coinsChange: coinsEarned,
      damage: actualDamage,
      cannonLostOrWon: cannonLooted ? `Looted Lv${lootedCannonLevel} Cannon!` : undefined,
    };
    setRaidLogs(prev => [newLog, ...prev]);

    return {
      targetPlayer: target,
      damageDealt: actualDamage,
      enemyRemainingHpPercent: enemyHpPercent,
      coinsEarned,
      gemsEarned,
      cannonLooted,
      lootedCannonLevel,
      shieldBlocked: false,
    };
  };

  // Repair ship (5 coins per 5% condition)
  const repairShip = (percentToRepair: number): boolean => {
    if (shipCondition === 0) {
      alert('Ship condition is at 0%! You must REBUILD the ship first.');
      return false;
    }
    const cost = Math.ceil(percentToRepair / 5) * 5;
    if (coins < cost) {
      alert(`Not enough coins! Repairing costs ${cost} coins.`);
      return false;
    }

    setCoins(c => c - cost);
    setShipCondition(prev => Math.min(100, prev + percentToRepair));
    soundFx.playUpgrade();
    return true;
  };

  // Rebuild ship from 0% to 5% (costs 50 coins)
  const rebuildShip = (): boolean => {
    if (shipCondition > 0) {
      alert('Ship is not destroyed (condition > 0%). Use Repair instead!');
      return false;
    }
    if (coins < 50) {
      alert('Not enough coins! Rebuilding requires 50 coins.');
      return false;
    }

    setCoins(c => c - 50);
    setShipCondition(5);
    soundFx.playUpgrade();
    return true;
  };

  // Upgrade Ship: Lv1->2 costs 1000, Lv2->3 costs 1500, Lv3->4 costs 2000... (+500 coins per level)
  const upgradeShip = (): boolean => {
    if (shipLevel >= 10) {
      alert('Ship is already at max level (10)!');
      return false;
    }
    const cost = shipLevel === 1 ? 1000 : 1000 + (shipLevel - 1) * 500;
    if (coins < cost) {
      alert(`Not enough coins! Ship upgrade costs ${cost} coins.`);
      return false;
    }

    setCoins(c => c - cost);
    setShipLevel(l => l + 1);
    soundFx.playUpgrade();
    return true;
  };

  // Buy or Upgrade Cannons: 100 coins to buy/upgrade
  const buyCannon = (): boolean => {
    if (cannonCount >= 6) {
      alert('Maximum cannons equipped (6)! Upgrade your cannon level instead.');
      return false;
    }
    if (coins < 100) {
      alert('Not enough coins! Cannons cost 100 coins.');
      return false;
    }

    setCoins(c => c - 100);
    setCannonCount(c => c + 1);
    soundFx.playUpgrade();
    return true;
  };

  const upgradeCannon = (): boolean => {
    if (cannonLevel >= 10) {
      alert('Cannons are at maximum level (10)!');
      return false;
    }
    if (coins < 100) {
      alert('Not enough coins! Cannon upgrade costs 100 coins.');
      return false;
    }

    setCoins(c => c - 100);
    setCannonLevel(l => l + 1);
    soundFx.playUpgrade();
    return true;
  };

  // Shield: Lv 1-3, 100 coins to buy/upgrade
  const upgradeShield = (): boolean => {
    if (shieldLevel >= 3) {
      alert('Shield is at max level (3)!');
      return false;
    }
    if (coins < 100) {
      alert('Not enough coins! Shield costs 100 coins.');
      return false;
    }

    setCoins(c => c - 100);
    setShieldLevel(l => l + 1);
    setShieldCharges(l => l + 1);
    soundFx.playUpgrade();
    return true;
  };

  // Shop Decor Purchase
  const buyDecoration = (decId: string, currency: 'coins' | 'gems', price: number): boolean => {
    if (ownedDecorations.includes(decId)) {
      alert('You already own this decoration!');
      return false;
    }
    if (currency === 'coins') {
      if (coins < price) {
        alert(`Not enough coins! Required: ${price}`);
        return false;
      }
      setCoins(c => c - price);
    } else {
      if (gems < price) {
        alert(`Not enough gems! Required: ${price}`);
        return false;
      }
      setGems(g => g - price);
    }

    setOwnedDecorations(prev => [...prev, decId]);
    setEquippedDecorations(prev => [...prev, decId]);
    soundFx.playVictory();
    return true;
  };

  const toggleEquipDecoration = (decId: string) => {
    if (equippedDecorations.includes(decId)) {
      setEquippedDecorations(prev => prev.filter(id => id !== decId));
    } else {
      setEquippedDecorations(prev => [...prev, decId]);
    }
    soundFx.playClick();
  };

  // Watch Ad for Gems (+5 gems)
  const watchAdForGems = () => {
    setGems(g => g + 5);
    soundFx.playVictory();
  };

  return (
    <GameContext.Provider
      value={{
        coins,
        gems,
        energy,
        maxEnergy,
        profile,
        updateProfile,
        shipLevel,
        shipCondition,
        shipMaxHp,
        shipCurrentHp,
        cannonLevel,
        cannonCount,
        shieldLevel,
        shieldCharges,
        ownedDecorations,
        equippedDecorations,
        currentServer,
        servers,
        switchServer,
        createPrivateServer,
        totalStepsToday,
        stepRecords,
        stepStats,
        addSteps,
        isAutoWalking,
        toggleAutoWalk,
        attackPlayer,
        repairShip,
        rebuildShip,
        upgradeShip,
        upgradeCannon,
        buyCannon,
        upgradeShield,
        buyDecoration,
        toggleEquipDecoration,
        watchAdForGems,
        raidLogs,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
