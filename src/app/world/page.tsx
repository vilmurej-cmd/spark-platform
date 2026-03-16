'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Ember, { BottomNav } from '@/components/Ember';
import { BRAVE_LANDS, type BraveWorldLand } from '@/lib/spark-data';

/* ---- Land positions on the fantasy map ---- */
const LAND_POSITIONS: Record<string, { top: string; left: string }> = {
  'dragons-breath': { top: '32%', left: '8%' },
  'sugar-crystals': { top: '55%', left: '18%' },
  'thunder-wheels': { top: '28%', left: '52%' },
  'quiet-forest': { top: '45%', left: '70%' },
  'echo-chamber': { top: '18%', left: '32%' },
  'spark-tower': { top: '38%', left: '42%' },
  'kaleidoscope': { top: '60%', left: '50%' },
  'giants-garden': { top: '50%', left: '32%' },
  'shield-fortress': { top: '65%', left: '72%' },
  'brave-heart': { top: '22%', left: '72%' },
  'thought-weaver': { top: '70%', left: '10%' },
  'star-lungs': { top: '5%', left: '55%' },
};

export default function WorldPage() {
  const [mode, setMode] = useState<'map' | 'land'>('map');
  const [activeLand, setActiveLand] = useState<BraveWorldLand | null>(null);
  const [hotspot, setHotspot] = useState<string | null>(null);

  const enterLand = (land: BraveWorldLand) => {
    setActiveLand(land);
    setMode('land');
    setHotspot(null);
  };

  const backToMap = () => {
    setMode('map');
    setActiveLand(null);
    setHotspot(null);
  };

  /* ---- MAP MODE ---- */
  if (mode === 'map') {
    return (
      <div className="min-h-screen pb-24 bg-cream">
        <div className="max-w-lg mx-auto px-4 py-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-center mb-1 bg-gradient-to-r from-forest to-brave bg-clip-text text-transparent">
              The Brave World
            </h1>
            <p className="text-center font-body text-text-light mb-4">
              Tap a land to explore!
            </p>
          </motion.div>

          {/* Fantasy World Map */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-xl" style={{ height: 520 }}>
            {/* Sky gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B0D4E8] to-[#FFB347]" />

            {/* Sun */}
            <motion.div
              className="absolute top-4 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-spark to-ember"
              animate={{ boxShadow: ['0 0 20px #FFD166', '0 0 40px #FFD166', '0 0 20px #FFD166'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Drifting clouds */}
            <motion.div className="absolute top-8 text-3xl" style={{ left: '10%' }}
              animate={{ x: [0, 80, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
              ☁️
            </motion.div>
            <motion.div className="absolute top-16 text-2xl" style={{ left: '60%' }}
              animate={{ x: [0, -60, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              ☁️
            </motion.div>
            <motion.div className="absolute top-24 text-xl" style={{ left: '35%' }}
              animate={{ x: [0, 50, 0] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
              ☁️
            </motion.div>

            {/* Rolling hills background */}
            <div className="absolute bottom-0 left-0 right-0 h-[55%]">
              <div className="absolute bottom-0 left-[-10%] w-[60%] h-[90%] rounded-t-full bg-gradient-to-t from-[#6A9F55] to-[#8BC070] opacity-60" />
              <div className="absolute bottom-0 right-[-10%] w-[60%] h-[80%] rounded-t-full bg-gradient-to-t from-[#5C8F48] to-[#7FB069] opacity-70" />
              <div className="absolute bottom-0 left-[20%] w-[70%] h-[70%] rounded-t-full bg-gradient-to-t from-[#7FB069] to-[#95C67E] opacity-80" />
            </div>

            {/* Golden winding path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 520" preserveAspectRatio="none">
              <path
                d="M200,500 C180,440 120,400 160,350 C200,300 280,320 240,260 C200,200 140,180 180,130 C220,80 280,100 260,60"
                fill="none"
                stroke="#FFD166"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="12 8"
                opacity="0.6"
              />
            </svg>

            {/* Land markers */}
            {BRAVE_LANDS.map((land, i) => {
              const pos = LAND_POSITIONS[land.id] || { top: '50%', left: '50%' };
              return (
                <motion.button
                  key={land.id}
                  className="absolute flex flex-col items-center"
                  style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)', zIndex: 10 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => enterLand(land)}
                >
                  {/* Land terrain miniature */}
                  <div className="relative">
                    <LandMiniature landId={land.id} colors={land.colors} />
                    <div className="text-2xl text-center" style={{ marginTop: -4 }}>{land.emoji}</div>
                  </div>
                  <span className="font-display text-[9px] font-bold text-night bg-white/80 px-1.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap shadow-sm max-w-[80px] truncate">
                    {land.name.split(' ')[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ---- LAND MODE ---- */
  if (!activeLand) return null;

  return (
    <div className="min-h-screen pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLand.id}
          className="min-h-screen relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Themed background */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to bottom, ${activeLand.colors[0]}88, ${activeLand.colors[1]}66, ${activeLand.colors[0]}44)`
          }} />

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? activeLand.colors[0] : activeLand.colors[1],
                  left: `${8 + Math.random() * 84}%`,
                  top: `${10 + Math.random() * 80}%`,
                  opacity: 0.4,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          {/* Terrain shapes */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%]">
            <div className="absolute bottom-0 left-[-5%] w-[50%] h-full rounded-t-[50%]"
              style={{ background: `${activeLand.colors[0]}33` }} />
            <div className="absolute bottom-0 right-[-5%] w-[50%] h-[80%] rounded-t-[50%]"
              style={{ background: `${activeLand.colors[1]}33` }} />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-lg mx-auto px-4 pt-4 pb-24">
            {/* Back button */}
            <button onClick={backToMap}
              className="font-display text-sm font-bold text-white/80 hover:text-white mb-4 block bg-black/20 px-4 py-2 rounded-full min-h-[48px] flex items-center">
              ← Back to Map
            </button>

            {/* Ember greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Ember message={`Welcome to ${activeLand.name}!`} expression="celebrating" size="lg" />
            </motion.div>

            {/* Land title */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-6xl block mb-2">{activeLand.emoji}</span>
              <h1 className="font-display text-3xl font-bold text-white drop-shadow-md">{activeLand.name}</h1>
              <p className="font-body text-sm text-white/80 mt-1 italic">{activeLand.theme}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-display font-bold text-white/90 bg-white/20 backdrop-blur-sm">
                {activeLand.condition}
              </span>
            </motion.div>

            {/* Interactive hotspots */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { key: 'play', emoji: '🎮', label: 'Play', href: '/games' },
                { key: 'story', emoji: '📖', label: 'Story Corner', href: null },
                { key: 'heroes', emoji: '🌟', label: 'Famous Heroes', href: null },
                { key: 'tool', emoji: '🔧', label: 'Power Tool', href: null },
              ].map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                >
                  {item.href ? (
                    <Link href={item.href}
                      className="block spark-card p-4 text-center bg-white/90 backdrop-blur-sm hover:scale-105 transition-all min-h-[80px]">
                      <motion.span
                        className="text-3xl block mb-1"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        {item.emoji}
                      </motion.span>
                      <span className="font-display text-sm font-bold text-text">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setHotspot(hotspot === item.key ? null : item.key)}
                      className={`w-full spark-card p-4 text-center backdrop-blur-sm hover:scale-105 transition-all min-h-[80px] ${hotspot === item.key ? 'bg-white border-2' : 'bg-white/90'}`}
                      style={hotspot === item.key ? { borderColor: activeLand.colors[0] } : {}}
                    >
                      <motion.span
                        className="text-3xl block mb-1"
                        animate={{ y: [0, -4, 0], scale: hotspot === item.key ? [1, 1.1, 1] : 1 }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        {item.emoji}
                      </motion.span>
                      <span className="font-display text-sm font-bold text-text">{item.label}</span>
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Hotspot modals */}
            <AnimatePresence mode="wait">
              {hotspot === 'story' && (
                <motion.div
                  key="story-modal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="spark-card p-5 mb-4 bg-white/95 backdrop-blur-sm"
                >
                  <h3 className="font-display font-bold text-lg mb-3" style={{ color: activeLand.colors[0] }}>
                    📖 Story Corner
                  </h3>
                  {activeLand.funFacts.map((fact, fi) => (
                    <div key={fi} className="flex items-start gap-2 mb-3">
                      <span className="text-spark mt-0.5 flex-shrink-0">✨</span>
                      <p className="font-body text-sm text-text">{fact}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {hotspot === 'heroes' && (
                <motion.div
                  key="heroes-modal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="spark-card p-5 mb-4 bg-white/95 backdrop-blur-sm"
                >
                  <h3 className="font-display font-bold text-lg mb-3" style={{ color: activeLand.colors[1] }}>
                    🌟 Famous Heroes
                  </h3>
                  {activeLand.famousPeople.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {activeLand.famousPeople.map(person => (
                        <span key={person}
                          className="px-4 py-2 rounded-full font-display text-sm font-bold shadow-sm"
                          style={{ background: `${activeLand.colors[0]}22`, color: activeLand.colors[0], border: `2px solid ${activeLand.colors[0]}44` }}>
                          🌟 {person}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-sm text-text-muted italic">
                      Every kid with {activeLand.condition.toLowerCase()} is a hero — including YOU!
                    </p>
                  )}
                </motion.div>
              )}

              {hotspot === 'tool' && (
                <motion.div
                  key="tool-modal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="spark-card p-5 mb-4 bg-white/95 backdrop-blur-sm"
                >
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: activeLand.colors[0] }}>
                    🔧 Power Tool
                  </h3>
                  <div className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{ background: `linear-gradient(135deg, ${activeLand.colors[0]}22, ${activeLand.colors[1]}22)` }}>
                    <span className="text-4xl">⚔️</span>
                    <div>
                      <p className="font-display font-bold text-lg" style={{ color: activeLand.colors[0] }}>
                        {activeLand.toolName}
                      </p>
                      <p className="font-body text-sm text-text-muted">
                        The magical tool of {activeLand.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}

/* ---- Mini terrain illustrations for each land on the map ---- */
function LandMiniature({ landId, colors }: { landId: string; colors: [string, string] }) {
  const base = "relative flex items-center justify-center";

  switch (landId) {
    case 'dragons-breath':
      return (
        <div className={base} style={{ width: 48, height: 36 }}>
          {/* Orange mountains */}
          <div className="absolute bottom-0 left-0 w-0 h-0" style={{
            borderLeft: '12px solid transparent', borderRight: '12px solid transparent',
            borderBottom: `20px solid ${colors[0]}`, opacity: 0.7
          }} />
          <div className="absolute bottom-0 right-0 w-0 h-0" style={{
            borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
            borderBottom: `16px solid ${colors[0]}`, opacity: 0.5
          }} />
          {/* Smoke wisps */}
          <motion.div className="absolute top-0 left-3 w-1.5 h-1.5 rounded-full bg-gray-400/50"
            animate={{ y: [0, -6, -12], opacity: [0.5, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <motion.div className="absolute top-2 left-6 w-1 h-1 rounded-full bg-gray-400/40"
            animate={{ y: [0, -5, -10], opacity: [0.4, 0.2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
        </div>
      );
    case 'sugar-crystals':
      return (
        <div className={base} style={{ width: 44, height: 32 }}>
          <div className="absolute bottom-0 w-10 h-5 rounded-t-full" style={{ background: `${colors[0]}66` }} />
          {/* Crystals */}
          <motion.div className="absolute bottom-1 left-3 w-1.5 h-4 rotate-[-10deg]" style={{ background: colors[0] }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.div className="absolute bottom-1 right-3 w-1 h-3 rotate-[15deg]" style={{ background: colors[1] }}
            animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
        </div>
      );
    case 'thunder-wheels':
      return (
        <div className={base} style={{ width: 44, height: 28 }}>
          <div className="absolute bottom-0 w-full h-2 rounded-full" style={{ background: `${colors[0]}66` }} />
          <motion.div className="absolute bottom-1 left-2 text-xs"
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}>⚡</motion.div>
        </div>
      );
    case 'quiet-forest':
      return (
        <div className={base} style={{ width: 48, height: 36 }}>
          {/* Tree canopy */}
          <div className="absolute bottom-0 left-2 w-4 h-4 rounded-full" style={{ background: `${colors[0]}88` }} />
          <div className="absolute bottom-0 right-2 w-3.5 h-3.5 rounded-full" style={{ background: `${colors[0]}77` }} />
          <div className="absolute bottom-1 left-5 w-5 h-5 rounded-full" style={{ background: `${colors[0]}99` }} />
          {/* Fireflies */}
          <motion.div className="absolute top-1 left-4 w-1 h-1 rounded-full bg-yellow-300"
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-yellow-200"
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.7 }} />
        </div>
      );
    case 'echo-chamber':
      return (
        <div className={base} style={{ width: 40, height: 32 }}>
          <div className="absolute bottom-0 w-8 h-5 rounded-t-full" style={{ background: `${colors[0]}55` }} />
          {/* Expanding rings */}
          <motion.div className="absolute bottom-2 w-4 h-4 rounded-full border"
            style={{ borderColor: `${colors[1]}88` }}
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </div>
      );
    case 'spark-tower':
      return (
        <div className={base} style={{ width: 36, height: 40 }}>
          <div className="absolute bottom-0 w-3 h-8 rounded-t-sm" style={{ background: `${colors[0]}99` }} />
          <div className="absolute bottom-8 w-5 h-2 rounded-sm" style={{ background: `${colors[0]}77` }} />
          <motion.div className="absolute top-0 text-[8px]"
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }}>⚡</motion.div>
        </div>
      );
    case 'kaleidoscope':
      return (
        <div className={base} style={{ width: 36, height: 36 }}>
          <motion.div className="w-7 h-7 rounded-full"
            style={{ background: `conic-gradient(${colors[0]}, ${colors[1]}, #FFD166, #7FB069, ${colors[0]})` }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
        </div>
      );
    case 'giants-garden':
      return (
        <div className={base} style={{ width: 44, height: 36 }}>
          <div className="absolute bottom-0 w-1.5 h-4" style={{ background: '#6B8F3C' }} />
          <div className="absolute bottom-4 w-6 h-6 rounded-full" style={{ background: `${colors[0]}88` }} />
          <div className="absolute bottom-5 w-2 h-2 rounded-full" style={{ background: `${colors[1]}` }} />
        </div>
      );
    case 'shield-fortress':
      return (
        <div className={base} style={{ width: 44, height: 32 }}>
          <div className="absolute bottom-0 w-10 h-5 rounded-t-sm" style={{ background: `${colors[0]}66` }} />
          <div className="absolute bottom-5 left-1 w-2 h-3" style={{ background: `${colors[0]}88` }} />
          <div className="absolute bottom-5 right-1 w-2 h-3" style={{ background: `${colors[0]}88` }} />
        </div>
      );
    case 'brave-heart':
      return (
        <div className={base} style={{ width: 40, height: 36 }}>
          <div className="absolute bottom-0 w-8 h-6 rounded-t-sm" style={{ background: `${colors[0]}55` }} />
          <div className="absolute bottom-6 left-1 w-1.5 h-3 rounded-t-sm" style={{ background: `${colors[0]}77` }} />
          <div className="absolute bottom-6 right-1 w-1.5 h-3 rounded-t-sm" style={{ background: `${colors[0]}77` }} />
          <motion.div className="absolute top-0 text-[10px]"
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>❤️</motion.div>
        </div>
      );
    case 'thought-weaver':
      return (
        <div className={base} style={{ width: 40, height: 32 }}>
          <div className="absolute bottom-0 w-8 h-6 rounded-lg" style={{ background: `${colors[0]}44` }} />
          <motion.div className="absolute bottom-2 w-6 h-0.5 rounded-full" style={{ background: `${colors[1]}88` }}
            animate={{ scaleX: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      );
    case 'star-lungs':
      return (
        <div className={base} style={{ width: 40, height: 36 }}>
          <motion.div className="w-8 h-5 rounded-lg shadow-sm"
            style={{ background: `linear-gradient(135deg, ${colors[0]}88, ${colors[1]}66)` }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity }} />
          <motion.div className="absolute top-0 left-2 text-[7px]"
            animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>⭐</motion.div>
        </div>
      );
    default:
      return <div className="w-8 h-8 rounded-full" style={{ background: `${colors[0]}44` }} />;
  }
}
