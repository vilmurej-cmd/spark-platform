'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Ember, { SparkBurst, BottomNav } from '@/components/Ember';
import { getProfile, earnBadge } from '@/lib/spark-data';

type GameId = 'breathing' | 'crystal' | 'memory' | 'quiz' | null;

const GAMES = [
  { id: 'breathing' as const, name: 'Dragon Breathing', emoji: '🐉', desc: 'Calm the dragon with your breath', color: '#FF8C42' },
  { id: 'crystal' as const, name: 'Crystal Balance', emoji: '💎', desc: 'Keep the sugar crystals balanced', color: '#14B8A6' },
  { id: 'memory' as const, name: 'Memory Match', emoji: '🧠', desc: 'Match the brave power tools', color: '#5DADE2' },
  { id: 'quiz' as const, name: "Ember's Quiz", emoji: '🦊', desc: 'Health trivia time!', color: '#9B72CF' },
];

const MEMORY_PAIRS = [
  { emoji: '🐉', name: 'Dragon Whisper (Inhaler)', fact: 'Inhalers help open the airways so you can breathe easily!' },
  { emoji: '💎', name: 'Crystal Keeper (Insulin Pump)', fact: 'Insulin pumps help keep blood sugar balanced all day!' },
  { emoji: '⚡', name: 'Thunder Throne (Wheelchair)', fact: 'Racing wheelchairs can go over 20 mph!' },
  { emoji: '🌿', name: 'Forest Keys (Sensory Tools)', fact: 'Sensory tools help autistic kids feel calm and focused!' },
  { emoji: '🔔', name: 'Echo Gems (Hearing Aids)', fact: 'Sign language is a complete language with its own grammar!' },
  { emoji: '🌈', name: 'Kaleidoscope Lenses (ADHD)', fact: 'People with ADHD often have incredible creativity!' },
];

const QUIZ_QUESTIONS = [
  { q: 'What organ does an inhaler help?', options: ['Heart', 'Lungs', 'Brain', 'Stomach'], answer: 1, explanation: 'An inhaler sends medicine straight to your lungs to help you breathe!' },
  { q: 'What does insulin help control?', options: ['Temperature', 'Blood sugar', 'Heart rate', 'Sleep'], answer: 1, explanation: 'Insulin is like a key that helps sugar get from your blood into your cells for energy!' },
  { q: 'How many times does your heart beat per day?', options: ['1,000', '10,000', '100,000', '1,000,000'], answer: 2, explanation: 'Your amazing heart beats about 100,000 times every single day!' },
  { q: 'What famous swimmer has ADHD?', options: ['Michael Phelps', 'Ryan Lochte', 'Katie Ledecky', 'Mark Spitz'], answer: 0, explanation: 'Michael Phelps used his ability to hyperfocus to become the greatest swimmer ever!' },
  { q: 'Being brave means...', options: ['Never being scared', 'Doing things even when scared', 'Never crying', 'Being alone'], answer: 1, explanation: 'Being brave means feeling the fear and doing it anyway. Crying is totally okay!' },
  { q: 'TRUE or FALSE: Lots of kids use wheelchairs AND play sports!', options: ['TRUE', 'FALSE'], answer: 0, explanation: 'Wheelchair basketball, tennis, racing, and more — wheels equal power!' },
  { q: "What's an inhaler called in the Brave World?", options: ['The Echo Gem', 'The Dragon Whisper', 'The Star Gear', 'The Shield Staff'], answer: 1, explanation: 'The Dragon Whisper calms the breathing dragon with one magical puff!' },
  { q: 'Which famous gymnast has ADHD?', options: ['Gabby Douglas', 'Simone Biles', 'Aly Raisman', 'Nadia Comaneci'], answer: 1, explanation: 'Simone Biles has ADHD and is considered the greatest gymnast of all time!' },
  { q: 'What did Beethoven do after going deaf?', options: ['Stopped making music', 'Wrote his greatest music', 'Became a painter', 'Moved away'], answer: 1, explanation: 'Beethoven felt the vibrations through the floor and wrote some of the most beautiful music ever!' },
  { q: 'How many kids experience anxiety?', options: ['About 1 in 100', 'About 1 in 10', 'About 1 in 3', 'About 1 in 50'], answer: 2, explanation: 'About 1 in 3 kids experience anxiety — you are absolutely NOT alone!' },
];

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [badgeEarned, setBadgeEarned] = useState(false);

  const handleStartGame = (id: GameId) => {
    setActiveGame(id);
    const result = earnBadge('first-game');
    if (result) {
      setBadgeEarned(true);
      setTimeout(() => setBadgeEarned(false), 3000);
    }
  };

  if (activeGame === 'breathing') return <DragonBreathing onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crystal') return <CrystalBalance onBack={() => setActiveGame(null)} />;
  if (activeGame === 'memory') return <MemoryMatch onBack={() => setActiveGame(null)} />;
  if (activeGame === 'quiz') return <EmberQuiz onBack={() => setActiveGame(null)} />;

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-center mb-1 bg-gradient-to-r from-brave to-dream bg-clip-text text-transparent">
            Spark Games
          </h1>
          <p className="text-center font-body text-text-light mb-6">
            Play, breathe, and be brave!
          </p>

          <AnimatePresence>
            {badgeEarned && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="spark-card p-3 mb-4 text-center border-2 border-brave/50">
                <p className="font-display font-semibold text-brave">🎮 Game Explorer badge earned!</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            {GAMES.map((game, i) => (
              <motion.button key={game.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleStartGame(game.id)}
                className="spark-card p-6 text-center hover:shadow-lg transition-all min-h-[140px]">
                <motion.div
                  className="text-5xl mb-3"
                  animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  {game.emoji}
                </motion.div>
                <h2 className="font-display font-bold text-sm" style={{ color: game.color }}>{game.name}</h2>
                <p className="font-body text-xs text-text-muted mt-1">{game.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}

/* ================================================================ */
/*  Dragon Breathing Game — Immersive Valley                        */
/* ================================================================ */
function DragonBreathing({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    let remaining = seconds;
    countdownRef.current = setInterval(() => {
      remaining--;
      setCountdown(remaining);
      if (remaining <= 0 && countdownRef.current) clearInterval(countdownRef.current);
    }, 1000);
  };

  const runCycle = useCallback((count: number) => {
    if (count >= 4) {
      setPhase('idle');
      setRunning(false);
      setCycles(4);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 2000);
      // Save session count
      try {
        const prev = parseInt(localStorage.getItem('spark-breathing-sessions') || '0', 10);
        localStorage.setItem('spark-breathing-sessions', String(prev + 1));
      } catch { /* ok */ }
      return;
    }
    // Inhale 4s
    setPhase('inhale');
    startCountdown(4);
    timerRef.current = setTimeout(() => {
      // Hold 4s
      setPhase('hold');
      startCountdown(4);
      timerRef.current = setTimeout(() => {
        // Exhale 6s
        setPhase('exhale');
        startCountdown(6);
        timerRef.current = setTimeout(() => {
          setCycles(count + 1);
          runCycle(count + 1);
        }, 6000);
      }, 4000);
    }, 4000);
  }, []);

  const startBreathing = useCallback(() => {
    setRunning(true);
    setCycles(0);
    setShowBurst(false);
    runCycle(0);
  }, [runCycle]);

  useEffect(() => {
    return clearTimers;
  }, []);

  const circleScale = phase === 'inhale' ? 1.6 : phase === 'hold' ? 1.6 : phase === 'exhale' ? 1 : 1.2;
  const circleColor = phase === 'inhale' ? '#5DADE2' : phase === 'hold' ? '#9B72CF' : phase === 'exhale' ? '#FFD166' : '#FF8C42';
  const dragonEmoji = cycles >= 4 ? '😴' : phase === 'idle' ? '🐉' : phase === 'exhale' ? '😌' : phase === 'hold' ? '😊' : '🐉';
  const dragonPulseSpeed = phase === 'idle' && cycles < 4 ? 0.8 : phase === 'inhale' ? 2 : phase === 'hold' ? 3 : 0;

  const label = phase === 'inhale'
    ? `Breathe in... ${countdown}...`
    : phase === 'hold'
      ? `Hold... ${countdown}...`
      : phase === 'exhale'
        ? `Breathe out... ${countdown}...`
        : cycles >= 4 ? 'The dragon is calm!' : 'Ready?';

  const sessionCount = typeof window !== 'undefined' ? parseInt(localStorage.getItem('spark-breathing-sessions') || '0', 10) : 0;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <SparkBurst active={showBurst} />

      {/* Valley environment background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF8C42]/30 via-[#FFD166]/20 to-[#7FB069]/40" />
      {/* Sky */}
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#87CEEB]/50 to-transparent" />
      {/* Hills */}
      <div className="absolute bottom-0 left-[-10%] w-[60%] h-[25%] rounded-t-full bg-[#7FB069]/40" />
      <div className="absolute bottom-0 right-[-10%] w-[55%] h-[20%] rounded-t-full bg-[#6A9F55]/30" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-4">
        <button onClick={() => { clearTimers(); onBack(); }}
          className="font-display text-sm text-text-muted hover:text-ember mb-4 block min-h-[48px] flex items-center">
          ← Back to Games
        </button>
        <h1 className="text-2xl font-display font-bold text-center text-ember mb-1">Dragon Breathing</h1>
        <p className="text-center font-body text-text-light mb-6 text-sm">Breathe with the dragon to calm it down</p>

        {/* Dragon */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="text-7xl"
            animate={dragonPulseSpeed > 0 ? {
              scale: [1, 1.1, 1],
            } : cycles >= 4 ? {
              y: [0, -3, 0],
            } : {}}
            transition={dragonPulseSpeed > 0 ? {
              duration: dragonPulseSpeed,
              repeat: Infinity,
            } : {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {dragonEmoji}
          </motion.div>
        </div>

        {/* Breathing circle */}
        <div className="flex items-center justify-center mb-6" style={{ height: 200 }}>
          <motion.div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 140, height: 140,
              background: `radial-gradient(circle, ${circleColor}44, ${circleColor}22)`,
              border: `3px solid ${circleColor}66`,
            }}
            animate={{ scale: circleScale }}
            transition={{ duration: phase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
          >
            <motion.div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 80, height: 80,
                background: `radial-gradient(circle, ${circleColor}66, ${circleColor}33)`,
              }}
              animate={{ scale: circleScale * 0.85 }}
              transition={{ duration: phase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
            >
              <span className="font-display font-bold text-lg text-white drop-shadow-md">
                {countdown > 0 ? countdown : ''}
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.p key={phase + countdown} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center font-display font-bold text-xl text-ember mb-4">
          {label}
        </motion.p>

        {/* Cycle progress dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="w-5 h-5 rounded-full transition-colors"
              style={{
                background: i < cycles ? '#FF8C42' : '#FFD16644',
                border: i < cycles ? '2px solid #FF8C42' : '2px solid #FFD16644',
              }}
              animate={i < cycles ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {!running ? (
          <button onClick={startBreathing} className="btn-spark btn-primary w-full text-lg min-h-[56px]">
            {cycles >= 4 ? 'Breathe Again' : 'Start Breathing'}
          </button>
        ) : (
          <p className="text-center font-body text-text-muted text-sm">
            Cycle {Math.min(cycles + 1, 4)} of 4
          </p>
        )}

        {cycles >= 4 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="spark-card p-5 mt-6 text-center border-2 border-spark/50 bg-white/90">
            <Ember message="You did it! The dragon is calm because of YOU!" expression="celebrating" />
            {sessionCount > 0 && (
              <p className="font-body text-xs text-text-muted mt-2">
                Total breathing sessions: {sessionCount}
              </p>
            )}
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

/* ================================================================ */
/*  Crystal Balance Game                                             */
/* ================================================================ */
function CrystalBalance({ onBack }: { onBack: () => void }) {
  const [gauge, setGauge] = useState(50); // 0-100, green zone is 35-65
  const [timer, setTimer] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'idle'>('idle');
  const [showKeeperBtn, setShowKeeperBtn] = useState(false);
  const [lastFood, setLastFood] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const foods = [
    { emoji: '🍎', name: 'Apple', effect: 5, type: 'balanced' },
    { emoji: '🍬', name: 'Candy', effect: 25, type: 'spike' },
    { emoji: '🍞', name: 'Bread', effect: 8, type: 'balanced' },
    { emoji: '🧃', name: 'Juice', effect: 20, type: 'spike' },
    { emoji: '🍗', name: 'Chicken', effect: 3, type: 'balanced' },
    { emoji: '🥦', name: 'Broccoli', effect: 2, type: 'balanced' },
    { emoji: '🍪', name: 'Cookie', effect: 22, type: 'spike' },
    { emoji: '🥛', name: 'Milk', effect: 6, type: 'balanced' },
  ];

  const inGreenZone = gauge >= 35 && gauge <= 65;
  const gaugeColor = gauge > 75 ? '#F59E0B' : gauge < 25 ? '#F59E0B' : '#7FB069';

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startGame = () => {
    setGauge(50);
    setTimer(0);
    setGameState('playing');
    setShowKeeperBtn(false);
    setLastFood('');

    // Timer that counts seconds in green zone
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setGauge(prev => {
        const inZone = prev >= 35 && prev <= 65;
        if (inZone) {
          setTimer(t => {
            if (t >= 29) {
              setGameState('won');
              if (timerRef.current) clearInterval(timerRef.current);
              return 30;
            }
            return t + 1;
          });
        }
        // Gauge naturally drifts slightly
        const drift = (Math.random() - 0.5) * 3;
        return Math.max(5, Math.min(95, prev + drift));
      });
    }, 1000);
  };

  const eatFood = (food: typeof foods[0]) => {
    if (gameState !== 'playing') return;
    setLastFood(`${food.emoji} ${food.name}`);
    if (food.type === 'spike') {
      setGauge(prev => Math.min(95, prev + food.effect));
      setShowKeeperBtn(true);
    } else {
      setGauge(prev => {
        const newVal = prev + food.effect;
        return Math.min(95, Math.max(5, newVal > 65 ? prev + 2 : newVal));
      });
    }
  };

  const useCrystalKeeper = () => {
    setGauge(50);
    setShowKeeperBtn(false);
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Cave background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#14B8A6]/20 via-[#F59E0B]/10 to-[#14B8A6]/30" />
      {/* Crystal shapes */}
      <motion.div className="absolute top-20 left-4 w-3 h-12 bg-[#14B8A6]/30 rotate-[-15deg] rounded-sm"
        animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.div className="absolute top-32 right-8 w-2 h-10 bg-[#F59E0B]/30 rotate-[10deg] rounded-sm"
        animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
      <motion.div className="absolute top-16 right-20 w-2.5 h-8 bg-[#14B8A6]/25 rotate-[-8deg] rounded-sm"
        animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-4">
        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); onBack(); }}
          className="font-display text-sm text-text-muted hover:text-ember mb-4 block min-h-[48px] flex items-center">
          ← Back to Games
        </button>

        <h1 className="text-2xl font-display font-bold text-center mb-1" style={{ color: '#14B8A6' }}>Crystal Balance</h1>
        <p className="text-center font-body text-text-light mb-4 text-sm">Keep the gauge green for 30 seconds!</p>

        {gameState === 'idle' && (
          <div className="text-center mt-12">
            <span className="text-7xl block mb-4">💎</span>
            <Ember message="Balance the sugar crystals! Eat food and use the Crystal Keeper to stay in the green zone." />
            <button onClick={startGame} className="btn-spark btn-primary w-full text-lg mt-6 min-h-[56px]">
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            {/* Timer */}
            <div className="text-center mb-4">
              <span className="font-display font-bold text-2xl" style={{ color: inGreenZone ? '#7FB069' : '#F59E0B' }}>
                {timer}s / 30s
              </span>
              <div className="w-full h-2 rounded-full bg-gray-200 mt-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ width: `${(timer / 30) * 100}%`, background: '#7FB069' }}
                />
              </div>
            </div>

            {/* Gauge */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-48 rounded-2xl overflow-hidden border-2 border-gray-300 bg-gray-100">
                {/* Green zone indicator */}
                <div className="absolute left-0 right-0 border-y-2 border-dashed border-[#7FB069]/50"
                  style={{ top: '35%', bottom: '35%', background: '#7FB06922' }} />
                {/* Gauge fill */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded-b-xl"
                  animate={{ height: `${gauge}%` }}
                  style={{ background: gaugeColor }}
                  transition={{ duration: 0.3 }}
                />
                {/* Level label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-bold text-white text-sm drop-shadow-md">{Math.round(gauge)}</span>
                </div>
              </div>
            </div>

            {lastFood && (
              <p className="text-center font-body text-sm text-text-muted mb-3">Ate: {lastFood}</p>
            )}

            {/* Crystal Keeper button */}
            {showKeeperBtn && gauge > 65 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                onClick={useCrystalKeeper}
                className="btn-spark btn-primary w-full mb-4 text-lg min-h-[56px]"
                style={{ background: 'linear-gradient(135deg, #14B8A6, #F59E0B)' }}
              >
                💎 Tap the Crystal Keeper!
              </motion.button>
            )}

            {/* Food cards */}
            <div className="grid grid-cols-4 gap-2">
              {foods.map(food => (
                <button
                  key={food.name}
                  onClick={() => eatFood(food)}
                  className="spark-card p-3 text-center hover:scale-105 transition-all bg-white/90 min-h-[64px]"
                >
                  <span className="text-2xl block">{food.emoji}</span>
                  <span className="font-body text-[10px] text-text-muted">{food.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {gameState === 'won' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-8"
          >
            {/* Green glow celebration */}
            <motion.div
              className="absolute inset-0 bg-[#7FB069]/20 rounded-3xl"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-7xl block mb-4">💎✨</span>
            <div className="spark-card p-6 bg-white/95">
              <h2 className="font-display font-bold text-2xl text-[#14B8A6] mb-2">Crystal Master!</h2>
              <Ember message="You kept the crystals balanced! You understand how to take care of your body!" expression="celebrating" />
              <button onClick={startGame} className="btn-spark btn-primary mt-4 min-h-[48px]">Play Again</button>
            </div>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

/* ================================================================ */
/*  Memory Match — Enhanced with Power Tools                        */
/* ================================================================ */
function MemoryMatch({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<{ pair: typeof MEMORY_PAIRS[0]; id: number; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [matchedFact, setMatchedFact] = useState('');

  useEffect(() => {
    const deck = [...MEMORY_PAIRS, ...MEMORY_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((pair, i) => ({ pair, id: i, flipped: false, matched: false }));
    setCards(deck);
  }, []);

  const handleFlip = (id: number) => {
    if (selected.length >= 2) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;

    const next = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(next);
    const newSel = [...selected, id];
    setSelected(newSel);

    if (newSel.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSel;
      if (next[a].pair.emoji === next[b].pair.emoji) {
        setMatchedFact(next[a].pair.fact);
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
          setSelected([]);
          const remaining = next.filter(c => !c.matched && c.id !== a && c.id !== b).length;
          if (remaining === 0) setWon(true);
        }, 800);
        setTimeout(() => setMatchedFact(''), 3000);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-4">
        <button onClick={onBack} className="font-display text-sm text-text-muted hover:text-ember mb-4 block min-h-[48px] flex items-center">
          ← Back to Games
        </button>
        <h1 className="text-2xl font-display font-bold text-center text-brave mb-1">Memory Match</h1>
        <p className="text-center font-body text-text-muted mb-4 text-sm">Match the Brave World power tools! Moves: {moves}</p>

        {/* Matched fact popup */}
        <AnimatePresence>
          {matchedFact && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="spark-card p-3 mb-3 text-center border-2 border-brave/30 bg-brave/5"
            >
              <p className="font-body text-sm text-text">✨ {matchedFact}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {cards.map(card => (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center shadow-sm overflow-hidden min-h-[48px]"
              style={{
                background: card.flipped || card.matched
                  ? 'white'
                  : 'linear-gradient(135deg, #5DADE2, #9B72CF)',
                perspective: '600px',
              }}
              animate={{
                rotateY: card.flipped || card.matched ? 180 : 0,
                scale: card.matched ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {(card.flipped || card.matched) ? (
                <div style={{ transform: 'rotateY(180deg)' }} className="flex flex-col items-center">
                  <span className="text-xl">{card.pair.emoji}</span>
                  <span className="text-[7px] font-display font-bold text-text-muted text-center px-0.5 leading-tight mt-0.5">
                    {card.pair.name.split('(')[0].trim()}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-white">?</span>
              )}
            </motion.button>
          ))}
        </div>

        {won && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="spark-card p-5 text-center border-2 border-brave/50">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="font-display font-bold text-brave text-lg">You matched them all!</p>
            <p className="font-body text-text-muted text-sm mt-1">In {moves} moves. Great memory!</p>
            <Ember message="You know all the Power Tools of the Brave World now!" expression="celebrating" />
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

/* ================================================================ */
/*  Ember's Quiz — 10 Questions, Gentle Wrong Answers               */
/* ================================================================ */
function EmberQuiz({ onBack }: { onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[qIdx];
  const isCorrect = selected !== null && selected === q.answer;

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx < QUIZ_QUESTIONS.length - 1) {
        setQIdx(i => i + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-4">
        <button onClick={onBack} className="font-display text-sm text-text-muted hover:text-ember mb-4 block min-h-[48px] flex items-center">
          ← Back to Games
        </button>
        <h1 className="text-2xl font-display font-bold text-center text-dream mb-2">Ember&apos;s Quiz</h1>

        {!done ? (
          <>
            <p className="text-center font-body text-text-muted mb-4">
              Question {qIdx + 1} of {QUIZ_QUESTIONS.length}
            </p>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-dream/20 mb-6 overflow-hidden">
              <div className="h-full rounded-full bg-dream transition-all" style={{ width: `${((qIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
            </div>

            <div className="spark-card p-5 mb-4">
              <p className="font-display font-semibold text-lg text-text text-center">{q.q}</p>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isThisCorrect = i === q.answer;
                const isThisSelected = i === selected;
                let bg = 'white';
                let borderColor = 'transparent';
                if (selected !== null) {
                  if (isThisCorrect) {
                    bg = '#7FB06922';
                    borderColor = '#7FB069';
                  } else if (isThisSelected) {
                    bg = '#F59E0B22'; // gentle amber, NOT red
                    borderColor = '#F59E0B';
                  }
                }
                return (
                  <motion.button key={i} onClick={() => handleAnswer(i)}
                    className="spark-card p-4 w-full text-left font-body transition-all min-h-[52px]"
                    style={{ background: bg, border: selected !== null ? `2px solid ${borderColor}` : '2px solid transparent' }}
                    whileTap={{ scale: 0.98 }}>
                    {opt}
                    {selected !== null && isThisCorrect && (
                      <motion.span className="float-right" initial={{ scale: 0 }} animate={{ scale: [1, 1.3, 1] }}>
                        ✨
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback after answer */}
            <AnimatePresence>
              {selected !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  {isCorrect ? (
                    <div className="spark-card p-4 border-2 border-[#7FB069]/50 bg-[#7FB069]/10">
                      <p className="font-display font-bold text-[#7FB069] text-center mb-1">That&apos;s right! ✨</p>
                      <p className="font-body text-sm text-text text-center">{q.explanation}</p>
                    </div>
                  ) : (
                    <div className="spark-card p-4 border-2 border-[#F59E0B]/50 bg-[#F59E0B]/10">
                      <p className="font-display font-bold text-[#F59E0B] text-center mb-1">Almost! Here&apos;s what it is...</p>
                      <p className="font-body text-sm text-text text-center">{q.explanation}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="spark-card p-6 text-center mt-8">
            <span className="text-5xl block mb-3">🦊</span>
            <p className="font-display font-bold text-xl text-dream">
              {score >= 8 ? 'Amazing!' : score >= 5 ? 'Great job!' : 'Nice try!'}
            </p>
            <p className="font-body text-text mt-2">
              You got <span className="font-bold text-ember">{score}</span> out of {QUIZ_QUESTIONS.length} right!
            </p>
            <Ember message={score >= 8 ? "You're a Brave World genius!" : "Every answer teaches you something new. That's the real win!"} expression={score >= 8 ? 'celebrating' : 'encouraging'} />
            <button onClick={() => { setQIdx(0); setScore(0); setSelected(null); setDone(false); }}
              className="btn-spark btn-primary mt-4 min-h-[48px]">
              Play Again
            </button>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
