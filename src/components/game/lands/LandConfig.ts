/* Level configuration for all Brave World lands */

export interface Hotspot {
  x: number;
  name: string;
  type: 'play' | 'story' | 'heroes' | 'tool' | 'badge';
  emoji: string;
  label: string;
}

export interface NPC {
  x: number;
  y: number;
  emoji: string;
  name: string;
  message: string;
  idleAnim: 'bounce' | 'wave' | 'breathe' | 'spin';
}

export interface Collectible {
  x: number;
  y: number;
  id: string;
  type: string;
}

export interface LandConfig {
  id: string;
  worldWidth: number;
  worldHeight: number;
  groundY: number; // Y position of walkable ground
  skyGradient: [string, string, string]; // top, mid, bottom colors
  groundColor: [string, string]; // gradient for ground
  mountains: { x: number; width: number; height: number; color: string }[];
  hotspots: Hotspot[];
  npcs: NPC[];
  collectibles: Collectible[];
  particleColor: string;
  particleCount: number;
  particleDirection: 'up' | 'down' | 'drift';
  ambientEmoji?: string; // scattered ambient elements
}

const LAND_CONFIGS: Record<string, LandConfig> = {
  'dragons-breath': {
    id: 'dragons-breath',
    worldWidth: 3840,
    worldHeight: 720,
    groundY: 520,
    skyGradient: ['#1a0a2e', '#ff6b35', '#ffd166'],
    groundColor: ['#8B6F3C', '#6B5A2E'],
    mountains: [
      { x: 200, width: 300, height: 280, color: '#8B4513' },
      { x: 600, width: 400, height: 350, color: '#A0522D' },
      { x: 1100, width: 250, height: 220, color: '#8B6347' },
      { x: 2200, width: 350, height: 300, color: '#8B4513' },
      { x: 3000, width: 280, height: 260, color: '#A0522D' },
    ],
    hotspots: [
      { x: 400, name: "The Dragon's Den", type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1200, name: 'The Story Stone', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 2000, name: 'Hall of Dragon Tamers', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2800, name: 'Dragon Whisper Forge', type: 'tool', emoji: '🔧', label: 'Power Tool' },
      { x: 3400, name: 'The Overlook', type: 'badge', emoji: '🏅', label: 'Badge Challenge' },
    ],
    npcs: [
      { x: 450, y: 480, emoji: '🐉', name: 'Drago', message: 'Welcome to my valley! I used to huff and puff, but now I breathe easy!', idleAnim: 'breathe' },
      { x: 1250, y: 490, emoji: '🦉', name: 'Wise Wing', message: 'Did you know David Beckham has asthma? True heroes come in all types!', idleAnim: 'bounce' },
      { x: 2850, y: 485, emoji: '🐉', name: 'Smithy', message: 'I forge Dragon Whispers for brave kids. Want to see how it works?', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 700, y: 450, id: 'dragon-scale-1', type: 'dragon-scale' },
      { x: 1700, y: 460, id: 'dragon-scale-2', type: 'dragon-scale' },
      { x: 3100, y: 440, id: 'dragon-scale-3', type: 'dragon-scale' },
    ],
    particleColor: '#FF8C42',
    particleCount: 35,
    particleDirection: 'up',
  },

  'sugar-crystals': {
    id: 'sugar-crystals',
    worldWidth: 3600,
    worldHeight: 720,
    groundY: 530,
    skyGradient: ['#0a1628', '#14293f', '#1a3d4d'],
    groundColor: ['#1a3d4d', '#0f2937'],
    mountains: [
      { x: 100, width: 200, height: 400, color: '#14B8A644' },
      { x: 500, width: 150, height: 350, color: '#0D9B8A44' },
      { x: 1400, width: 300, height: 420, color: '#14B8A633' },
      { x: 2500, width: 250, height: 380, color: '#0D9B8A44' },
    ],
    hotspots: [
      { x: 350, name: 'Crystal Play Cave', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1000, name: 'Crystal Story Chamber', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1800, name: 'Hall of Crystal Masters', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2600, name: 'Crystal Keeper Forge', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 400, y: 495, emoji: '💎', name: 'Cryssy', message: 'These crystals show your balance! When they glow green, everything is just right!', idleAnim: 'spin' },
      { x: 1850, y: 500, emoji: '🧙', name: 'The Keeper', message: 'Nick Jonas manages his diabetes AND is a rock star. You can do anything!', idleAnim: 'bounce' },
    ],
    collectibles: [
      { x: 600, y: 470, id: 'crystal-gem-1', type: 'crystal' },
      { x: 1500, y: 480, id: 'crystal-gem-2', type: 'crystal' },
      { x: 2900, y: 460, id: 'crystal-gem-3', type: 'crystal' },
    ],
    particleColor: '#14B8A6',
    particleCount: 30,
    particleDirection: 'drift',
  },

  'thunder-wheels': {
    id: 'thunder-wheels',
    worldWidth: 3600,
    worldHeight: 720,
    groundY: 520,
    skyGradient: ['#2A3A5C', '#4A6FA5', '#87CEEB'],
    groundColor: ['#4A4A4A', '#3A3A3A'],
    mountains: [
      { x: 300, width: 250, height: 200, color: '#5A5A5A44' },
      { x: 1800, width: 300, height: 250, color: '#5A5A5A33' },
    ],
    hotspots: [
      { x: 400, name: 'The Starting Line', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1100, name: 'Track Tales', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 2000, name: 'Champions Wall', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2800, name: 'Thunder Throne Workshop', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 500, y: 485, emoji: '🏎️', name: 'Speedy', message: 'Wheels are POWER! Racing wheelchairs go over 20 mph!', idleAnim: 'bounce' },
      { x: 2050, y: 490, emoji: '🏆', name: 'Coach T', message: 'Aaron Fotheringham does backflips in his wheelchair. How cool is that?', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 800, y: 460, id: 'wheel-bolt-1', type: 'bolt' },
      { x: 1600, y: 450, id: 'wheel-bolt-2', type: 'bolt' },
      { x: 3000, y: 470, id: 'wheel-bolt-3', type: 'bolt' },
    ],
    particleColor: '#3B82F6',
    particleCount: 20,
    particleDirection: 'drift',
  },

  'quiet-forest': {
    id: 'quiet-forest',
    worldWidth: 3600,
    worldHeight: 720,
    groundY: 530,
    skyGradient: ['#1A2F1A', '#2D4A22', '#7FB069'],
    groundColor: ['#3D6B2E', '#2D5A20'],
    mountains: [],
    hotspots: [
      { x: 350, name: 'The Listening Glade', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1100, name: 'Story Mushroom Ring', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1900, name: 'The Hall of Difference', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2700, name: 'Forest Keys Hollow', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 400, y: 495, emoji: '🦉', name: 'Hoot', message: 'The forest is quieter than the world outside. That\'s what makes it special.', idleAnim: 'bounce' },
      { x: 1950, y: 500, emoji: '🦋', name: 'Flutter', message: 'Temple Grandin sees the world differently — and she changed how we understand animals!', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 700, y: 475, id: 'forest-leaf-1', type: 'leaf' },
      { x: 1500, y: 480, id: 'forest-leaf-2', type: 'leaf' },
      { x: 3000, y: 470, id: 'forest-leaf-3', type: 'leaf' },
    ],
    particleColor: '#7FB069',
    particleCount: 25,
    particleDirection: 'drift',
  },

  'echo-chamber': {
    id: 'echo-chamber',
    worldWidth: 3400,
    worldHeight: 720,
    groundY: 530,
    skyGradient: ['#1A1428', '#14B8A644', '#2A1F3D'],
    groundColor: ['#2A2040', '#1E1830'],
    mountains: [
      { x: 400, width: 350, height: 300, color: '#14B8A622' },
      { x: 1600, width: 400, height: 350, color: '#FFD16622' },
    ],
    hotspots: [
      { x: 350, name: 'The Sound Garden', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1000, name: 'Vibration Library', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1800, name: 'Echo Heroes', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2600, name: 'Echo Gem Workshop', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 400, y: 495, emoji: '🔔', name: 'Chime', message: 'Every sound creates a beautiful ripple here. Even silence is music!', idleAnim: 'bounce' },
      { x: 1850, y: 500, emoji: '🎵', name: 'Harmony', message: 'Beethoven wrote his greatest music after going deaf. He felt it through the floor!', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 600, y: 470, id: 'echo-note-1', type: 'note' },
      { x: 1400, y: 480, id: 'echo-note-2', type: 'note' },
      { x: 2900, y: 460, id: 'echo-note-3', type: 'note' },
    ],
    particleColor: '#14B8A6',
    particleCount: 20,
    particleDirection: 'drift',
  },

  'spark-tower': {
    id: 'spark-tower',
    worldWidth: 3600,
    worldHeight: 720,
    groundY: 520,
    skyGradient: ['#1A1428', '#2A1F5D', '#87CEEB'],
    groundColor: ['#3A3550', '#2A2540'],
    mountains: [
      { x: 1500, width: 200, height: 500, color: '#FFD16688' },
    ],
    hotspots: [
      { x: 350, name: 'The Circuit', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1000, name: 'Lightning Library', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1800, name: 'Spark Heroes', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2600, name: 'Shield Workshop', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 400, y: 485, emoji: '⚡', name: 'Zap', message: 'Your brain is electric! And the Spark Tower harnesses that power!', idleAnim: 'bounce' },
      { x: 1850, y: 490, emoji: '🎸', name: 'Amp', message: 'Lil Wayne and Prince both had epilepsy. Lightning doesn\'t stop legends!', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 700, y: 460, id: 'spark-bolt-1', type: 'bolt' },
      { x: 1500, y: 450, id: 'spark-bolt-2', type: 'bolt' },
      { x: 3000, y: 470, id: 'spark-bolt-3', type: 'bolt' },
    ],
    particleColor: '#FFD166',
    particleCount: 30,
    particleDirection: 'up',
  },

  'kaleidoscope': {
    id: 'kaleidoscope',
    worldWidth: 3800,
    worldHeight: 720,
    groundY: 520,
    skyGradient: ['#FF6B8A44', '#FFD16644', '#5DADE244'],
    groundColor: ['#7FB069', '#5A8A3C'],
    mountains: [],
    hotspots: [
      { x: 400, name: 'The Focus Zone', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1200, name: 'Pattern Library', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 2000, name: 'Kaleidoscope Heroes', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2800, name: 'Lens Workshop', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 450, y: 485, emoji: '🌈', name: 'Prisma', message: 'Seeing everything at once is a GIFT! Your brain is amazing!', idleAnim: 'spin' },
      { x: 2050, y: 490, emoji: '🏊', name: 'Champ', message: 'Michael Phelps and Simone Biles both have ADHD. Superstars!', idleAnim: 'bounce' },
    ],
    collectibles: [
      { x: 800, y: 460, id: 'kaleid-prism-1', type: 'prism' },
      { x: 1600, y: 450, id: 'kaleid-prism-2', type: 'prism' },
      { x: 3200, y: 470, id: 'kaleid-prism-3', type: 'prism' },
    ],
    particleColor: '#FF6B8A',
    particleCount: 35,
    particleDirection: 'drift',
  },

  'giants-garden': {
    id: 'giants-garden',
    worldWidth: 3600,
    worldHeight: 720,
    groundY: 530,
    skyGradient: ['#87CEEB', '#B0D4E8', '#E8F4FD'],
    groundColor: ['#7FB069', '#5A8A3C'],
    mountains: [],
    hotspots: [
      { x: 350, name: 'The Growing Patch', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1100, name: 'Garden Stories', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1900, name: 'Giant Heroes', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2700, name: 'Growth Spark Fountain', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 400, y: 495, emoji: '🌻', name: 'Sunny', message: 'Everything grows bigger and brighter here! Just like YOU!', idleAnim: 'bounce' },
      { x: 1950, y: 500, emoji: '🌷', name: 'Bloom', message: 'People with Down syndrome often have the most amazing memories for music!', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 700, y: 475, id: 'garden-seed-1', type: 'seed' },
      { x: 1500, y: 480, id: 'garden-seed-2', type: 'seed' },
      { x: 3000, y: 470, id: 'garden-seed-3', type: 'seed' },
    ],
    particleColor: '#FFD166',
    particleCount: 20,
    particleDirection: 'up',
  },

  'shield-fortress': {
    id: 'shield-fortress',
    worldWidth: 3600,
    worldHeight: 720,
    groundY: 520,
    skyGradient: ['#FFD16622', '#87CEEB', '#B0D4E8'],
    groundColor: ['#8B7D6B', '#7A6F5F'],
    mountains: [
      { x: 1200, width: 500, height: 350, color: '#FFD16644' },
    ],
    hotspots: [
      { x: 400, name: 'Training Grounds', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1100, name: 'Shield Library', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1900, name: 'Shield Heroes', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2700, name: 'Shield Staff Armory', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 450, y: 485, emoji: '🛡️', name: 'Guard', message: 'A Shield Master always knows what\'s safe. Your awareness is your superpower!', idleAnim: 'bounce' },
      { x: 1950, y: 490, emoji: '⚔️', name: 'Captain', message: 'Over 32 million Americans have food allergies. You\'re in great company!', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 700, y: 460, id: 'shield-gem-1', type: 'gem' },
      { x: 1500, y: 470, id: 'shield-gem-2', type: 'gem' },
      { x: 3000, y: 450, id: 'shield-gem-3', type: 'gem' },
    ],
    particleColor: '#FFD166',
    particleCount: 15,
    particleDirection: 'drift',
  },

  'brave-heart': {
    id: 'brave-heart',
    worldWidth: 3600,
    worldHeight: 720,
    groundY: 525,
    skyGradient: ['#FF6B8A33', '#FFB3C1', '#FFF0F5'],
    groundColor: ['#C9A0DC44', '#9B72CF33'],
    mountains: [
      { x: 1300, width: 400, height: 380, color: '#DC262622' },
    ],
    hotspots: [
      { x: 400, name: 'Heartbeat Arena', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1100, name: 'Heart Library', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1900, name: 'Brave Heart Heroes', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2700, name: 'Rhythm Stone Workshop', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 450, y: 490, emoji: '❤️', name: 'Pulse', message: 'Your heart beats 100,000 times a day! Each one powers magic here!', idleAnim: 'bounce' },
      { x: 1950, y: 495, emoji: '💪', name: 'Arno', message: 'Arnold Schwarzenegger had heart surgery and came back even stronger!', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 700, y: 465, id: 'heart-ruby-1', type: 'ruby' },
      { x: 1600, y: 470, id: 'heart-ruby-2', type: 'ruby' },
      { x: 3000, y: 460, id: 'heart-ruby-3', type: 'ruby' },
    ],
    particleColor: '#FF6B8A',
    particleCount: 25,
    particleDirection: 'up',
  },

  'thought-weaver': {
    id: 'thought-weaver',
    worldWidth: 3400,
    worldHeight: 720,
    groundY: 530,
    skyGradient: ['#2A1F3D', '#9B72CF44', '#C4A6D6'],
    groundColor: ['#3D2C5A', '#2D1F4A'],
    mountains: [],
    hotspots: [
      { x: 350, name: 'The Calm Loom', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1000, name: 'Thread Stories', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1700, name: 'Weaver Heroes', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2500, name: 'Needle Workshop', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 400, y: 495, emoji: '🧶', name: 'Thready', message: 'Tangled thoughts become beautiful tapestries here. Let\'s breathe and weave!', idleAnim: 'bounce' },
      { x: 1750, y: 500, emoji: '🎤', name: 'Singer', message: 'Adele has anxiety too. She turns her feelings into the most beautiful songs!', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 600, y: 475, id: 'weaver-thread-1', type: 'thread' },
      { x: 1300, y: 480, id: 'weaver-thread-2', type: 'thread' },
      { x: 2800, y: 470, id: 'weaver-thread-3', type: 'thread' },
    ],
    particleColor: '#9B72CF',
    particleCount: 20,
    particleDirection: 'drift',
  },

  'star-lungs': {
    id: 'star-lungs',
    worldWidth: 3600,
    worldHeight: 720,
    groundY: 520,
    skyGradient: ['#0D0D1A', '#1A1A3D', '#C0C0C033'],
    groundColor: ['#2A2A3D', '#1A1A2D'],
    mountains: [],
    hotspots: [
      { x: 400, name: 'Oxygen Lab', type: 'play', emoji: '🎮', label: 'Play' },
      { x: 1100, name: 'Star Log', type: 'story', emoji: '📖', label: 'Story Corner' },
      { x: 1900, name: 'Space Heroes', type: 'heroes', emoji: '🌟', label: 'Famous Heroes' },
      { x: 2700, name: 'Star Gear Bay', type: 'tool', emoji: '🔧', label: 'Power Tool' },
    ],
    npcs: [
      { x: 450, y: 485, emoji: '🚀', name: 'Cosmo', message: 'In space, special lungs are the greatest gift. Just like yours!', idleAnim: 'bounce' },
      { x: 1950, y: 490, emoji: '⭐', name: 'Nova', message: 'CF research has made incredible breakthroughs. The future is bright!', idleAnim: 'wave' },
    ],
    collectibles: [
      { x: 700, y: 460, id: 'star-core-1', type: 'core' },
      { x: 1500, y: 450, id: 'star-core-2', type: 'core' },
      { x: 3000, y: 470, id: 'star-core-3', type: 'core' },
    ],
    particleColor: '#C0C0C0',
    particleCount: 30,
    particleDirection: 'drift',
  },
};

export function getLandConfig(landId: string): LandConfig | null {
  return LAND_CONFIGS[landId] || null;
}
