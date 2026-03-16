'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/Ember';
import { SEED_LETTERS, getProfile, earnBadge } from '@/lib/spark-data';

interface Letter {
  condition: string;
  text: string;
  age: number;
  hearts: number;
  sparkles: number;
  id: string;
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [newLetter, setNewLetter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [childName, setChildName] = useState('');
  const [childCondition, setChildCondition] = useState('');
  const [childAge, setChildAge] = useState(8);
  const [justPosted, setJustPosted] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setChildName(p.name || '');
      setChildCondition(p.condition || 'general');
      setChildAge(p.age || 8);
    }
    // Seed letters with reactions
    setLetters(SEED_LETTERS.map((l, i) => ({
      ...l,
      hearts: Math.floor(Math.random() * 20) + 3,
      sparkles: Math.floor(Math.random() * 15) + 1,
      id: `seed-${i}`,
    })));
  }, []);

  const handleReact = (id: string, type: 'hearts' | 'sparkles') => {
    setLetters(prev => prev.map(l =>
      l.id === id ? { ...l, [type]: l[type] + 1 } : l
    ));
  };

  const handlePost = () => {
    if (!newLetter.trim() || newLetter.length > 200) return;
    const letter: Letter = {
      condition: childCondition || 'general',
      text: newLetter.trim(),
      age: childAge,
      hearts: 0,
      sparkles: 0,
      id: `user-${Date.now()}`,
    };
    setLetters(prev => [letter, ...prev]);
    setNewLetter('');
    setShowForm(false);
    setJustPosted(true);
    earnBadge('letter-writer');
    setTimeout(() => setJustPosted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="spark-container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-center mb-1 bg-gradient-to-r from-heart to-dream bg-clip-text text-transparent">
            Brave Letters
          </h1>
          <p className="text-center font-body text-text-light mb-6">
            Anonymous messages from brave kids to brave kids
          </p>

          {/* Badge notification */}
          <AnimatePresence>
            {justPosted && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="spark-card p-4 mb-4 text-center border-2 border-heart/50">
                <p className="font-display font-semibold text-heart">
                  ✉️ You earned the Brave Letter Writer badge!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Write button */}
          {!showForm && (
            <motion.button onClick={() => setShowForm(true)}
              className="btn-spark btn-primary w-full mb-6 text-lg"
              whileTap={{ scale: 0.97 }}>
              Write a Brave Letter ✉️
            </motion.button>
          )}

          {/* Write form */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                <div className="spark-card p-5">
                  <h2 className="font-display font-semibold text-text mb-3">Your message to other brave kids:</h2>
                  <textarea
                    value={newLetter}
                    onChange={e => setNewLetter(e.target.value.slice(0, 200))}
                    placeholder="Share something encouraging, a tip, or just say hi..."
                    className="w-full h-28 px-4 py-3 rounded-xl border-2 border-spark/30 bg-cream/50 font-body resize-none focus:border-ember focus:outline-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-body text-sm text-text-muted">{newLetter.length}/200</span>
                    <div className="flex gap-2">
                      <button onClick={() => setShowForm(false)}
                        className="btn-spark btn-secondary text-sm py-2 px-4">Cancel</button>
                      <button onClick={handlePost} disabled={!newLetter.trim()}
                        className="btn-spark btn-primary text-sm py-2 px-4 disabled:opacity-40">
                        Send Letter
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Letters */}
          <div className="space-y-4">
            {letters.map((letter, i) => (
              <motion.div key={letter.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="spark-card p-5 relative overflow-hidden">
                {/* Subtle decoration */}
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-heart/5" />

                <p className="font-body text-text text-base leading-relaxed mb-3">
                  {letter.text}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs text-text-muted">
                      age {letter.age} · {letter.condition}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleReact(letter.id, 'hearts')}
                      className="flex items-center gap-1 text-sm font-body hover:scale-110 transition-transform">
                      <span>❤️</span>
                      <span className="text-text-muted">{letter.hearts}</span>
                    </button>
                    <button onClick={() => handleReact(letter.id, 'sparkles')}
                      className="flex items-center gap-1 text-sm font-body hover:scale-110 transition-transform">
                      <span>✨</span>
                      <span className="text-text-muted">{letter.sparkles}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom encouragement */}
          <div className="text-center mt-8">
            <p className="font-display text-text-muted text-sm">
              Every letter makes someone braver 💗
            </p>
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
