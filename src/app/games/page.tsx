'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Ember, { SparkBurst, BottomNav } from '@/components/Ember';
import { getProfile, earnBadge } from '@/lib/spark-data';
import { SFXEngine } from '@/lib/sound';

type GameId = 'breathing' | 'crystal' | 'memory' | 'quiz' | null;

const GAMES = [
  { id: 'breathing' as const, name: 'Dragon Breathing', emoji: '🐉', desc: 'Calm the dragon with your breath', gradient: 'linear-gradient(135deg, #FF8C42, #DC2626)' },
  { id: 'crystal' as const, name: 'Crystal Balance', emoji: '💎', desc: 'Keep the sugar crystals balanced', gradient: 'linear-gradient(135deg, #14B8A6, #06B6D4)' },
  { id: 'memory' as const, name: 'Memory Match', emoji: '🧠', desc: 'Match the brave power tools', gradient: 'linear-gradient(135deg, #FF6B8A, #9B72CF)' },
  { id: 'quiz' as const, name: "Ember's Quiz", emoji: '🦊', desc: 'Health trivia time!', gradient: 'linear-gradient(135deg, #FFD166, #FF8C42)' },
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
      <div className="spark-container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-1 bg-gradient-to-r from-brave to-dream bg-clip-text text-transparent">
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

          {/* Game cards — LARGE with themed gradients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {GAMES.map((game, i) => (
              <motion.button key={game.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleStartGame(game.id)}
                className="relative overflow-hidden rounded-3xl p-8 text-center hover:scale-[1.02] transition-all min-h-[200px] md:min-h-[250px]"
                style={{
                  background: game.gradient,
                  animation: 'borderGlow 3s ease-in-out infinite',
                }}>
                <motion.div
                  className="text-6xl md:text-7xl mb-4"
                  animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  {game.emoji}
                </motion.div>
                <h2 className="font-display font-bold text-xl md:text-2xl text-white">{game.name}</h2>
                <p className="font-body text-sm text-white/80 mt-1">{game.desc}</p>
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
/*  Dragon Breathing Game — FULL-SCREEN Immersive                    */
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
      SFXEngine.gameWin();
      SFXEngine.dragonPurr();
      setTimeout(() => setShowBurst(false), 2000);
      try {
        const prev = parseInt(localStorage.getItem('spark-breathing-sessions') || '0', 10);
        localStorage.setItem('spark-breathing-sessions', String(prev + 1));
      } catch { /* ok */ }
      return;
    }
    setPhase('inhale');
    SFXEngine.breatheIn();
    startCountdown(4);
    timerRef.current = setTimeout(() => {
      setPhase('hold');
      startCountdown(4);
      timerRef.current = setTimeout(() => {
        setPhase('exhale');
        SFXEngine.breatheOut();
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

  const circleSize = phase === 'inhale' ? 250 : phase === 'hold' ? 250 : phase === 'exhale' ? 120 : 150;
  const circleColor = phase === 'inhale' ? '#5DADE2' : phase === 'hold' ? '#9B72CF' : phase === 'exhale' ? '#FFD166' : '#FF8C42';
  const isComplete = cycles >= 4;

  const label = phase === 'inhale'
    ? `Breathe in... ${countdown}`
    : phase === 'hold'
      ? `Hold... ${countdown}`
      : phase === 'exhale'
        ? `Breathe out... ${countdown}`
        : isComplete ? 'The dragon is calm!' : 'Ready?';

  const sessionCount = typeof window !== 'undefined' ? parseInt(localStorage.getItem('spark-breathing-sessions') || '0', 10) : 0;

  // Dragon state
  const dragonAgitated = phase === 'inhale' || (phase === 'idle' && !isComplete);
  const dragonRelaxed = phase === 'exhale' || isComplete;
  const dragonHolding = phase === 'hold';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SparkBurst active={showBurst} />

      {/* FULL VIEWPORT valley scene */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #1a0a2e 0%, #ff6b35 25%, #ffd166 50%, #87ceeb 75%, #B0D4E8 100%)' }} />

      {/* Mountains */}
      <div className="absolute bottom-[28%] left-[5%] w-0 h-0" style={{
        borderLeft: '80px solid transparent', borderRight: '80px solid transparent',
        borderBottom: '140px solid #8B4513',
      }} />
      <div className="absolute bottom-[26%] left-[25%] w-0 h-0" style={{
        borderLeft: '100px solid transparent', borderRight: '100px solid transparent',
        borderBottom: '180px solid #A0522D',
      }} />
      <div className="absolute bottom-[28%] right-[10%] w-0 h-0" style={{
        borderLeft: '70px solid transparent', borderRight: '70px solid transparent',
        borderBottom: '120px solid #8B6347',
      }} />

      {/* Smoke from mountain peaks */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute w-2 h-2 rounded-full bg-gray-300/40"
          style={{
            bottom: `${58 + (i % 2) * 4}%`, left: `${15 + i * 18}%`,
            animation: `smokeRise ${3 + i}s ease-out ${i * 0.6}s infinite`,
          }} />
      ))}

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%]"
        style={{
          background: 'linear-gradient(180deg, #7FB069, #5a8a3c)',
          borderRadius: '50% 50% 0 0 / 20% 20% 0 0',
        }} />

      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <button onClick={() => { clearTimers(); onBack(); }}
          className="font-display text-sm font-bold text-white/90 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full min-h-[44px] flex items-center hover:bg-black/40 transition-colors">
          ← Back to Games
        </button>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1 className="text-xl md:text-2xl font-display font-bold text-white drop-shadow-lg">Dragon Breathing</h1>
      </div>

      {/* Dragon (CSS art) — positioned above the circle */}
      <div className="absolute top-[15%] md:top-[12%] left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={dragonAgitated ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] } : dragonRelaxed ? { y: [0, -3, 0] } : {}}
          transition={dragonAgitated ? { duration: 0.8, repeat: Infinity } : { duration: 4, repeat: Infinity }}
        >
          <div className="relative">
            {/* Dragon body */}
            <div className="w-20 h-12 md:w-28 md:h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-[60%_60%_40%_40%] relative">
              {/* Head */}
              <div className="absolute -top-6 md:-top-8 -left-3 md:-left-4 w-12 md:w-16 h-10 md:h-12 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full">
                {/* Eyes — change based on state */}
                {isComplete ? (
                  <>
                    {/* Closed eyes (sleeping) */}
                    <div className="absolute top-3 md:top-4 left-2 md:left-3 w-2 h-[2px] bg-night rounded-full" />
                    <div className="absolute top-3 md:top-4 right-2 md:right-3 w-2 h-[2px] bg-night rounded-full" />
                  </>
                ) : dragonHolding ? (
                  <>
                    {/* Half-closed eyes */}
                    <div className="absolute top-3 md:top-4 left-2 md:left-3 w-2 h-1.5 bg-white rounded-full overflow-hidden">
                      <div className="absolute bottom-0 w-full h-[60%] bg-night rounded-full" />
                    </div>
                    <div className="absolute top-3 md:top-4 right-2 md:right-3 w-2 h-1.5 bg-white rounded-full overflow-hidden">
                      <div className="absolute bottom-0 w-full h-[60%] bg-night rounded-full" />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Open eyes */}
                    <div className="absolute top-2.5 md:top-3 left-2 md:left-3 w-2.5 md:w-3 h-2.5 md:h-3 bg-white rounded-full">
                      <div className="w-1.5 h-1.5 bg-night rounded-full mt-0.5 ml-0.5" />
                    </div>
                    <div className="absolute top-2.5 md:top-3 right-2 md:right-3 w-2.5 md:w-3 h-2.5 md:h-3 bg-white rounded-full">
                      <div className="w-1.5 h-1.5 bg-night rounded-full mt-0.5 ml-0.5" />
                    </div>
                  </>
                )}
                {/* Nostrils */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-orange-600" />
                  <div className="w-1 h-1 rounded-full bg-orange-600" />
                </div>
              </div>

              {/* Wings — up when agitated, down when relaxed */}
              <motion.div
                className="absolute -top-4 md:-top-6 left-4 md:left-6"
                animate={{ rotate: dragonAgitated ? [-10, -30, -10] : dragonRelaxed ? 10 : -5 }}
                transition={{ duration: dragonAgitated ? 0.5 : 1, repeat: dragonAgitated ? Infinity : 0 }}
              >
                <div className="w-0 h-0" style={{
                  borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
                  borderBottom: '18px solid #F97316', opacity: 0.8,
                }} />
              </motion.div>
              <motion.div
                className="absolute -top-3 md:-top-5 right-3 md:right-5"
                animate={{ rotate: dragonAgitated ? [10, 30, 10] : dragonRelaxed ? -10 : 5 }}
                transition={{ duration: dragonAgitated ? 0.5 : 1, repeat: dragonAgitated ? Infinity : 0 }}
              >
                <div className="w-0 h-0" style={{
                  borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
                  borderBottom: '15px solid #F97316', opacity: 0.7,
                }} />
              </motion.div>

              {/* Tail */}
              <div className="absolute top-2 -right-6 md:-right-8 w-8 md:w-10 h-2 bg-orange-400 rounded-r-full rotate-[-10deg]">
                <div className="absolute right-0 top-[-2px] w-0 h-0" style={{
                  borderLeft: '6px solid #F97316', borderTop: '3px solid transparent', borderBottom: '3px solid transparent',
                }} />
              </div>

              {/* Flame puffs from mouth (visible when agitated, shrink as breathing progresses) */}
              {dragonAgitated && !isComplete && (
                <>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      className="absolute -left-6 md:-left-8 rounded-full"
                      style={{
                        top: `${-8 + i * 4}px`,
                        width: 8 - i * 2, height: 8 - i * 2,
                        background: `radial-gradient(circle, #FF8C42, #FFD166, transparent)`,
                      }}
                      animate={{ x: [-2, -10, -2], opacity: [0.8, 0.3, 0.8], scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </>
              )}

              {/* Zzz when sleeping */}
              {isComplete && (
                <motion.div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <span className="font-display text-white text-sm md:text-base font-bold">💤</span>
                </motion.div>
              )}

              {/* Paws */}
              <div className="absolute -bottom-2 left-2 w-3 h-2 bg-orange-400 rounded-b-full" />
              <div className="absolute -bottom-2 right-2 w-3 h-2 bg-orange-400 rounded-b-full" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Breathing circle — CENTER of screen, 50% width */}
      <div className="absolute inset-0 flex items-center justify-center z-10" style={{ paddingTop: '10vh' }}>
        <div className="relative flex items-center justify-center">
          <motion.div
            className="rounded-full flex items-center justify-center"
            animate={{
              width: circleSize,
              height: circleSize,
            }}
            style={{
              background: `radial-gradient(circle, ${circleColor}55, ${circleColor}22)`,
              border: `4px solid ${circleColor}88`,
              boxShadow: `0 0 30px ${circleColor}33, 0 0 60px ${circleColor}11`,
            }}
            transition={{ duration: phase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
          >
            <div className="text-center">
              <span className="font-display font-bold text-3xl md:text-4xl text-white drop-shadow-lg">
                {countdown > 0 ? countdown : ''}
              </span>
            </div>
          </motion.div>

          {/* Gold particles drifting outward during exhale */}
          {phase === 'exhale' && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div key={i}
                  className="absolute w-2 h-2 rounded-full bg-spark"
                  initial={{ x: 0, y: 0, opacity: 0.8, scale: 0.5 }}
                  animate={{
                    x: Math.cos(i * 0.785) * 120,
                    y: Math.sin(i * 0.785) * 120,
                    opacity: 0, scale: 0,
                  }}
                  transition={{ duration: 3, ease: 'easeOut', repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Label below circle */}
      <div className="absolute bottom-[32%] left-0 right-0 z-10 text-center">
        <motion.p key={phase + countdown} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-display font-bold text-xl md:text-2xl text-white drop-shadow-lg">
          {label}
        </motion.p>
      </div>

      {/* Cycle progress dots */}
      <div className="absolute bottom-[26%] left-0 right-0 z-10 flex justify-center gap-3">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="w-5 h-5 rounded-full"
            style={{
              background: i < cycles ? '#FF8C42' : 'rgba(255,255,255,0.3)',
              border: i < cycles ? '2px solid #FF8C42' : '2px solid rgba(255,255,255,0.3)',
            }}
            animate={i < cycles ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Start/Complete buttons */}
      <div className="absolute bottom-[10%] left-0 right-0 z-10 px-6">
        <div className="max-w-sm mx-auto">
          {!running ? (
            <button onClick={startBreathing} className="btn-spark btn-primary w-full text-lg min-h-[56px]">
              {isComplete ? 'Breathe Again' : 'Start Breathing'}
            </button>
          ) : (
            <p className="text-center font-body text-white/70 text-sm">
              Cycle {Math.min(cycles + 1, 4)} of 4
            </p>
          )}

          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-xl">
              <Ember message="You tamed the dragon! It's sleeping peacefully because of YOU!" expression="celebrating" />
              {sessionCount > 0 && (
                <p className="font-body text-xs text-text-muted mt-2">
                  Total breathing sessions: {sessionCount}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

/* ================================================================ */
/*  Crystal Balance Game — Full-screen cave environment              */
/* ================================================================ */
function CrystalBalance({ onBack }: { onBack: () => void }) {
  const [gauge, setGauge] = useState(50);
  const [timer, setTimer] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'idle'>('idle');
  const [showKeeperBtn, setShowKeeperBtn] = useState(false);
  const [lastFood, setLastFood] = useState('');
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
  const gaugeColor = gauge > 75 ? '#EF4444' : gauge < 25 ? '#EF4444' : inGreenZone ? '#7FB069' : '#F59E0B';

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startGame = () => {
    setGauge(50);
    setTimer(0);
    setGameState('playing');
    setShowKeeperBtn(false);
    setLastFood('');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setGauge(prev => {
        const inZone = prev >= 35 && prev <= 65;
        if (inZone) {
          setTimer(t => {
            if (t >= 29) {
              setGameState('won');
              SFXEngine.gameWin();
              if (timerRef.current) clearInterval(timerRef.current);
              return 30;
            }
            return t + 1;
          });
        }
        const drift = (Math.random() - 0.5) * 3;
        return Math.max(5, Math.min(95, prev + drift));
      });
    }, 1000);
  };

  const eatFood = (food: typeof foods[0]) => {
    if (gameState !== 'playing') return;
    SFXEngine.foodPop();
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
    SFXEngine.crystalPower();
    setGauge(50);
    setShowKeeperBtn(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cave environment — dark teal gradient */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f2937 30%, #14403a 60%, #1a4d4d 100%)' }} />

      {/* Cave ceiling stalactites */}
      {[
        { left: '5%', h: 60, rotate: -5 },
        { left: '20%', h: 45, rotate: 3 },
        { left: '40%', h: 55, rotate: -2 },
        { left: '65%', h: 40, rotate: 4 },
        { left: '85%', h: 50, rotate: -3 },
      ].map((s, i) => (
        <div key={i} className="absolute top-0" style={{
          left: s.left, width: 6, height: s.h,
          background: 'linear-gradient(180deg, #14B8A6, transparent)',
          transform: `rotate(${s.rotate}deg)`, borderRadius: '0 0 50% 50%',
          opacity: 0.3,
        }} />
      ))}

      {/* Sparkle dots in the cave */}
      {[...Array(15)].map((_, i) => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 3 === 0 ? '#14B8A6' : i % 3 === 1 ? '#5DADE2' : '#F59E0B',
            left: `${5 + (i * 7) % 90}%`, top: `${5 + (i * 11) % 85}%`,
            animation: `sparkle ${2 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
          }} />
      ))}

      {/* Top bar */}
      <div className="absolute top-4 left-4 z-20">
        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); onBack(); }}
          className="font-display text-sm font-bold text-white/90 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full min-h-[44px] flex items-center hover:bg-black/40 transition-colors">
          ← Back to Games
        </button>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Title */}
        <div className="text-center pt-16 pb-2">
          <h1 className="text-xl md:text-2xl font-display font-bold text-[#14B8A6] drop-shadow-lg">Crystal Balance</h1>
          <p className="font-body text-white/60 text-sm">Keep the gauge green for 30 seconds!</p>
        </div>

        {gameState === 'idle' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-6">
              <span className="text-8xl block mb-6">💎</span>
              <Ember message="Balance the sugar crystals! Eat food and use the Crystal Keeper to stay in the green zone." />
              <button onClick={startGame} className="btn-spark btn-primary w-full text-lg mt-6 min-h-[56px] max-w-sm mx-auto">
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="flex-1 flex flex-col px-4">
            {/* Timer */}
            <div className="text-center mb-3">
              <span className="font-display font-bold text-2xl" style={{ color: inGreenZone ? '#7FB069' : '#F59E0B' }}>
                {timer}s / 30s
              </span>
              <div className="w-full max-w-sm mx-auto h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ width: `${(timer / 30) * 100}%`, background: '#7FB069' }} />
              </div>
            </div>

            {/* Main game area: gauge on right, crystal in center */}
            <div className="flex-1 flex items-center justify-center gap-6">
              {/* Crystal figure in center */}
              <div className="text-center">
                <motion.div className="text-7xl md:text-8xl"
                  animate={{ scale: inGreenZone ? [1, 1.05, 1] : [1, 0.95, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}>
                  💎
                </motion.div>
                {lastFood && (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="font-body text-sm text-white/60 mt-2">Ate: {lastFood}</motion.p>
                )}
              </div>

              {/* Vertical gauge — full height */}
              <div className="relative w-10 md:w-12 rounded-2xl overflow-hidden border-2 border-white/20 bg-white/5"
                style={{ height: '50vh', maxHeight: 360 }}>
                {/* Green zone indicator */}
                <div className="absolute left-0 right-0 border-y-2 border-dashed border-[#7FB069]/50"
                  style={{ top: '35%', bottom: '35%', background: '#7FB06922' }} />
                {/* Red zones */}
                <div className="absolute top-0 left-0 right-0 h-[20%]" style={{ background: 'rgba(239,68,68,0.15)' }} />
                <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{ background: 'rgba(239,68,68,0.15)' }} />
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

            {/* Crystal Keeper button */}
            {showKeeperBtn && gauge > 65 && (
              <div className="text-center mb-3">
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  onClick={useCrystalKeeper}
                  className="btn-spark text-lg min-h-[56px] px-8"
                  style={{ background: 'linear-gradient(135deg, #14B8A6, #F59E0B)' }}
                >
                  💎 Tap the Crystal Keeper!
                </motion.button>
              </div>
            )}

            {/* Food cards — horizontal scrollable row */}
            <div className="pb-24 pt-2">
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory px-2">
                {foods.map(food => (
                  <button
                    key={food.name}
                    onClick={() => eatFood(food)}
                    className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all snap-center"
                  >
                    <span className="text-3xl md:text-4xl">{food.emoji}</span>
                    <span className="font-body text-[10px] md:text-xs text-white/70 mt-1">{food.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="flex-1 flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md w-full"
            >
              {/* Green glow celebration */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{ background: 'radial-gradient(circle at center, rgba(127,176,105,0.3), transparent)' }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-8xl block mb-4">💎✨</span>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                <h2 className="font-display font-bold text-2xl text-[#14B8A6] mb-2">Crystal Master!</h2>
                <Ember message="You kept the crystals balanced! You understand how to take care of your body!" expression="celebrating" />
                <button onClick={startGame} className="btn-spark btn-primary mt-4 min-h-[48px]">Play Again</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

/* ================================================================ */
/*  Memory Match — Enhanced                                          */
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

    SFXEngine.cardFlip();
    const next = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(next);
    const newSel = [...selected, id];
    setSelected(newSel);

    if (newSel.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSel;
      if (next[a].pair.emoji === next[b].pair.emoji) {
        SFXEngine.correct();
        setMatchedFact(next[a].pair.fact);
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
          setSelected([]);
          const remaining = next.filter(c => !c.matched && c.id !== a && c.id !== b).length;
          if (remaining === 0) { setWon(true); SFXEngine.gameWin(); }
        }, 800);
        setTimeout(() => setMatchedFact(''), 3000);
      } else {
        SFXEngine.wrong();
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="spark-container py-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack} className="font-display text-sm text-text-muted hover:text-ember mb-4 block min-h-[48px] flex items-center">
            ← Back to Games
          </button>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center text-brave mb-1">Memory Match</h1>
          <p className="text-center font-body text-text-muted mb-4 text-sm">Match the Brave World power tools! Moves: {moves}</p>

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

          <div className="grid grid-cols-4 gap-3 mb-6">
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
                    <span className="text-2xl md:text-3xl">{card.pair.emoji}</span>
                    <span className="text-[8px] md:text-[9px] font-display font-bold text-text-muted text-center px-0.5 leading-tight mt-0.5">
                      {card.pair.name.split('(')[0].trim()}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-white">?</span>
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
      </div>
      <BottomNav />
    </div>
  );
}

/* ================================================================ */
/*  Ember's Quiz                                                      */
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
    SFXEngine.buttonTap();
    setSelected(idx);
    if (idx === q.answer) {
      setScore(s => s + 1);
      SFXEngine.correct();
    } else {
      SFXEngine.wrong();
    }
    setTimeout(() => {
      if (qIdx < QUIZ_QUESTIONS.length - 1) {
        setQIdx(i => i + 1);
        setSelected(null);
      } else {
        setDone(true);
        SFXEngine.gameWin();
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="spark-container py-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack} className="font-display text-sm text-text-muted hover:text-ember mb-4 block min-h-[48px] flex items-center">
            ← Back to Games
          </button>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center text-dream mb-2">Ember&apos;s Quiz</h1>

          {!done ? (
            <>
              <p className="text-center font-body text-text-muted mb-4">
                Question {qIdx + 1} of {QUIZ_QUESTIONS.length}
              </p>
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
                      bg = '#F59E0B22';
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
      </div>
      <BottomNav />
    </div>
  );
}
