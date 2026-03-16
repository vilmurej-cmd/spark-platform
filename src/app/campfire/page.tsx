'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/Ember';
import {
  CAMPFIRE_QUOTES, CAMPFIRE_JOKES, CAMPFIRE_FACTS, EMBER_MESSAGES, getProfile,
} from '@/lib/spark-data';

function getDayIndex(arr: unknown[]) {
  const d = new Date();
  const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % arr.length;
}

export default function CampfirePage() {
  const [childName, setChildName] = useState('friend');
  const [showJoke, setShowJoke] = useState(false);
  const [factIdx, setFactIdx] = useState(getDayIndex(CAMPFIRE_FACTS));

  useEffect(() => {
    const p = getProfile();
    if (p?.name) setChildName(p.name);
  }, []);

  const quote = CAMPFIRE_QUOTES[getDayIndex(CAMPFIRE_QUOTES)];
  const joke = CAMPFIRE_JOKES[getDayIndex(CAMPFIRE_JOKES)];
  const fact = CAMPFIRE_FACTS[factIdx];
  const emberMsg = EMBER_MESSAGES[getDayIndex(EMBER_MESSAGES)].replace(/{name}/g, childName);

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #1A1428 0%, #2D1F3D 40%, #3D2515 70%, #FF8C4233 100%)' }}>
      <div className="spark-container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Campfire scene */}
          <div className="text-center mb-8 pt-4">
            <motion.div className="text-7xl mb-2"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}>
              🔥
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-spark">The Campfire</h1>
            <p className="font-body text-cream/60 text-sm mt-1">Sit by the fire. You&apos;re safe here.</p>
            {/* Flickering embers */}
            <div className="relative h-6 mt-2">
              {[...Array(6)].map((_, i) => (
                <motion.div key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{ left: `${30 + i * 8}%`, background: ['#FFD166', '#FF8C42', '#FF6B8A'][i % 3] }}
                  animate={{ y: [0, -20, -30], opacity: [0.8, 0.4, 0], scale: [1, 0.6, 0.3] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </div>
          </div>

          {/* Ember's message */}
          <motion.div className="spark-card p-5 mb-5"
            style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,209,102,0.3)' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-start gap-3">
              <motion.div className="text-3xl flex-shrink-0" animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                🦊
              </motion.div>
              <div>
                <h2 className="font-display font-semibold text-spark text-sm mb-1">Ember says...</h2>
                <p className="font-body text-cream/90 leading-relaxed">{emberMsg}</p>
              </div>
            </div>
          </motion.div>

          {/* Daily quote */}
          <motion.div className="spark-card p-5 mb-5 text-center"
            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(155,114,207,0.3)' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="text-2xl mb-2 block">💬</span>
            <p className="font-body text-cream/90 italic text-lg leading-relaxed mb-2">
              &quot;{quote.text}&quot;
            </p>
            <p className="font-display text-spark/70 text-sm">— {quote.author}</p>
          </motion.div>

          {/* Joke */}
          <motion.div className="spark-card p-5 mb-5"
            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,107,138,0.3)' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-heart flex items-center gap-2">
                <span>😄</span> Campfire Joke
              </h2>
              <button onClick={() => setShowJoke(!showJoke)}
                className="btn-spark text-xs py-1.5 px-3 bg-heart/20 text-heart">
                {showJoke ? 'Hide' : 'Tell me!'}
              </button>
            </div>
            {showJoke && (
              <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="font-body text-cream/90 leading-relaxed text-lg">
                {joke}
              </motion.p>
            )}
          </motion.div>

          {/* Fun fact */}
          <motion.div className="spark-card p-5 mb-5"
            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(93,173,226,0.3)' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-brave flex items-center gap-2">
                <span>🧠</span> Did You Know?
              </h2>
              <button onClick={() => setFactIdx((factIdx + 1) % CAMPFIRE_FACTS.length)}
                className="btn-spark text-xs py-1.5 px-3 bg-brave/20 text-brave">
                Another!
              </button>
            </div>
            <motion.p key={factIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-body text-cream/90 leading-relaxed">
              {fact}
            </motion.p>
          </motion.div>

          {/* Goodnight message */}
          <motion.div className="text-center mt-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <p className="font-display text-spark/50 text-sm">
              ✨ The campfire will always be here for you ✨
            </p>
          </motion.div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
