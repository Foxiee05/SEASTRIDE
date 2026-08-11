import islandBeachBg from './assets/images/ref_style_ship_bg_1786462920050.jpg';
import fullscreenTopdownSea from './assets/images/fullscreen_topdown_sea_1786367444636.jpg';
import pirateIconsPattern from './assets/images/pirate_icons_pattern_1786366557513.jpg';
import pirateShipLv1 from './assets/images/pirate_ship_lv1_1786362586510.jpg';
import pirateShipLv5 from './assets/images/pirate_ship_lv5_1786362597288.jpg';
import pirateShipLv10 from './assets/images/pirate_ship_lv10_1786362609547.jpg';
import pirateCannonLv1 from './assets/images/pirate_cannon_lv1_1786362622827.jpg';
import pirateCannonLv5 from './assets/images/pirate_cannon_lv5_1786362665481.jpg';
import pirateShieldLv1 from './assets/images/pirate_shield_lv1_1786362638776.jpg';
import pirateShieldLv3 from './assets/images/pirate_shield_lv3_1786362675977.jpg';
import pirateBombBtn from './assets/images/pirate_bomb_btn_1786362650907.jpg';

import pirateAvatarCaptain from './assets/images/pirate_avatar_captain_1786369408051.jpg';
import pirateAvatarParrot from './assets/images/pirate_avatar_parrot_1786369428313.jpg';
import pirateAvatarFirstmate from './assets/images/pirate_avatar_firstmate_1786369444789.jpg';
import pirateAvatarMonkey from './assets/images/pirate_avatar_monkey_1786369459159.jpg';
import pirateAvatarLady from './assets/images/pirate_avatar_lady_1786369475175.jpg';

import { preloadCutouts } from './utils/imageUtils';

export const PIRATE_AVATARS = [
  { id: 'captain', name: 'Captain Jack', url: pirateAvatarCaptain },
  { id: 'parrot', name: 'Polly Parrot', url: pirateAvatarParrot },
  { id: 'firstmate', name: 'Matey Pete', url: pirateAvatarFirstmate },
  { id: 'monkey', name: 'Cap\'n Chimpy', url: pirateAvatarMonkey },
  { id: 'lady', name: 'Anne Bonny', url: pirateAvatarLady },
];

export const ASSETS = {
  beachBg: islandBeachBg,
  topdownOcean: fullscreenTopdownSea,
  piratePatternBg: pirateIconsPattern,
  ships: {
    lv1: pirateShipLv1,
    lv5: pirateShipLv5,
    lv10: pirateShipLv10,
  },
  cannons: {
    lv1: pirateCannonLv1,
    lv5: pirateCannonLv5,
  },
  shields: {
    lv1: pirateShieldLv1,
    lv3: pirateShieldLv3,
  },
  bombBtn: pirateBombBtn,
};

// Immediately pre-warm ship, cannon, and shield cutouts so "The Sea" opens with zero lag
preloadCutouts([
  pirateShipLv1,
  pirateShipLv5,
  pirateShipLv10,
  pirateCannonLv1,
  pirateCannonLv5,
  pirateShieldLv1,
  pirateShieldLv3,
]);


export function getShipImageForLevel(level: number): string {
  if (level <= 3) return ASSETS.ships.lv1;
  if (level <= 7) return ASSETS.ships.lv5;
  return ASSETS.ships.lv10;
}

export function getCannonImageForLevel(level: number): string {
  if (level <= 4) return ASSETS.cannons.lv1;
  return ASSETS.cannons.lv5;
}

export function getShieldImageForLevel(level: number): string {
  if (level <= 1) return ASSETS.shields.lv1;
  return ASSETS.shields.lv3;
}
