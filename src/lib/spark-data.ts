/* ================================================================== */
/*  SPARK — Core Data, Types, Constants                                */
/*  "Don't let the world blow out your spark."                         */
/* ================================================================== */

/* ---- Child Profile (localStorage) ---- */
export interface SparkProfile {
  name: string;
  age: number;
  condition: string;
  avatarConfig: AvatarConfig;
  companion: { name: string; type: string };
  badges: string[];
  stories: StorybookData[];
  oathTaken: boolean;
  createdAt: string;
  parentPin?: string;
  // Engagement fields
  sparkCoins: number;
  xp: number;
  level: number;
  loginStreak: number;
  lastLoginDate: string; // YYYY-MM-DD
  collectedSparkles: string[];
  exploredLands: string[];
  unlockedCosmetics: string[];
  landCollectibles: Record<string, string[]>; // landId -> collected item ids
  nextStoryUnlockDate?: string; // ISO date
}

export interface AvatarConfig {
  bodyType: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  hasGlasses: boolean;
  powerTool: string;
  capeColor: string;
  companionType: string;
  capePattern?: string;
  companionAccessory?: string;
  powerToolSkin?: string;
  landscapeDecoration?: string;
}

/* ---- Storybook Types ---- */
export interface StoryIllustration {
  description: string;
  mood: string;
  colors: string[];
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  illustration: StoryIllustration;
}

export interface GeneratedStory {
  title: string;
  dedication: string;
  pages: StoryPage[];
  aboutTheCondition: {
    forKids: string;
    forParents: string;
  };
}

export interface StorybookData {
  story: GeneratedStory;
  childName: string;
  childAge: number;
  condition: string;
  volume: number;
  createdAt: string;
}

/* ---- Badge Types ---- */
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'courage' | 'story' | 'game' | 'kindness' | 'milestone';
  emoji: string;
}

export const ALL_BADGES: Badge[] = [
  // Courage
  { id: 'the-spark', name: 'The Spark', description: 'For showing up. That\'s the bravest thing of all.', category: 'courage', emoji: '✨' },
  { id: 'dragon-tamer', name: 'Dragon Tamer', description: 'Used my treatment without being asked.', category: 'courage', emoji: '🐉' },
  { id: 'shot-superstar', name: 'Shot Superstar', description: 'Got through a blood test or shot. Crying is allowed — being brave doesn\'t mean not being scared.', category: 'courage', emoji: '💉' },
  { id: 'hospital-hero', name: 'Hospital Hero', description: 'Stayed brave during a hospital visit.', category: 'courage', emoji: '🏥' },
  { id: 'first-day-back', name: 'First Day Back', description: 'Returned to school after time away.', category: 'courage', emoji: '🎒' },
  { id: 'tell-my-story', name: 'Tell My Story', description: 'Told a friend about my condition.', category: 'courage', emoji: '💬' },
  { id: 'helper-heart', name: 'Helper Heart', description: 'Helped another kid who was scared.', category: 'courage', emoji: '💗' },
  // Story
  { id: 'storyteller', name: 'Storyteller', description: 'Read your first personalized story.', category: 'story', emoji: '📖' },
  { id: 'library-builder', name: 'Library Builder', description: 'Created 3 stories.', category: 'story', emoji: '📚' },
  { id: 'epic-collection', name: 'Epic Collection', description: 'Created 5 stories.', category: 'story', emoji: '🏆' },
  // Game
  { id: 'first-game', name: 'Game Explorer', description: 'Played your first Spark Game.', category: 'game', emoji: '🎮' },
  { id: 'game-master', name: 'Game Master', description: 'Earned a star in every game.', category: 'game', emoji: '⭐' },
  // Kindness
  { id: 'letter-writer', name: 'Brave Letter Writer', description: 'Sent a message to another brave kid.', category: 'kindness', emoji: '✉️' },
  { id: 'welcome-committee', name: 'Welcome Committee', description: 'Wrote a letter to a kid who just joined.', category: 'kindness', emoji: '👋' },
  // Milestone
  { id: 'one-week', name: 'One Week Brave', description: 'Active for one week.', category: 'milestone', emoji: '📅' },
  { id: 'one-month', name: 'One Month Mighty', description: 'Active for one month.', category: 'milestone', emoji: '🗓️' },
  // Engagement badges
  { id: 'weekly-hero', name: 'Weekly Hero', description: 'Logged in 7 days in a row!', category: 'milestone', emoji: '🔥' },
  { id: 'unstoppable', name: 'Unstoppable', description: '30 days in a row. You are a force of nature.', category: 'milestone', emoji: '💫' },
  { id: 'sparkle-hunter', name: 'Sparkle Hunter', description: 'Found EVERY hidden sparkle in SPARK!', category: 'milestone', emoji: '🌟' },
  { id: 'land-master-dragons-breath', name: "Dragon's Breath Master", description: "Found all sparkles in Dragon's Breath Valley!", category: 'game', emoji: '🐉' },
  { id: 'land-master-sugar-crystals', name: 'Crystal Cave Master', description: 'Found all sparkles in Sugar Crystal Caves!', category: 'game', emoji: '💎' },
  { id: 'land-master-thunder-wheels', name: 'Speedway Master', description: 'Found all sparkles in Thunder Wheel Speedway!', category: 'game', emoji: '⚡' },
  { id: 'land-master-quiet-forest', name: 'Forest Master', description: 'Found all sparkles in The Quiet Forest!', category: 'game', emoji: '🌿' },
  { id: 'volume-5', name: 'Origin Story', description: 'Read 5 story volumes — your epic saga!', category: 'story', emoji: '📕' },
  { id: 'volume-10', name: "Hero's Return", description: '10 story volumes — a true legend!', category: 'story', emoji: '📗' },
];

/* ---- Hero Level System ---- */
export interface HeroLevel {
  level: number;
  xpRequired: number;
  title: string;
  unlock?: string;
}

export const HERO_LEVELS: HeroLevel[] = [
  { level: 1, xpRequired: 0, title: 'New Hero' },
  { level: 2, xpRequired: 100, title: 'Brave Beginner' },
  { level: 3, xpRequired: 250, title: 'Spark Seeker' },
  { level: 4, xpRequired: 500, title: 'Adventure Starter' },
  { level: 5, xpRequired: 800, title: 'Brave Explorer', unlock: 'Gold cape border' },
  { level: 6, xpRequired: 1200, title: 'Story Keeper' },
  { level: 7, xpRequired: 1700, title: 'Dragon Friend' },
  { level: 8, xpRequired: 2300, title: 'World Walker' },
  { level: 9, xpRequired: 3000, title: 'Badge Master' },
  { level: 10, xpRequired: 4000, title: 'SPARK Champion', unlock: 'Crown accessory' },
  { level: 11, xpRequired: 5000, title: 'Elite Hero I' },
  { level: 12, xpRequired: 6000, title: 'Elite Hero II' },
  { level: 13, xpRequired: 7200, title: 'Elite Hero III' },
  { level: 14, xpRequired: 8500, title: 'Elite Hero IV' },
  { level: 15, xpRequired: 10000, title: 'Elite Hero V' },
  { level: 16, xpRequired: 12000, title: 'Legendary Hero I' },
  { level: 17, xpRequired: 14500, title: 'Legendary Hero II' },
  { level: 18, xpRequired: 17000, title: 'Legendary Hero III' },
  { level: 19, xpRequired: 20000, title: 'Legendary Hero IV' },
  { level: 20, xpRequired: 25000, title: 'SPARK Legend', unlock: 'Rainbow particle trail' },
];

export function getLevelForXP(xp: number): HeroLevel {
  for (let i = HERO_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= HERO_LEVELS[i].xpRequired) return HERO_LEVELS[i];
  }
  return HERO_LEVELS[0];
}

export function getNextLevel(currentLevel: number): HeroLevel | null {
  const idx = HERO_LEVELS.findIndex(l => l.level === currentLevel);
  if (idx < 0 || idx >= HERO_LEVELS.length - 1) return null;
  return HERO_LEVELS[idx + 1];
}

export function getXPProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevelForXP(xp);
  const next = getNextLevel(level.level);
  if (!next) return { current: xp, needed: xp, percent: 100 };
  const currentInLevel = xp - level.xpRequired;
  const needed = next.xpRequired - level.xpRequired;
  return { current: currentInLevel, needed, percent: Math.min(100, (currentInLevel / needed) * 100) };
}

/* ---- XP Awards ---- */
export const XP_AWARDS = {
  OATH: 100,
  READ_STORY: 50,
  COMPLETE_GAME: 25,
  EARN_BADGE: 75,
  WRITE_LETTER: 30,
  DAILY_LOGIN: 10,
  EXPLORE_LAND: 20,
  COLLECT_SPARKLE: 5,
} as const;

/* ---- Daily Rewards ---- */
export interface DailyReward {
  day: number; // 1-7
  type: 'coins' | 'fact' | 'joke' | 'message';
  amount?: number; // for coins
  description: string;
  emoji: string;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, type: 'coins', amount: 5, description: '5 Spark Coins', emoji: '🪙' },
  { day: 2, type: 'fact', description: 'A new fun fact unlocked!', emoji: '🧠' },
  { day: 3, type: 'coins', amount: 10, description: '10 Spark Coins', emoji: '🪙' },
  { day: 4, type: 'joke', description: 'A new joke unlocked!', emoji: '😄' },
  { day: 5, type: 'coins', amount: 15, description: '15 Spark Coins', emoji: '🪙' },
  { day: 6, type: 'message', description: 'A special Ember message!', emoji: '🦊' },
  { day: 7, type: 'coins', amount: 25, description: '25 Spark Coins + Weekly Hero badge!', emoji: '🏆' },
];

export const SPECIAL_EMBER_MESSAGES = [
  "I've been watching you grow, {name}. Every single day you show up, you prove something — that bravery isn't something you find. It's something you ARE.",
  "Hey {name}, did you know foxes remember the people who are kind to them? I'll never forget you. Keep shining.",
  "{name}, some days are harder than others. But you know what? You've never once given up. That makes you my hero.",
  "I asked every creature in the Brave World who the bravest kid is. They ALL said your name, {name}.",
  "You want to know a secret, {name}? The Spark inside you? It's getting brighter every day. I can feel it from here.",
];

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDailyReward(streak: number): DailyReward {
  const dayInCycle = ((streak - 1) % 7) + 1;
  const reward = DAILY_REWARDS.find(r => r.day === dayInCycle) || DAILY_REWARDS[0];
  // Double rewards after 7 consecutive days
  if (streak > 7 && reward.type === 'coins' && reward.amount) {
    return { ...reward, amount: reward.amount * 2, description: `${reward.amount * 2} Spark Coins (doubled!)` };
  }
  return reward;
}

/* ---- Spark Shop ---- */
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'cape' | 'companion' | 'decoration' | 'tool';
  emoji: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Cape patterns
  { id: 'cape-starfield', name: 'Starfield Cape', description: 'A cape covered in twinkling stars', cost: 50, category: 'cape', emoji: '🌌' },
  { id: 'cape-flames', name: 'Flame Cape', description: 'A cape with dancing flames', cost: 50, category: 'cape', emoji: '🔥' },
  { id: 'cape-hearts', name: 'Heart Cape', description: 'A cape covered in hearts', cost: 50, category: 'cape', emoji: '💕' },
  { id: 'cape-rainbow', name: 'Rainbow Cape', description: 'A cape with all the colors', cost: 50, category: 'cape', emoji: '🌈' },
  // Companion accessories
  { id: 'comp-hat', name: 'Tiny Hat', description: 'A tiny hat for your companion', cost: 30, category: 'companion', emoji: '🎩' },
  { id: 'comp-cape', name: 'Tiny Cape', description: 'A tiny cape for your companion', cost: 30, category: 'companion', emoji: '🦸' },
  { id: 'comp-bow', name: 'Tiny Bow', description: 'A cute bow for your companion', cost: 30, category: 'companion', emoji: '🎀' },
  // Landscape decorations
  { id: 'deco-rainbow', name: 'Home Rainbow', description: 'A rainbow over your home landscape', cost: 40, category: 'decoration', emoji: '🌈' },
  { id: 'deco-flowers', name: 'Extra Flowers', description: 'More flowers in your landscape', cost: 40, category: 'decoration', emoji: '🌸' },
  { id: 'deco-treehouse', name: 'Treehouse Flag', description: 'A tiny treehouse in your landscape', cost: 40, category: 'decoration', emoji: '🏴' },
  // Power tool skins
  { id: 'tool-galaxy', name: 'Galaxy Inhaler', description: 'A cosmic inhaler skin', cost: 75, category: 'tool', emoji: '🌌' },
  { id: 'tool-crystal', name: 'Crystal Pump', description: 'A crystal insulin pump skin', cost: 75, category: 'tool', emoji: '💎' },
  { id: 'tool-neon', name: 'Neon Hearing Aids', description: 'Glowing neon hearing aids', cost: 75, category: 'tool', emoji: '🟢' },
];

/* ---- Sparkle Collectibles ---- */
export interface SparkleLocation {
  id: string;
  landId: string;
  x: number;
  y: number;
  hint: string;
  requiresAction?: string; // e.g. "play-breathing" — sparkle only visible after this
}

export const SPARKLE_LOCATIONS: SparkleLocation[] = [
  // Dragon's Breath Valley (5)
  { id: 'dragon-1', landId: 'dragons-breath', x: 200, y: 100, hint: 'Behind the first mountain' },
  { id: 'dragon-2', landId: 'dragons-breath', x: 800, y: 600, hint: 'Near a flower on the ground' },
  { id: 'dragon-3', landId: 'dragons-breath', x: 1600, y: 50, hint: 'Floating high up' },
  { id: 'dragon-4', landId: 'dragons-breath', x: 2400, y: 650, hint: 'Inside the Dragon\'s Den', requiresAction: 'play-breathing' },
  { id: 'dragon-5', landId: 'dragons-breath', x: 3600, y: 200, hint: 'At the far overlook' },
  // Sugar Crystal Caves (5)
  { id: 'crystal-1', landId: 'sugar-crystals', x: 300, y: 150, hint: 'Behind a crystal' },
  { id: 'crystal-2', landId: 'sugar-crystals', x: 900, y: 500, hint: 'Deep in the cave' },
  { id: 'crystal-3', landId: 'sugar-crystals', x: 1500, y: 80, hint: 'Near the ceiling' },
  { id: 'crystal-4', landId: 'sugar-crystals', x: 2200, y: 600, hint: 'By the underground river', requiresAction: 'play-crystal' },
  { id: 'crystal-5', landId: 'sugar-crystals', x: 3200, y: 300, hint: 'At the crystal throne' },
  // Thunder Wheel Speedway (5)
  { id: 'thunder-1', landId: 'thunder-wheels', x: 250, y: 200, hint: 'At the starting line' },
  { id: 'thunder-2', landId: 'thunder-wheels', x: 1000, y: 400, hint: 'Behind the ramp' },
  { id: 'thunder-3', landId: 'thunder-wheels', x: 1800, y: 100, hint: 'Above the jump' },
  { id: 'thunder-4', landId: 'thunder-wheels', x: 2600, y: 550, hint: 'In the pit stop' },
  { id: 'thunder-5', landId: 'thunder-wheels', x: 3400, y: 250, hint: 'At the finish line' },
  // Quiet Forest (5)
  { id: 'forest-1', landId: 'quiet-forest', x: 350, y: 300, hint: 'Behind the first tree' },
  { id: 'forest-2', landId: 'quiet-forest', x: 1100, y: 450, hint: 'In the mushroom ring' },
  { id: 'forest-3', landId: 'quiet-forest', x: 1700, y: 120, hint: 'In the canopy' },
  { id: 'forest-4', landId: 'quiet-forest', x: 2500, y: 600, hint: 'By the stream' },
  { id: 'forest-5', landId: 'quiet-forest', x: 3300, y: 200, hint: 'At the ancient tree' },
  // Echo Chamber (5)
  { id: 'echo-1', landId: 'echo-chamber', x: 280, y: 250, hint: 'Near the entrance bell' },
  { id: 'echo-2', landId: 'echo-chamber', x: 950, y: 380, hint: 'Behind a sound wave' },
  { id: 'echo-3', landId: 'echo-chamber', x: 1650, y: 90, hint: 'At the top of the dome' },
  { id: 'echo-4', landId: 'echo-chamber', x: 2350, y: 520, hint: 'In the quiet corner' },
  { id: 'echo-5', landId: 'echo-chamber', x: 3100, y: 180, hint: 'At the crystal resonator' },
  // Spark Tower (5)
  { id: 'spark-1', landId: 'spark-tower', x: 320, y: 200, hint: 'At the tower base' },
  { id: 'spark-2', landId: 'spark-tower', x: 1050, y: 350, hint: 'Behind an electric arc' },
  { id: 'spark-3', landId: 'spark-tower', x: 1750, y: 60, hint: 'Near the top of the tower' },
  { id: 'spark-4', landId: 'spark-tower', x: 2450, y: 500, hint: 'In the generator room' },
  { id: 'spark-5', landId: 'spark-tower', x: 3250, y: 220, hint: 'At the observation deck' },
  // Kaleidoscope (5)
  { id: 'kaleid-1', landId: 'kaleidoscope', x: 400, y: 180, hint: 'In the first color zone' },
  { id: 'kaleid-2', landId: 'kaleidoscope', x: 1200, y: 420, hint: 'Behind a prism' },
  { id: 'kaleid-3', landId: 'kaleidoscope', x: 1850, y: 100, hint: 'In the rainbow arch' },
  { id: 'kaleid-4', landId: 'kaleidoscope', x: 2600, y: 580, hint: 'At the focus point' },
  { id: 'kaleid-5', landId: 'kaleidoscope', x: 3500, y: 280, hint: 'At the final pattern' },
  // Giant's Garden (5)
  { id: 'giant-1', landId: 'giants-garden', x: 300, y: 220, hint: 'Under a giant leaf' },
  { id: 'giant-2', landId: 'giants-garden', x: 1000, y: 500, hint: 'Inside a flower' },
  { id: 'giant-3', landId: 'giants-garden', x: 1600, y: 80, hint: 'On a tall sunflower' },
  { id: 'giant-4', landId: 'giants-garden', x: 2300, y: 620, hint: 'Near the garden gnome' },
  { id: 'giant-5', landId: 'giants-garden', x: 3200, y: 300, hint: 'At the garden gate' },
  // Shield Fortress (5)
  { id: 'shield-1', landId: 'shield-fortress', x: 350, y: 180, hint: 'At the drawbridge' },
  { id: 'shield-2', landId: 'shield-fortress', x: 1100, y: 400, hint: 'In the armory' },
  { id: 'shield-3', landId: 'shield-fortress', x: 1800, y: 70, hint: 'On the battlement' },
  { id: 'shield-4', landId: 'shield-fortress', x: 2500, y: 550, hint: 'In the courtyard' },
  { id: 'shield-5', landId: 'shield-fortress', x: 3400, y: 250, hint: 'At the watchtower' },
  // Brave Heart Castle (5)
  { id: 'heart-1', landId: 'brave-heart', x: 280, y: 200, hint: 'Near the castle gate' },
  { id: 'heart-2', landId: 'brave-heart', x: 1000, y: 450, hint: 'In the throne room' },
  { id: 'heart-3', landId: 'brave-heart', x: 1700, y: 90, hint: 'On the highest tower' },
  { id: 'heart-4', landId: 'brave-heart', x: 2400, y: 600, hint: 'In the garden maze' },
  { id: 'heart-5', landId: 'brave-heart', x: 3300, y: 200, hint: 'At the sunset balcony' },
  // Thought Weaver's Loom (5)
  { id: 'weaver-1', landId: 'thought-weaver', x: 320, y: 250, hint: 'Near the first thread' },
  { id: 'weaver-2', landId: 'thought-weaver', x: 1050, y: 380, hint: 'Behind a tapestry' },
  { id: 'weaver-3', landId: 'thought-weaver', x: 1750, y: 100, hint: 'At the loom top' },
  { id: 'weaver-4', landId: 'thought-weaver', x: 2450, y: 520, hint: 'In the calm corner' },
  { id: 'weaver-5', landId: 'thought-weaver', x: 3250, y: 180, hint: 'At the finished tapestry' },
  // Star Lungs Station (5)
  { id: 'star-1', landId: 'star-lungs', x: 350, y: 200, hint: 'At the airlock' },
  { id: 'star-2', landId: 'star-lungs', x: 1100, y: 350, hint: 'In the observation bay' },
  { id: 'star-3', landId: 'star-lungs', x: 1800, y: 60, hint: 'Floating in zero-G' },
  { id: 'star-4', landId: 'star-lungs', x: 2500, y: 500, hint: 'In the engine room' },
  { id: 'star-5', landId: 'star-lungs', x: 3300, y: 220, hint: 'At the star window' },
];

export function getSparklesForLand(landId: string): SparkleLocation[] {
  return SPARKLE_LOCATIONS.filter(s => s.landId === landId);
}

export function getLandCompletionPercent(landId: string, collected: string[]): number {
  const total = SPARKLE_LOCATIONS.filter(s => s.landId === landId).length;
  if (total === 0) return 0;
  const found = SPARKLE_LOCATIONS.filter(s => s.landId === landId && collected.includes(s.id)).length;
  return Math.round((found / total) * 100);
}

/* ---- Seasonal Events ---- */
export interface SeasonalEvent {
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  particleColor: string;
  emberAccessory: string;
  specialBadgeId?: string;
  xpMultiplier: number;
  description: string;
}

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  { name: 'Winter Brave', startMonth: 12, startDay: 1, endMonth: 12, endDay: 31, particleColor: '#FFFFFF', emberAccessory: '🧣', xpMultiplier: 1, description: 'Snowflakes and holiday warmth!' },
  { name: 'Brave-o-ween', startMonth: 10, startDay: 15, endMonth: 10, endDay: 31, particleColor: '#FF8C42', emberAccessory: '🎃', xpMultiplier: 1, description: 'Friendly costumes and spooky fun!' },
  { name: 'Brave Hearts Month', startMonth: 2, startDay: 1, endMonth: 2, endDay: 28, particleColor: '#FF6B8A', emberAccessory: '💝', xpMultiplier: 1, description: 'Extra kindness and heart!' },
  { name: 'Autism Acceptance', startMonth: 4, startDay: 1, endMonth: 4, endDay: 30, particleColor: '#9B72CF', emberAccessory: '🧩', xpMultiplier: 1.5, description: 'Celebrating the Quiet Forest!' },
  { name: 'Asthma Awareness', startMonth: 5, startDay: 1, endMonth: 5, endDay: 31, particleColor: '#5DADE2', emberAccessory: '🌬️', xpMultiplier: 1.5, description: "Dragon's Breath Valley featured!" },
  { name: 'Brave Summer', startMonth: 6, startDay: 1, endMonth: 6, endDay: 30, particleColor: '#FFD166', emberAccessory: '🕶️', xpMultiplier: 1, description: 'Outdoor adventure vibes!' },
];

// Brave Week: first 7 days of every month
export function isBraveWeek(): boolean {
  return new Date().getDate() <= 7;
}

export function getActiveEvent(): SeasonalEvent | null {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return SEASONAL_EVENTS.find(e => {
    if (e.startMonth === e.endMonth) {
      return month === e.startMonth && day >= e.startDay && day <= e.endDay;
    }
    if (month === e.startMonth) return day >= e.startDay;
    if (month === e.endMonth) return day <= e.endDay;
    return false;
  }) || null;
}

export function getXPMultiplier(): number {
  let mult = 1;
  const event = getActiveEvent();
  if (event) mult *= event.xpMultiplier;
  if (isBraveWeek()) mult *= 2;
  return mult;
}

/* ---- Brave World Lands ---- */
export interface BraveWorldLand {
  id: string;
  name: string;
  condition: string;
  emoji: string;
  theme: string;
  toolName: string;
  colors: [string, string];
  funFacts: string[];
  famousPeople: string[];
}

export const BRAVE_LANDS: BraveWorldLand[] = [
  { id: 'dragons-breath', name: "Dragon's Breath Valley", condition: 'Asthma', emoji: '🐉', theme: 'A valley where friendly dragons create weather with their breath', toolName: 'The Dragon Whisper', colors: ['#FF8C42', '#5DADE2'], funFacts: ['David Beckham, Pink, and Jerome Bettis all have asthma!', 'Your lungs have 1,500 miles of airways — that\'s like driving from New York to Miami!'], famousPeople: ['David Beckham', 'Pink', 'Jerome Bettis'] },
  { id: 'sugar-crystals', name: 'Sugar Crystal Caves', condition: 'Diabetes', emoji: '💎', theme: 'Underground caves made of crystals that represent blood sugar balance', toolName: 'The Crystal Keeper', colors: ['#14B8A6', '#F59E0B'], funFacts: ['Nick Jonas, Sonia Sotomayor, and Halle Berry all have diabetes!', 'Your pancreas is about the size of a banana!'], famousPeople: ['Nick Jonas', 'Sonia Sotomayor', 'Halle Berry'] },
  { id: 'thunder-wheels', name: 'Thunder Wheel Speedway', condition: 'Wheelchair User', emoji: '⚡', theme: 'A racing circuit where wheels equal power', toolName: 'The Thunder Throne', colors: ['#3B82F6', '#C0C0C0'], funFacts: ['Wheelchair basketball was invented in 1946!', 'Some racing wheelchairs can go over 20 mph!'], famousPeople: ['Aaron Fotheringham', 'Tatyana McFadden'] },
  { id: 'quiet-forest', name: 'The Quiet Forest', condition: 'Autism', emoji: '🌿', theme: 'A magical forest where being different IS the magic', toolName: 'Forest Keys', colors: ['#7FB069', '#9B72CF'], funFacts: ['Temple Grandin, Anthony Hopkins, and Greta Thunberg are all on the spectrum!', 'Many of the world\'s best programmers and scientists are autistic!'], famousPeople: ['Temple Grandin', 'Anthony Hopkins', 'Greta Thunberg'] },
  { id: 'echo-chamber', name: 'The Echo Chamber', condition: 'Hearing Differences', emoji: '🔔', theme: 'A crystal chamber where sound becomes visible as ripples of color', toolName: 'Echo Gems', colors: ['#14B8A6', '#FFD166'], funFacts: ['Beethoven wrote some of his greatest music after going completely deaf!', 'Sign language has its own grammar and structure — it\'s a complete language!'], famousPeople: ['Beethoven', 'Nyle DiMarco', 'Marlee Matlin'] },
  { id: 'spark-tower', name: 'Spark Tower', condition: 'Epilepsy', emoji: '⚡', theme: 'A tower that harnesses electrical energy from extraordinary brains', toolName: 'Spark Shields', colors: ['#FFD166', '#2563EB'], funFacts: ['Lil Wayne, Neil Young, and Prince all had epilepsy!', 'Your brain produces enough electricity to power a small light bulb!'], famousPeople: ['Lil Wayne', 'Neil Young', 'Prince'] },
  { id: 'kaleidoscope', name: 'The Kaleidoscope', condition: 'ADHD', emoji: '🌈', theme: 'Where seeing everything at once is the greatest gift', toolName: 'Kaleidoscope Lenses', colors: ['#FF6B8A', '#5DADE2'], funFacts: ['Michael Phelps and Simone Biles both have ADHD!', 'People with ADHD often have incredible creativity and energy!'], famousPeople: ['Michael Phelps', 'Simone Biles', 'Justin Timberlake'] },
  { id: 'giants-garden', name: "Giant's Garden", condition: 'Down Syndrome', emoji: '🌻', theme: 'A garden where everything grows bigger, brighter, and more beautiful', toolName: 'The Growth Spark', colors: ['#FFD166', '#92684E'], funFacts: ['Chris Burke starred in a TV show for 4 seasons!', 'People with Down syndrome often have amazing memories for music and faces!'], famousPeople: ['Chris Burke', 'Madeline Stuart', 'Tim Harris'] },
  { id: 'shield-fortress', name: 'Shield Fortress', condition: 'Allergies', emoji: '🛡️', theme: 'A fortress where Shield Masters know exactly what\'s safe', toolName: 'Shield Staffs', colors: ['#FFD166', '#5DADE2'], funFacts: ['Over 32 million Americans have food allergies!', 'Allergies mean your immune system is extra protective — like having a superhero bodyguard!'], famousPeople: [] },
  { id: 'brave-heart', name: 'Brave Heart Castle', condition: 'Heart Conditions', emoji: '❤️', theme: 'A castle where every heartbeat powers different magic', toolName: 'Rhythm Stones', colors: ['#DC2626', '#FF6B8A'], funFacts: ['Your heart beats about 100,000 times every day!', 'Arnold Schwarzenegger had heart surgery and came back stronger!'], famousPeople: ['Arnold Schwarzenegger', 'Barbara Streisand'] },
  { id: 'thought-weaver', name: "The Thought Weaver's Loom", condition: 'Anxiety', emoji: '🧠', theme: 'A peaceful loom where tangled thoughts become beautiful tapestries', toolName: 'Weaving Needles', colors: ['#9B72CF', '#FFD166'], funFacts: ['Almost 1 in 3 kids experience anxiety — you are NOT alone!', 'Taking deep breaths actually changes your brain chemistry in seconds!'], famousPeople: ['Simone Biles', 'Michael Phelps', 'Adele'] },
  { id: 'star-lungs', name: 'Star Lungs Station', condition: 'Cystic Fibrosis', emoji: '🫁', theme: 'A space station where special lungs let you breathe in space', toolName: 'Star Gear', colors: ['#C0C0C0', '#5DADE2'], funFacts: ['CF research has made incredible breakthroughs in the last decade!', 'People with CF often develop incredible discipline and resilience!'], famousPeople: [] },
];

/* ---- Campfire Content ---- */
export const CAMPFIRE_QUOTES = [
  { text: "You treat a disease, you win, you lose. You treat a person, I guarantee you, you'll win, no matter what the outcome.", author: "Patch Adams" },
  { text: "You've made this day a special day, by just your being you.", author: "Mr. Rogers" },
  { text: "The things that make me different are the things that make me, me.", author: "Piglet (Winnie the Pooh)" },
  { text: "Why fit in when you were born to stand out?", author: "Dr. Seuss" },
  { text: "In a world where you can be anything, be kind.", author: "Jennifer Dukes Lee" },
  { text: "It's not our disabilities, it's our abilities that count.", author: "Chris Burke" },
  { text: "I have a disability, yes. But that's just one part of me.", author: "Marlee Matlin" },
  { text: "The only disability in life is a bad attitude.", author: "Scott Hamilton" },
  { text: "Different, not less.", author: "Temple Grandin" },
];

export const CAMPFIRE_JOKES = [
  "Why did the inhaler go to school? Because it wanted to be a BREEZE at tests! 😄",
  "What's a wheelchair's favorite music? WHEELY good songs! 🎵",
  "What did the hearing aid say to the ear? I'VE GOT YOU COVERED! 👂",
  "What do you call a dinosaur with asthma? A Bronto-WHEEZE-urus! 🦕",
  "Why was the brain so popular? Because it had a lot of NERVE! 🧠",
  "What's a heart monitor's favorite game? Beat-boxing! ❤️",
];

export const CAMPFIRE_FACTS = [
  "Did you know? Beethoven wrote some of his greatest music after he went completely deaf. He felt the vibrations through the floor.",
  "Did you know? Michael Phelps has ADHD. His coach said his ability to hyperfocus is what made him the greatest swimmer who ever lived.",
  "Did you know? Frida Kahlo had polio as a kid and later was in a serious accident. She became one of the most famous artists in history.",
  "Did you know? Stephen Hawking was told he wouldn't live past 23. He lived to 76 and changed how we understand the entire universe.",
  "Did you know? Stevie Wonder has been blind since birth. He's won 25 Grammy Awards — more than almost any musician in history.",
  "Did you know? Simone Biles has ADHD. She's considered the greatest gymnast of all time.",
];

export const EMBER_MESSAGES = [
  "Hey {name}, I was thinking about you today. You know what makes you amazing? You show up. Every day. That's braver than you know. 🦊",
  "{name}, if today was tough, that's okay. Even superheroes have tough days. Tomorrow the spark comes back. I promise. 🦊",
  "Did I ever tell you that you're my favorite hero? Because you are. Keep shining, {name}. 🦊✨",
  "Fun fact: foxes can hear sounds underground. Know what I hear? Your bravery. It's LOUD, {name}. 🦊",
  "Hey {name}! Just dropping by to remind you: you are exactly who you're supposed to be. And that's pretty incredible. 🦊",
];

/* ---- Demo Story ---- */
export const DEMO_STORY: GeneratedStory = {
  title: "Sam and the Breathing Dragon",
  dedication: "For Sam, who is braver than they know",
  pages: [
    { pageNumber: 1, text: "Sam loved two things more than anything in the world: their golden retriever Biscuit, and running as fast as the wind across Maple Park.", illustration: { description: "A child running through a sunny park with a golden retriever", mood: "joyful", colors: ["#FFD166", "#5DADE2", "#7FB069"] } },
    { pageNumber: 2, text: "But sometimes, when Sam ran really fast, their chest would feel tight — like a tiny dragon had curled up inside, breathing hot, huffy air.", illustration: { description: "Child stopping mid-run with a tiny friendly dragon on their shoulder", mood: "gentle concern", colors: ["#FF8C42", "#9B72CF", "#FFF8E7"] } },
    { pageNumber: 3, text: '"That\'s your asthma," Mom said. "The tunnels in your lungs sometimes get puffy. But guess what? You have a secret weapon."', illustration: { description: "Mom kneeling to child's level holding a glowing inhaler", mood: "warm, reassuring", colors: ["#FFF8E7", "#FF6B8A", "#FFD166"] } },
    { pageNumber: 4, text: 'Mom held up a small blue inhaler. "This is a Dragon Whisper. One puff, and it tells the dragon to calm right down."', illustration: { description: "Child holding a glowing inhaler like a magic wand with sparkles", mood: "magical, empowering", colors: ["#5DADE2", "#FFD166", "#E8E8FF"] } },
    { pageNumber: 5, text: "Sam practiced: breathe in slowly... hold it... breathe out like blowing birthday candles. The tiny dragon purred happily.", illustration: { description: "Child breathing calmly with eyes closed, tiny dragon purring", mood: "peaceful", colors: ["#E8E8FF", "#7FB069", "#FFF8E7"] } },
    { pageNumber: 6, text: "The next day at the park, Sam ran and ran and RAN. Biscuit barked with joy. The dragon stayed quiet. The Dragon Whisper worked!", illustration: { description: "Child running joyfully, dog alongside, bright sunny day", mood: "triumphant", colors: ["#5DADE2", "#FFD166", "#7FB069"] } },
    { pageNumber: 7, text: 'Sam heard a sound. Their friend Maya was on a bench, wheezing. "My chest feels tight," Maya said, looking scared.', illustration: { description: "Another child on bench looking worried, Sam approaching", mood: "empathy", colors: ["#FF6B8A", "#FFF8E7", "#9B72CF"] } },
    { pageNumber: 8, text: '"I know what that is!" Sam said. "You might have a little dragon too. It\'s not scary — your lungs just need some help sometimes."', illustration: { description: "Sam sitting next to Maya, explaining with a brave smile", mood: "brave, kind", colors: ["#FFD166", "#FF6B8A", "#5DADE2"] } },
    { pageNumber: 9, text: "Sam taught Maya the birthday candle breathing. In... out... slow and steady. Maya's face relaxed. The tightness eased.", illustration: { description: "Both children doing breathing exercises together peacefully", mood: "calm, connected", colors: ["#7FB069", "#E8E8FF", "#FFF8E7"] } },
    { pageNumber: 10, text: '"Tell your mom about the dragon," Sam said. "She\'ll get you a Dragon Whisper too. Then nothing can stop you."', illustration: { description: "Both children standing brave and happy with Biscuit wagging tail", mood: "empowering", colors: ["#FFD166", "#FF8C42", "#5DADE2"] } },
    { pageNumber: 11, text: '"You\'re the bravest person I know," Maya said. Sam stood a little taller, because maybe Maya was right.', illustration: { description: "Maya hugging Sam, sparkles and warm glow around them", mood: "proud", colors: ["#FF8C42", "#FF6B8A", "#FFD166"] } },
    { pageNumber: 12, text: 'And every night, Sam whispered to Biscuit: "I\'m not just a kid with asthma. I\'m Sam the Dragon Tamer. And tomorrow, we run again."', illustration: { description: "Child in bed with dog, tiny dragon sleeping at foot, moonlight", mood: "peaceful, proud", colors: ["#5DADE2", "#FFF8E7", "#FFD166"] } },
  ],
  aboutTheCondition: {
    forKids: "Asthma means the tiny tubes in your lungs sometimes get puffy and tight. Your inhaler sends special medicine that calms them right down. Lots of amazing people have asthma — even Olympic athletes! Having asthma doesn't stop you from doing ANYTHING you love.",
    forParents: "This story uses metaphor to help children understand asthma. The 'dragon' represents chest tightness, and the inhaler is reframed as a tool of power. Research shows children who understand their condition and feel agency over treatment have better outcomes.",
  },
};

/* ---- Brave Letters seed data ---- */
export const SEED_LETTERS = [
  { condition: 'asthma', text: "My inhaler is purple. I call it Grape Power! 💜", age: 8 },
  { condition: 'asthma', text: "I was scared about gym class but my teacher let me take breaks. It's actually fine!", age: 9 },
  { condition: 'diabetes', text: "Pro tip: gummy bears are the BEST fast sugar for lows. You're welcome. 🐻", age: 10 },
  { condition: 'diabetes', text: "My insulin pump has a cool case with stickers on it. It's like a tiny robot sidekick!", age: 7 },
  { condition: 'wheelchair', text: "I can do wheelies in my wheelchair. Can YOUR legs do that?? 😎", age: 11 },
  { condition: 'autism', text: "I like things in order and that makes me really good at puzzles. What's YOUR superpower?", age: 9 },
  { condition: 'adhd', text: "My brain goes SO fast. My teacher says I have the best ideas in class when I slow down to share them!", age: 8 },
  { condition: 'epilepsy', text: "To anyone who just found out — it gets easier. I promise. You're joining the coolest club. ⚡", age: 12 },
  { condition: 'anxiety', text: "When I feel worried, I count 5 things I can see. It helps every time. Try it! 🌟", age: 10 },
  { condition: 'general', text: "I was scared about my first day back at school. But my friends were SO nice. You'll be okay! 🌟", age: 8 },
];

/* ---- Helper: localStorage ---- */
export function getProfile(): SparkProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('spark-profile');
    if (!raw) return null;
    const profile = JSON.parse(raw) as SparkProfile;
    // Ensure engagement fields exist (migration for existing profiles)
    if (profile.sparkCoins === undefined) profile.sparkCoins = 0;
    if (profile.xp === undefined) profile.xp = 0;
    if (profile.level === undefined) profile.level = 1;
    if (profile.loginStreak === undefined) profile.loginStreak = 0;
    if (profile.lastLoginDate === undefined) profile.lastLoginDate = '';
    if (profile.collectedSparkles === undefined) profile.collectedSparkles = [];
    if (profile.exploredLands === undefined) profile.exploredLands = [];
    if (profile.unlockedCosmetics === undefined) profile.unlockedCosmetics = [];
    if (profile.landCollectibles === undefined) profile.landCollectibles = {};
    return profile;
  } catch { return null; }
}

export function saveProfile(profile: SparkProfile) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('spark-profile', JSON.stringify(profile)); } catch { /* full */ }
}

export function earnBadge(badgeId: string): boolean {
  const profile = getProfile();
  if (!profile) return false;
  if (profile.badges.includes(badgeId)) return false;
  profile.badges.push(badgeId);
  awardXP(profile, XP_AWARDS.EARN_BADGE);
  saveProfile(profile);
  return true;
}

export function awardXP(profile: SparkProfile, amount: number): { leveled: boolean; newLevel: number; oldLevel: number } {
  const mult = getXPMultiplier();
  const xpToAdd = Math.round(amount * mult);
  const oldLevel = getLevelForXP(profile.xp).level;
  profile.xp += xpToAdd;
  const newLevel = getLevelForXP(profile.xp).level;
  profile.level = newLevel;
  return { leveled: newLevel > oldLevel, newLevel, oldLevel };
}

export function awardCoins(profile: SparkProfile, amount: number) {
  profile.sparkCoins += amount;
  saveProfile(profile);
}

export function collectSparkle(sparkleId: string): boolean {
  const profile = getProfile();
  if (!profile) return false;
  if (profile.collectedSparkles.includes(sparkleId)) return false;
  profile.collectedSparkles.push(sparkleId);
  awardXP(profile, XP_AWARDS.COLLECT_SPARKLE);
  // Check for land mastery
  const sparkle = SPARKLE_LOCATIONS.find(s => s.id === sparkleId);
  if (sparkle) {
    const landSparkles = getSparklesForLand(sparkle.landId);
    const allCollected = landSparkles.every(s => profile.collectedSparkles.includes(s.id));
    if (allCollected) {
      const badgeId = `land-master-${sparkle.landId}`;
      if (!profile.badges.includes(badgeId)) {
        profile.badges.push(badgeId);
      }
    }
    // Check for sparkle hunter (all sparkles)
    if (profile.collectedSparkles.length >= SPARKLE_LOCATIONS.length) {
      if (!profile.badges.includes('sparkle-hunter')) {
        profile.badges.push('sparkle-hunter');
      }
    }
  }
  saveProfile(profile);
  return true;
}

export function processDailyLogin(profile: SparkProfile): { isNewDay: boolean; reward: DailyReward; streak: number } {
  const today = getTodayDateString();
  if (profile.lastLoginDate === today) {
    return { isNewDay: false, reward: getDailyReward(profile.loginStreak), streak: profile.loginStreak };
  }

  // Check if streak continues (yesterday) or resets
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (profile.lastLoginDate === yesterdayStr) {
    profile.loginStreak += 1;
  } else {
    profile.loginStreak = 1;
  }

  profile.lastLoginDate = today;

  const reward = getDailyReward(profile.loginStreak);
  if (reward.type === 'coins' && reward.amount) {
    profile.sparkCoins += reward.amount;
  }
  awardXP(profile, XP_AWARDS.DAILY_LOGIN);

  // Weekly Hero badge on day 7
  if (profile.loginStreak % 7 === 0) {
    if (!profile.badges.includes('weekly-hero')) {
      profile.badges.push('weekly-hero');
    }
  }
  // Unstoppable badge at 30 days
  if (profile.loginStreak >= 30) {
    if (!profile.badges.includes('unstoppable')) {
      profile.badges.push('unstoppable');
    }
  }

  saveProfile(profile);
  return { isNewDay: true, reward, streak: profile.loginStreak };
}

/* ---- Common conditions ---- */
export const CONDITIONS = [
  "Asthma", "Diabetes (Type 1)", "Cancer", "Epilepsy", "Autism", "ADHD",
  "Down Syndrome", "Cerebral Palsy", "Food Allergies", "Sickle Cell Disease",
  "Cystic Fibrosis", "Hearing Loss", "Vision Loss", "Wheelchair User",
  "Limb Difference", "Anxiety", "Speech Delay", "Heart Condition",
];

export const STORY_TONES = [
  { value: 'adventure', label: 'Adventure', emoji: '🌟', desc: 'A quest in the Brave World' },
  { value: 'superhero', label: 'Superhero', emoji: '🦸', desc: 'Discover their power' },
  { value: 'fantasy', label: 'Fantasy', emoji: '🧚', desc: 'Magical creatures help' },
  { value: 'everyday', label: 'Everyday Hero', emoji: '🌈', desc: 'Helping others' },
  { value: 'holiday', label: 'Holiday Special', emoji: '🎄', desc: 'Saves the holiday' },
  { value: 'bedtime', label: 'Bedtime', emoji: '🌙', desc: 'Soothing and safe' },
];

export const FAVORITE_THINGS = {
  Animals: ["Dogs", "Cats", "Horses", "Dinosaurs", "Butterflies", "Dragons", "Unicorns"],
  Activities: ["Soccer", "Drawing", "Dancing", "Swimming", "Reading", "Music", "Cooking", "Space", "Building"],
  Characters: ["Superheroes", "Princesses", "Pirates", "Astronauts", "Wizards", "Knights", "Mermaids"],
  Colors: ["Red", "Blue", "Pink", "Purple", "Green", "Gold", "Rainbow"],
};
