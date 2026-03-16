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
];

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
    return raw ? JSON.parse(raw) : null;
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
  saveProfile(profile);
  return true;
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
