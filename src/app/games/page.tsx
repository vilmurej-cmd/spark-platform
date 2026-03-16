'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/Ember';
import { getProfile, earnBadge } from '@/lib/spark-data';

type GameId = 'breathing' | 'memory' | 'kindness' | 'quiz' | null;

const GAMES = [
  { id: 'breathing' as const, name: 'Dragon Breathing', emoji: '🐉', desc: 'Calm the dragon with your breath', color: '#FF8C42' },
  { id: 'memory' as const, name: 'Memory Match', emoji: '🧠', desc: 'Match the brave emojis', color: '#5DADE2' },
  { id: 'kindness' as const, name: 'Kindness Chain', emoji: '💗', desc: 'Report a kind act', color: '#FF6B8A' },
  { id: 'quiz' as const, name: "Ember's Quiz", emoji: '🦊', desc: 'Health trivia time!', color: '#9B72CF' },
];

const MEMORY_EMOJIS = ['🐉', '💎', '⚡', '🌿', '🔔', '🌈', '🛡️', '❤️'];

const QUIZ_QUESTIONS = [
  { q: 'What organ does an inhaler help?', options: ['Heart', 'Lungs', 'Brain', 'Stomach'], answer: 1 },
  { q: 'What does insulin help control?', options: ['Temperature', 'Blood sugar', 'Heart rate', 'Sleep'], answer: 1 },
  { q: 'How many times does your heart beat per day?', options: ['1,000', '10,000', '100,000', '1,000,000'], answer: 2 },
  { q: 'What famous swimmer has ADHD?', options: ['Michael Phelps', 'Ryan Lochte', 'Katie Ledecky', 'Mark Spitz'], answer: 0 },
  { q: 'Being brave means...', options: ['Never being scared', 'Doing things even when scared', 'Never crying', 'Being alone'], answer: 1 },
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
  if (activeGame === 'memory') return <MemoryMatch onBack={() => setActiveGame(null)} />;
  if (activeGame === 'kindness') return <KindnessChain onBack={() => setActiveGame(null)} />;
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
                className="spark-card p-5 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{game.emoji}</div>
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

/* ---- Dragon Breathing Game ---- */
function DragonBreathing({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ENCOURAGEMENTS = [
    "You're doing great! The dragon is calming down...",
    "Beautiful breathing! Ember is proud of you!",
    "Almost there, brave one. One more breath...",
    "The dragon purrs happily. You did it!",
  ];

  const startBreathing = useCallback(() => {
    setRunning(true);
    setCycles(0);
    runCycle(0);
  }, []);

  const runCycle = (count: number) => {
    if (count >= 4) {
      setPhase('idle');
      setRunning(false);
      return;
    }
    setPhase('inhale');
    timerRef.current = setTimeout(() => {
      setPhase('hold');
      timerRef.current = setTimeout(() => {
        setPhase('exhale');
        timerRef.current = setTimeout(() => {
          setCycles(count + 1);
          runCycle(count + 1);
        }, 4000);
      }, 4000);
    }, 4000);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const circleScale = phase === 'inhale' ? 1.6 : phase === 'hold' ? 1.6 : phase === 'exhale' ? 1 : 1.2;
  const label = phase === 'inhale' ? 'Breathe In...' : phase === 'hold' ? 'Hold...' : phase === 'exhale' ? 'Breathe Out...' : 'Ready?';

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={onBack} className="font-display text-sm text-text-muted hover:text-ember mb-4 block">
          ← Back to Games
        </button>
        <h1 className="text-2xl font-display font-bold text-center text-ember mb-2">Dragon Breathing</h1>
        <p className="text-center font-body text-text-light mb-8">Breathe with the circle to calm the dragon</p>

        <div className="flex items-center justify-center mb-8" style={{ height: 260 }}>
          <motion.div
            className="rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF8C4244, #FFD16644, #5DADE244)', width: 160, height: 160 }}
            animate={{ scale: circleScale }}
            transition={{ duration: 4, ease: 'easeInOut' }}>
            <motion.div
              className="rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF8C4266, #FFD16666)', width: 100, height: 100 }}
              animate={{ scale: circleScale * 0.85 }}
              transition={{ duration: 4, ease: 'easeInOut' }}>
              <span className="text-3xl">{phase === 'idle' ? '🐉' : phase === 'exhale' ? '😮‍💨' : '😌'}</span>
            </motion.div>
          </motion.div>
        </div>

        <motion.p key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center font-display font-bold text-xl text-ember mb-4">
          {label}
        </motion.p>

        {running && (
          <p className="text-center font-body text-text-muted text-sm mb-4">
            {ENCOURAGEMENTS[Math.min(cycles, ENCOURAGEMENTS.length - 1)]}
          </p>
        )}

        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full transition-colors ${i < cycles ? 'bg-ember' : 'bg-spark/30'}`} />
          ))}
        </div>

        {!running ? (
          <button onClick={startBreathing} className="btn-spark btn-primary w-full text-lg">
            {cycles > 0 ? 'Breathe Again' : 'Start Breathing'}
          </button>
        ) : (
          <p className="text-center font-body text-text-muted text-sm">
            Cycle {cycles + 1} of 4
          </p>
        )}

        {cycles >= 4 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="spark-card p-5 mt-6 text-center border-2 border-spark/50">
            <span className="text-4xl block mb-2">🐉✨</span>
            <p className="font-display font-bold text-ember text-lg">The dragon is calm!</p>
            <p className="font-body text-text-muted text-sm mt-1">Great job, brave one. You tamed the dragon.</p>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

/* ---- Memory Match Game ---- */
function MemoryMatch({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<{ emoji: string; id: number; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const emojis = MEMORY_EMOJIS.slice(0, 6);
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ emoji, id: i, flipped: false, matched: false }));
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
      if (next[a].emoji === next[b].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
          setSelected([]);
          if (next.filter(c => !c.matched && c.id !== a && c.id !== b).length === 0) setWon(true);
        }, 500);
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
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={onBack} className="font-display text-sm text-text-muted hover:text-ember mb-4 block">
          ← Back to Games
        </button>
        <h1 className="text-2xl font-display font-bold text-center text-brave mb-2">Memory Match</h1>
        <p className="text-center font-body text-text-muted mb-4">Moves: {moves}</p>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map(card => (
            <motion.button key={card.id} onClick={() => handleFlip(card.id)}
              className="aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm"
              style={{ background: card.flipped || card.matched ? 'white' : 'linear-gradient(135deg, #5DADE2, #9B72CF)' }}
              animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
              transition={{ duration: 0.3 }}>
              {(card.flipped || card.matched) ? card.emoji : '?'}
            </motion.button>
          ))}
        </div>

        {won && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="spark-card p-5 text-center border-2 border-brave/50">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="font-display font-bold text-brave text-lg">You matched them all!</p>
            <p className="font-body text-text-muted text-sm mt-1">In {moves} moves. Great memory!</p>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

/* ---- Kindness Chain Game ---- */
function KindnessChain({ onBack }: { onBack: () => void }) {
  const [acts, setActs] = useState<string[]>([
    'I helped a friend who was feeling sad',
    'I shared my snack with someone at lunch',
    'I told my mom I love her',
  ]);
  const [newAct, setNewAct] = useState('');

  const handleAdd = () => {
    if (!newAct.trim()) return;
    setActs(prev => [newAct.trim(), ...prev]);
    setNewAct('');
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={onBack} className="font-display text-sm text-text-muted hover:text-ember mb-4 block">
          ← Back to Games
        </button>
        <h1 className="text-2xl font-display font-bold text-center text-heart mb-2">Kindness Chain</h1>
        <p className="text-center font-body text-text-light mb-6">Every kind act adds a link to the chain!</p>

        <div className="spark-card p-4 mb-6">
          <textarea value={newAct} onChange={e => setNewAct(e.target.value)}
            placeholder="What kind thing did you do today?"
            className="w-full h-20 px-4 py-3 rounded-xl border-2 border-spark/30 bg-cream/50 font-body resize-none focus:border-heart focus:outline-none" />
          <button onClick={handleAdd} disabled={!newAct.trim()}
            className="btn-spark btn-primary w-full mt-3 disabled:opacity-40">
            Add to Chain 💗
          </button>
        </div>

        <div className="space-y-0">
          {acts.map((act, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-heart to-dream flex items-center justify-center text-white text-sm font-display">
                    💗
                  </div>
                  {i < acts.length - 1 && <div className="w-0.5 h-8 bg-heart/20" />}
                </div>
                <div className="spark-card p-3 flex-1 mb-2">
                  <p className="font-body text-sm text-text">{act}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center font-display text-heart/60 text-sm mt-6">
          {acts.length} links of kindness and counting!
        </p>
      </div>
      <BottomNav />
    </div>
  );
}

/* ---- Ember Quiz Game ---- */
function EmberQuiz({ onBack }: { onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[qIdx];

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
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={onBack} className="font-display text-sm text-text-muted hover:text-ember mb-4 block">
          ← Back to Games
        </button>
        <h1 className="text-2xl font-display font-bold text-center text-dream mb-2">Ember&apos;s Quiz</h1>

        {!done ? (
          <>
            <p className="text-center font-body text-text-muted mb-6">
              Question {qIdx + 1} of {QUIZ_QUESTIONS.length}
            </p>
            <div className="spark-card p-5 mb-4">
              <p className="font-display font-semibold text-lg text-text text-center">{q.q}</p>
            </div>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.answer;
                const isSelected = i === selected;
                let bg = 'white';
                if (selected !== null) {
                  if (isCorrect) bg = '#7FB06933';
                  else if (isSelected) bg = '#FF6B8A33';
                }
                return (
                  <motion.button key={i} onClick={() => handleAnswer(i)}
                    className="spark-card p-4 w-full text-left font-body transition-colors"
                    style={{ background: bg }}
                    whileTap={{ scale: 0.98 }}>
                    {opt}
                    {selected !== null && isCorrect && <span className="float-right">✅</span>}
                    {selected !== null && isSelected && !isCorrect && <span className="float-right">❌</span>}
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="spark-card p-6 text-center mt-8">
            <span className="text-5xl block mb-3">🦊</span>
            <p className="font-display font-bold text-xl text-dream">
              {score >= 4 ? 'Amazing!' : score >= 2 ? 'Great job!' : 'Nice try!'}
            </p>
            <p className="font-body text-text mt-2">
              You got <span className="font-bold text-ember">{score}</span> out of {QUIZ_QUESTIONS.length} right!
            </p>
            <button onClick={() => { setQIdx(0); setScore(0); setSelected(null); setDone(false); }}
              className="btn-spark btn-primary mt-4">
              Play Again
            </button>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
