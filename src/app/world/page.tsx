'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/Ember';
import { BRAVE_LANDS } from '@/lib/spark-data';

export default function WorldPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-center mb-1 bg-gradient-to-r from-forest to-brave bg-clip-text text-transparent">
            The Brave World
          </h1>
          <p className="text-center font-body text-text-light mb-6">
            Every condition has its own magical land. Tap to explore!
          </p>

          <div className="space-y-4">
            {BRAVE_LANDS.map((land, i) => {
              const isOpen = expanded === land.id;
              return (
                <motion.div key={land.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="spark-card overflow-hidden cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : land.id)}>

                  {/* Card header with gradient */}
                  <div className="relative h-32 flex items-center px-5 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${land.colors[0]}44, ${land.colors[1]}44)` }}>
                    {/* Decorative circles */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20"
                      style={{ background: land.colors[0] }} />
                    <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full opacity-15"
                      style={{ background: land.colors[1] }} />

                    <div className="flex items-center gap-4 relative z-10">
                      <motion.div className="text-5xl" animate={{ scale: isOpen ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.5 }}>
                        {land.emoji}
                      </motion.div>
                      <div>
                        <h2 className="font-display font-bold text-lg text-text">{land.name}</h2>
                        <p className="font-body text-sm text-text-light">{land.condition}</p>
                        <p className="font-body text-xs text-text-muted mt-0.5 italic">{land.theme}</p>
                      </div>
                    </div>

                    <motion.div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                      animate={{ rotate: isOpen ? 180 : 0 }}>
                      ▼
                    </motion.div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden">
                        <div className="p-5 space-y-4 border-t-2" style={{ borderColor: `${land.colors[0]}33` }}>
                          {/* Power tool */}
                          <div className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background: `${land.colors[0]}15` }}>
                            <span className="text-2xl">⚔️</span>
                            <div>
                              <p className="font-display font-semibold text-sm text-text">Power Tool</p>
                              <p className="font-body text-sm" style={{ color: land.colors[0] }}>{land.toolName}</p>
                            </div>
                          </div>

                          {/* Fun facts */}
                          <div>
                            <h3 className="font-display font-semibold text-sm text-ember mb-2">Fun Facts</h3>
                            {land.funFacts.map((fact, fi) => (
                              <div key={fi} className="flex items-start gap-2 mb-2">
                                <span className="text-spark mt-0.5">✨</span>
                                <p className="font-body text-sm text-text">{fact}</p>
                              </div>
                            ))}
                          </div>

                          {/* Famous people */}
                          {land.famousPeople.length > 0 && (
                            <div>
                              <h3 className="font-display font-semibold text-sm text-dream mb-2">Famous Brave People</h3>
                              <div className="flex gap-2 flex-wrap">
                                {land.famousPeople.map(person => (
                                  <span key={person}
                                    className="px-3 py-1 rounded-full text-sm font-body border-2"
                                    style={{ borderColor: `${land.colors[1]}66`, color: land.colors[1] }}>
                                    {person}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
