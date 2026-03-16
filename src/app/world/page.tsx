'use client';

import { useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Ember, { BottomNav } from '@/components/Ember';
import { BRAVE_LANDS, getLandCompletionPercent, getProfile, type BraveWorldLand } from '@/lib/spark-data';

// Lazy-load the PixiJS game to avoid loading it on the map view
const BraveWorldGame = lazy(() => import('@/components/game/BraveWorldGame'));

/* ---- Land positions on the fantasy map ---- */
const LAND_POSITIONS: Record<string, { top: string; left: string }> = {
  'dragons-breath': { top: '30%', left: '10%' },
  'sugar-crystals': { top: '52%', left: '16%' },
  'thunder-wheels': { top: '26%', left: '50%' },
  'quiet-forest': { top: '42%', left: '72%' },
  'echo-chamber': { top: '16%', left: '30%' },
  'spark-tower': { top: '36%', left: '40%' },
  'kaleidoscope': { top: '58%', left: '48%' },
  'giants-garden': { top: '48%', left: '30%' },
  'shield-fortress': { top: '64%', left: '70%' },
  'brave-heart': { top: '20%', left: '74%' },
  'thought-weaver': { top: '68%', left: '12%' },
  'star-lungs': { top: '8%', left: '56%' },
};

export default function WorldPage() {
  const [mode, setMode] = useState<'map' | 'game' | 'land'>('map');
  const [activeLand, setActiveLand] = useState<BraveWorldLand | null>(null);
  const [hotspot, setHotspot] = useState<string | null>(null);
  const [gameHotspot, setGameHotspot] = useState<{ type: string; landId: string } | null>(null);

  const profile = typeof window !== 'undefined' ? getProfile() : null;
  const collectedSparkles = profile?.collectedSparkles || [];

  const enterLand = (land: BraveWorldLand) => {
    setActiveLand(land);
    setMode('game'); // Try PixiJS game first
    setHotspot(null);
    setGameHotspot(null);
  };

  const backToMap = () => {
    setMode('map');
    setActiveLand(null);
    setHotspot(null);
    setGameHotspot(null);
  };

  const handleGameHotspot = useCallback((type: string, landId: string) => {
    setGameHotspot({ type, landId });
  }, []);

  const handleFallbackToCSS = useCallback(() => {
    setMode('land');
  }, []);

  /* ======== MAP MODE — Full-screen fantasy world ======== */
  if (mode === 'map') {
    return (
      <div className="min-h-screen pb-24 bg-cream">
        {/* Title */}
        <div className="spark-container py-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-1 bg-gradient-to-r from-forest to-brave bg-clip-text text-transparent">
              The Brave World
            </h1>
            <p className="text-center font-body text-text-light mb-2">
              Tap a land to explore!
            </p>
          </motion.div>
        </div>

        {/* Full-width fantasy map */}
        <div className="immersive-scene" style={{ minHeight: '80vh' }}>
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A90D9] via-[#87CEEB] via-[#B0D4E8] to-[#FFB347]" />

          {/* Sun with glow */}
          <div className="absolute top-[4%] right-[10%] w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-spark to-ember"
            style={{ boxShadow: '0 0 40px #FFD166, 0 0 80px #FFD16644' }} />

          {/* Drifting clouds */}
          <div className="absolute top-[6%] text-4xl md:text-5xl opacity-70"
            style={{ animation: 'cloudDrift 35s linear infinite' }}>☁️</div>
          <div className="absolute top-[14%] text-3xl md:text-4xl opacity-50"
            style={{ animation: 'cloudDriftReverse 42s linear infinite', animationDelay: '-15s' }}>☁️</div>
          <div className="absolute top-[22%] text-2xl opacity-40"
            style={{ animation: 'cloudDrift 55s linear infinite', animationDelay: '-30s' }}>☁️</div>

          {/* Distant mountains (blue-gray, soft) */}
          <div className="absolute bottom-[48%] left-[5%] w-0 h-0" style={{
            borderLeft: '120px solid transparent', borderRight: '120px solid transparent',
            borderBottom: '100px solid rgba(100,130,160,0.15)',
          }} />
          <div className="absolute bottom-[46%] right-[10%] w-0 h-0" style={{
            borderLeft: '100px solid transparent', borderRight: '100px solid transparent',
            borderBottom: '80px solid rgba(100,130,160,0.12)',
          }} />
          <div className="absolute bottom-[50%] left-[30%] w-0 h-0" style={{
            borderLeft: '80px solid transparent', borderRight: '80px solid transparent',
            borderBottom: '70px solid rgba(100,130,160,0.1)',
          }} />

          {/* Rolling green hills — multiple layers */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: '60%' }}>
            <div className="absolute bottom-0 left-[-15%] w-[70%] h-[85%] rounded-t-[50%]"
              style={{ background: 'linear-gradient(to top, #5C8F48, #6A9F55)', opacity: 0.5 }} />
            <div className="absolute bottom-0 right-[-12%] w-[65%] h-[80%] rounded-t-[50%]"
              style={{ background: 'linear-gradient(to top, #4A7E3B, #5C8F48)', opacity: 0.6 }} />
            <div className="absolute bottom-0 left-[15%] w-[80%] h-[68%] rounded-t-[45%]"
              style={{ background: 'linear-gradient(to top, #6A9F55, #7FB069)', opacity: 0.7 }} />
            <div className="absolute bottom-0 left-[-5%] w-[110%] h-[55%] rounded-t-[35%]"
              style={{ background: 'linear-gradient(to top, #7FB069, #8BC070)', opacity: 0.85 }} />
          </div>

          {/* Winding golden river/path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
            <path
              d="M500,780 C470,700 350,650 420,580 C490,510 620,540 560,450 C500,360 370,330 450,250 C530,170 650,200 600,120 C550,40 470,60 500,10"
              fill="none"
              stroke="#FFD166"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="18 14"
              opacity="0.5"
            />
          </svg>

          {/* Trees scattered in the landscape */}
          {[
            { left: '3%', bottom: '20%', scale: 0.8 },
            { left: '25%', bottom: '30%', scale: 0.6 },
            { left: '60%', bottom: '25%', scale: 0.7 },
            { left: '85%', bottom: '18%', scale: 0.9 },
            { left: '92%', bottom: '28%', scale: 0.5 },
            { left: '40%', bottom: '15%', scale: 0.6 },
          ].map((t, i) => (
            <div key={`tree-${i}`} className="absolute" style={{ left: t.left, bottom: t.bottom, transform: `scale(${t.scale})` }}>
              <div className="w-4 h-6 rounded-t-full bg-[#5C8F48]" />
              <div className="w-1.5 h-3 bg-amber-800 mx-auto" />
            </div>
          ))}

          {/* Small flowers */}
          {[
            { left: '8%', bottom: '16%', color: '#FF6B8A' },
            { left: '35%', bottom: '22%', color: '#FFD166' },
            { left: '55%', bottom: '14%', color: '#9B72CF' },
            { left: '78%', bottom: '20%', color: '#FF8C42' },
          ].map((f, i) => (
            <div key={`flower-${i}`} className="absolute w-2 h-2 rounded-full" style={{ left: f.left, bottom: f.bottom, background: f.color, opacity: 0.7 }} />
          ))}

          {/* ---- LAND MARKERS — Illustrated, full names, completion % ---- */}
          {BRAVE_LANDS.map((land, i) => {
            const pos = LAND_POSITIONS[land.id] || { top: '50%', left: '50%' };
            const completion = getLandCompletionPercent(land.id, collectedSparkles);
            return (
              <motion.button
                key={land.id}
                className="absolute flex flex-col items-center z-10"
                style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => enterLand(land)}
              >
                <div className="relative">
                  <LandIllustration landId={land.id} colors={land.colors} />
                  {completion > 0 && (
                    <div className="absolute -top-1 -right-1 bg-spark text-night rounded-full w-5 h-5 flex items-center justify-center">
                      <span className="font-display text-[7px] font-bold">{completion}%</span>
                    </div>
                  )}
                </div>
                <span className="font-display text-[10px] md:text-xs font-bold text-white px-2 py-0.5 rounded-full mt-1 whitespace-nowrap"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  }}>
                  {land.name}
                </span>
              </motion.button>
            );
          })}
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ======== GAME MODE — PixiJS explorable world ======== */
  if (mode === 'game' && activeLand) {
    return (
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-night">
            <div className="text-center">
              <motion.div className="text-5xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                {activeLand.emoji}
              </motion.div>
              <p className="font-display text-lg text-spark">Loading {activeLand.name}...</p>
            </div>
          </div>
        }>
          <BraveWorldGame
            landId={activeLand.id}
            onBack={backToMap}
            onOpenHotspot={handleGameHotspot}
          />
        </Suspense>

        {/* Game hotspot modal overlay */}
        <AnimatePresence>
          {gameHotspot && (
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGameHotspot(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -10 }}
                className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                {gameHotspot.type === 'play' && (
                  <>
                    <h3 className="font-display font-bold text-lg mb-3" style={{ color: activeLand.colors[0] }}>
                      🎮 Play
                    </h3>
                    <p className="font-body text-sm text-text mb-4">Ready to play a game in {activeLand.name}?</p>
                    <a href="/games" className="btn-spark btn-primary w-full text-center block">Go to Games</a>
                  </>
                )}
                {gameHotspot.type === 'story' && (
                  <>
                    <h3 className="font-display font-bold text-lg mb-3" style={{ color: activeLand.colors[0] }}>
                      📖 Story Corner
                    </h3>
                    {activeLand.funFacts.map((fact, fi) => (
                      <div key={fi} className="flex items-start gap-2 mb-3">
                        <span className="text-spark mt-0.5 flex-shrink-0">✨</span>
                        <p className="font-body text-sm text-text">{fact}</p>
                      </div>
                    ))}
                  </>
                )}
                {gameHotspot.type === 'heroes' && (
                  <>
                    <h3 className="font-display font-bold text-lg mb-3" style={{ color: activeLand.colors[1] }}>
                      🌟 Famous Heroes
                    </h3>
                    {activeLand.famousPeople.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {activeLand.famousPeople.map(person => (
                          <span key={person} className="px-4 py-2 rounded-full font-display text-sm font-bold shadow-sm"
                            style={{ background: `${activeLand.colors[0]}22`, color: activeLand.colors[0], border: `2px solid ${activeLand.colors[0]}44` }}>
                            🌟 {person}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body text-sm text-text-muted italic">Every kid with {activeLand.condition.toLowerCase()} is a hero — including YOU!</p>
                    )}
                  </>
                )}
                {gameHotspot.type === 'tool' && (
                  <>
                    <h3 className="font-display font-bold text-lg mb-2" style={{ color: activeLand.colors[0] }}>
                      🔧 Power Tool
                    </h3>
                    <div className="flex items-center gap-3 p-4 rounded-2xl"
                      style={{ background: `linear-gradient(135deg, ${activeLand.colors[0]}22, ${activeLand.colors[1]}22)` }}>
                      <span className="text-4xl">⚔️</span>
                      <div>
                        <p className="font-display font-bold text-lg" style={{ color: activeLand.colors[0] }}>{activeLand.toolName}</p>
                        <p className="font-body text-sm text-text-muted">The magical tool of {activeLand.name}</p>
                      </div>
                    </div>
                  </>
                )}
                <button onClick={() => setGameHotspot(null)} className="mt-4 w-full text-center font-display text-sm text-text-muted hover:text-ember transition-colors py-2">
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav />
      </div>
    );
  }

  /* ======== LAND MODE — CSS fallback immersive environment ======== */
  if (!activeLand) return null;

  return (
    <div className="min-h-screen pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLand.id}
          className="min-h-screen relative overflow-hidden"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Layer 1 — Sky: Full gradient specific to land */}
          <LandSky landId={activeLand.id} colors={activeLand.colors} />

          {/* Layer 2 — Far elements: Mountains, distant features */}
          <LandFarElements landId={activeLand.id} colors={activeLand.colors} />

          {/* Layer 3 — Mid elements: Signature feature, LARGE */}
          <LandSignatureFeature landId={activeLand.id} colors={activeLand.colors} />

          {/* Layer 4 — Ground: Terrain at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%]"
            style={{
              background: `linear-gradient(180deg, ${activeLand.colors[0]}44, ${activeLand.colors[0]}88)`,
              borderRadius: '50% 50% 0 0 / 20% 20% 0 0',
            }}>
            <div className="absolute bottom-0 left-0 right-0 h-[60%]"
              style={{ background: `linear-gradient(180deg, transparent, ${activeLand.colors[0]}66)` }} />
          </div>

          {/* Layer 5 — Floating particles: 20 themed particles */}
          <LandParticles landId={activeLand.id} colors={activeLand.colors} />

          {/* Top bar (transparent overlay) */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
            <button onClick={backToMap}
              className="font-display text-sm font-bold text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full min-h-[44px] flex items-center gap-1 transition-colors">
              ← Back to Map
            </button>
          </div>

          {/* Layer 6 — Hotspot buttons: Glass panels floating in the scene */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Play — lower left */}
            <motion.div
              className="absolute pointer-events-auto"
              style={{ bottom: '22%', left: '8%' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/games" className="glass-panel flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24"
                style={{ animation: 'hotspotFloat 3s ease-in-out infinite' }}>
                <span className="text-3xl md:text-4xl">🎮</span>
                <span className="font-display text-xs font-bold text-white mt-1">Play</span>
              </Link>
            </motion.div>

            {/* Story Corner — upper right */}
            <motion.div
              className="absolute pointer-events-auto"
              style={{ top: '25%', right: '8%' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button onClick={() => setHotspot(hotspot === 'story' ? null : 'story')}
                className="glass-panel flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24"
                style={{ animation: 'hotspotFloat 3.5s ease-in-out 0.5s infinite' }}>
                <span className="text-3xl md:text-4xl">📖</span>
                <span className="font-display text-xs font-bold text-white mt-1">Story</span>
              </button>
            </motion.div>

            {/* Famous Heroes — lower right */}
            <motion.div
              className="absolute pointer-events-auto"
              style={{ bottom: '22%', right: '8%' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button onClick={() => setHotspot(hotspot === 'heroes' ? null : 'heroes')}
                className="glass-panel flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24"
                style={{ animation: 'hotspotFloat 3.2s ease-in-out 1s infinite' }}>
                <span className="text-3xl md:text-4xl">🌟</span>
                <span className="font-display text-xs font-bold text-white mt-1">Heroes</span>
              </button>
            </motion.div>

            {/* Power Tool — upper left */}
            <motion.div
              className="absolute pointer-events-auto"
              style={{ top: '25%', left: '8%' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button onClick={() => setHotspot(hotspot === 'tool' ? null : 'tool')}
                className="glass-panel flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24"
                style={{ animation: 'hotspotFloat 2.8s ease-in-out 1.5s infinite' }}>
                <span className="text-3xl md:text-4xl">🔧</span>
                <span className="font-display text-xs font-bold text-white mt-1">Tool</span>
              </button>
            </motion.div>
          </div>

          {/* Layer 7 — Ember at bottom with speech bubble */}
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 mb-2 shadow-lg max-w-[280px]">
              <p className="font-body text-sm text-text text-center">
                Welcome to <strong style={{ color: activeLand.colors[0] }}>{activeLand.name}</strong>!
              </p>
            </div>
            <div style={{ animation: 'emberBounce 3s ease-in-out infinite' }}>
              <div className="w-10 h-7 bg-gradient-to-b from-amber-400 to-orange-500 rounded-[60%_60%_40%_40%] relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-7 bg-gradient-to-b from-amber-300 to-orange-400 rounded-full">
                  <div className="absolute top-2 left-1.5 w-1 h-1 rounded-full bg-night" />
                  <div className="absolute top-2 right-1.5 w-1 h-1 rounded-full bg-night" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-white/80 rounded-b-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Hotspot modals — floating center overlay */}
          <AnimatePresence mode="wait">
            {hotspot && (
              <motion.div
                key={hotspot}
                className="absolute inset-0 z-30 flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setHotspot(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: -10 }}
                  className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 max-w-md w-full shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  {hotspot === 'story' && (
                    <>
                      <h3 className="font-display font-bold text-lg mb-3" style={{ color: activeLand.colors[0] }}>
                        📖 Story Corner
                      </h3>
                      {activeLand.funFacts.map((fact, fi) => (
                        <div key={fi} className="flex items-start gap-2 mb-3">
                          <span className="text-spark mt-0.5 flex-shrink-0">✨</span>
                          <p className="font-body text-sm text-text">{fact}</p>
                        </div>
                      ))}
                    </>
                  )}
                  {hotspot === 'heroes' && (
                    <>
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
                    </>
                  )}
                  {hotspot === 'tool' && (
                    <>
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
                    </>
                  )}
                  <button onClick={() => setHotspot(null)}
                    className="mt-4 w-full text-center font-display text-sm text-text-muted hover:text-ember transition-colors py-2">
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}

/* ============================================================ */
/*  LAND ILLUSTRATIONS for the Map — Distinct visual for each   */
/* ============================================================ */
function LandIllustration({ landId, colors }: { landId: string; colors: [string, string] }) {
  switch (landId) {
    case 'dragons-breath':
      return (
        <div className="relative" style={{ width: 70, height: 56 }}>
          {/* 3 orange/red mountain peaks */}
          <div className="absolute bottom-0 left-0 w-0 h-0" style={{
            borderLeft: '18px solid transparent', borderRight: '18px solid transparent',
            borderBottom: `32px solid ${colors[0]}`,
          }} />
          <div className="absolute bottom-0 left-[20px] w-0 h-0" style={{
            borderLeft: '14px solid transparent', borderRight: '14px solid transparent',
            borderBottom: `26px solid #D4602C`,
          }} />
          <div className="absolute bottom-0 right-0 w-0 h-0" style={{
            borderLeft: '16px solid transparent', borderRight: '16px solid transparent',
            borderBottom: `22px solid ${colors[0]}`, opacity: 0.8,
          }} />
          {/* Animated smoke wisps */}
          <div className="absolute top-0 left-[10px] w-2 h-2 rounded-full bg-gray-400/50"
            style={{ animation: 'smokeRise 3s ease-out infinite' }} />
          <div className="absolute top-[4px] left-[28px] w-1.5 h-1.5 rounded-full bg-gray-400/40"
            style={{ animation: 'smokeRise 3.5s ease-out 0.8s infinite' }} />
          <div className="absolute top-[8px] right-[10px] w-1.5 h-1.5 rounded-full bg-gray-400/30"
            style={{ animation: 'smokeRise 4s ease-out 1.5s infinite' }} />
        </div>
      );
    case 'sugar-crystals':
      return (
        <div className="relative" style={{ width: 60, height: 48 }}>
          {/* Cave entrance (dark half-circle) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-7 rounded-t-full bg-[#1a2a3a]" />
          {/* Sparkle dots around entrance */}
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? colors[0] : '#5DADE2',
                left: `${10 + i * 12}px`, top: `${6 + (i % 3) * 10}px`,
                animation: `sparkle 2s ease-in-out ${i * 0.3}s infinite`,
              }} />
          ))}
        </div>
      );
    case 'thunder-wheels':
      return (
        <div className="relative" style={{ width: 60, height: 44 }}>
          {/* Curved track line */}
          <svg width="60" height="44" viewBox="0 0 60 44">
            <path d="M5,38 Q30,5 55,38" fill="none" stroke={colors[0]} strokeWidth="3" strokeDasharray="4 3" />
          </svg>
          {/* Speed lines */}
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute h-[2px] bg-blue-400/60" style={{
              width: 12 + i * 4, top: `${18 + i * 8}px`, left: `${10 + i * 6}px`,
              animation: `sparkle 1.5s ease-in-out ${i * 0.3}s infinite`,
            }} />
          ))}
        </div>
      );
    case 'quiet-forest':
      return (
        <div className="relative" style={{ width: 64, height: 52 }}>
          {/* 4 overlapping trees */}
          {[
            { left: 4, bottom: 0, w: 14, h: 20, trunk: 6 },
            { left: 16, bottom: 0, w: 16, h: 24, trunk: 8 },
            { left: 30, bottom: 0, w: 12, h: 18, trunk: 6 },
            { left: 42, bottom: 0, w: 14, h: 22, trunk: 7 },
          ].map((t, i) => (
            <div key={i} className="absolute" style={{ left: t.left, bottom: t.bottom }}>
              <div className="rounded-full" style={{ width: t.w, height: t.h, background: `${colors[0]}${['CC', 'AA', 'DD', 'BB'][i]}` }} />
              <div className="mx-auto" style={{ width: 3, height: t.trunk, background: '#8B6F47' }} />
            </div>
          ))}
          {/* Firefly dots */}
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-yellow-300"
              style={{
                left: `${15 + i * 16}px`, top: `${8 + i * 6}px`,
                animation: `twinkle ${1.8 + i * 0.4}s ease-in-out ${i * 0.5}s infinite`,
              }} />
          ))}
        </div>
      );
    case 'echo-chamber':
      return (
        <div className="relative flex items-center justify-center" style={{ width: 56, height: 48 }}>
          {/* Bell/dome shape */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-8 rounded-t-full"
            style={{ background: `${colors[0]}88` }} />
          {/* Concentric expanding rings */}
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute left-1/2 -translate-x-1/2 bottom-4 rounded-full border-2"
              style={{
                width: 16 + i * 8, height: 16 + i * 8,
                borderColor: `${colors[1]}${['88', '55', '33'][i]}`,
                animation: `ringExpand 2.5s ease-out ${i * 0.6}s infinite`,
              }} />
          ))}
        </div>
      );
    case 'spark-tower':
      return (
        <div className="relative" style={{ width: 48, height: 56 }}>
          {/* Tall tower */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-12 rounded-t-sm"
            style={{ background: `${colors[0]}CC` }} />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-3 rounded-sm"
            style={{ background: `${colors[0]}99` }} />
          {/* Lightning bolts */}
          {[0, 1].map(i => (
            <div key={i} className="absolute text-[10px]"
              style={{
                top: `${4 + i * 12}px`, left: `${8 + i * 24}px`,
                animation: `sparkle 0.8s ease-in-out ${i * 0.4}s infinite`,
              }}>⚡</div>
          ))}
        </div>
      );
    case 'kaleidoscope':
      return (
        <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
          <div className="w-10 h-10 rounded-full"
            style={{
              background: `conic-gradient(${colors[0]}, ${colors[1]}, #FFD166, #7FB069, #9B72CF, ${colors[0]})`,
              animation: 'kaleidoRotate 8s linear infinite',
            }} />
        </div>
      );
    case 'giants-garden':
      return (
        <div className="relative" style={{ width: 60, height: 52 }}>
          {/* Oversized flowers */}
          {[
            { left: 5, color: '#FF6B8A', size: 10 },
            { left: 25, color: colors[0], size: 14 },
            { left: 45, color: '#9B72CF', size: 10 },
          ].map((f, i) => (
            <div key={i} className="absolute bottom-0" style={{ left: f.left }}>
              <div className="mx-auto" style={{ width: 3, height: 18 + i * 4, background: '#6B8F3C' }} />
              <div className="rounded-full -mt-2 mx-auto" style={{
                width: f.size, height: f.size, background: f.color,
                marginLeft: (3 - f.size) / 2,
              }} />
            </div>
          ))}
        </div>
      );
    case 'shield-fortress':
      return (
        <div className="relative" style={{ width: 60, height: 48 }}>
          {/* Fortress wall */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-7 rounded-t-sm"
            style={{ background: `${colors[0]}88` }} />
          {/* Turrets */}
          <div className="absolute bottom-7 left-[10px] w-3 h-5" style={{ background: `${colors[0]}AA` }} />
          <div className="absolute bottom-7 right-[10px] w-3 h-5" style={{ background: `${colors[0]}AA` }} />
          {/* Dome */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-6 h-4 rounded-t-full"
            style={{ background: `${colors[1]}66` }} />
        </div>
      );
    case 'brave-heart':
      return (
        <div className="relative" style={{ width: 56, height: 52 }}>
          {/* Castle turrets */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-8 rounded-t-sm"
            style={{ background: `${colors[0]}66` }} />
          <div className="absolute bottom-8 left-[8px] w-2.5 h-5 rounded-t-sm" style={{ background: `${colors[0]}88` }} />
          <div className="absolute bottom-8 right-[8px] w-2.5 h-5 rounded-t-sm" style={{ background: `${colors[0]}88` }} />
          {/* Pulsing heart */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-lg"
            style={{ animation: 'sparkle 1.5s ease-in-out infinite' }}>❤️</div>
        </div>
      );
    case 'thought-weaver':
      return (
        <div className="relative" style={{ width: 52, height: 44 }}>
          {/* Loom frame */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-10 rounded-lg border-2"
            style={{ borderColor: `${colors[0]}88`, background: `${colors[0]}22` }} />
          {/* Thread lines */}
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute h-[1.5px] rounded-full"
              style={{
                background: `${colors[1]}88`, width: 10,
                top: `${16 + i * 6}px`, left: `${18 + i * 2}px`,
                transform: `rotate(${-20 + i * 20}deg)`,
              }} />
          ))}
        </div>
      );
    case 'star-lungs':
      return (
        <div className="relative flex items-center justify-center" style={{ width: 56, height: 48 }}>
          {/* Station dome floating */}
          <motion.div
            className="w-12 h-7 rounded-lg shadow-sm"
            style={{ background: `linear-gradient(135deg, ${colors[0]}AA, ${colors[1]}88)` }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Star dots */}
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute text-[8px]"
              style={{
                left: `${8 + i * 18}px`, top: `${4 + (i % 2) * 8}px`,
                animation: `twinkle ${2 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
              }}>⭐</div>
          ))}
        </div>
      );
    default:
      return <div className="w-10 h-10 rounded-full" style={{ background: `${colors[0]}66` }} />;
  }
}

/* ============================================================ */
/*  LAND ENVIRONMENT Layers                                      */
/* ============================================================ */

function LandSky({ landId, colors }: { landId: string; colors: [string, string] }) {
  const skies: Record<string, string> = {
    'dragons-breath': `linear-gradient(180deg, #1a0a2e 0%, ${colors[0]} 30%, #FFD166 60%, #87CEEB 100%)`,
    'sugar-crystals': `linear-gradient(180deg, #0a1628 0%, #14293f 30%, ${colors[0]}88 60%, #1a3d4d 100%)`,
    'thunder-wheels': `linear-gradient(180deg, #2A3A5C 0%, #4A6FA5 30%, ${colors[0]}66 60%, #87CEEB 100%)`,
    'quiet-forest': `linear-gradient(180deg, #1A2F1A 0%, #2D4A22 30%, #3D6B2E 60%, #7FB069 100%)`,
    'echo-chamber': `linear-gradient(180deg, #1A1428 0%, ${colors[0]}44 30%, ${colors[1]}33 60%, #2A1F3D 100%)`,
    'spark-tower': `linear-gradient(180deg, #1A1428 0%, #2A1F5D 30%, ${colors[0]}66 60%, #87CEEB 100%)`,
    'kaleidoscope': `linear-gradient(180deg, #FF6B8A44 0%, #FFD16644 25%, #7FB06944 50%, #5DADE244 75%, #9B72CF44 100%)`,
    'giants-garden': `linear-gradient(180deg, #87CEEB 0%, #B0D4E8 40%, ${colors[0]}33 70%, #E8F4FD 100%)`,
    'shield-fortress': `linear-gradient(180deg, #FFD16622 0%, #87CEEB 30%, #B0D4E8 60%, ${colors[0]}33 100%)`,
    'brave-heart': `linear-gradient(180deg, #FF6B8A33 0%, #FFB3C1 30%, #FFD4E2 60%, #FFF0F5 100%)`,
    'thought-weaver': `linear-gradient(180deg, #2A1F3D 0%, ${colors[0]}44 30%, ${colors[1]}33 60%, #C4A6D6 100%)`,
    'star-lungs': `linear-gradient(180deg, #0D0D1A 0%, #1A1A3D 30%, ${colors[1]}33 60%, #C0C0C0 100%)`,
  };
  return <div className="absolute inset-0" style={{ background: skies[landId] || `linear-gradient(to bottom, ${colors[0]}88, ${colors[1]}66)` }} />;
}

function LandFarElements({ landId, colors }: { landId: string; colors: [string, string] }) {
  // Render distant features specific to each land
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Generic distant mountains for most lands */}
      {['dragons-breath', 'thunder-wheels', 'shield-fortress', 'giants-garden', 'brave-heart'].includes(landId) && (
        <>
          <div className="absolute bottom-[35%] left-[5%] w-0 h-0 opacity-15" style={{
            borderLeft: '100px solid transparent', borderRight: '100px solid transparent',
            borderBottom: `80px solid ${colors[0]}`,
          }} />
          <div className="absolute bottom-[33%] right-[8%] w-0 h-0 opacity-10" style={{
            borderLeft: '80px solid transparent', borderRight: '80px solid transparent',
            borderBottom: `65px solid ${colors[1]}`,
          }} />
        </>
      )}
      {/* Stars for dark-sky lands */}
      {['sugar-crystals', 'echo-chamber', 'spark-tower', 'thought-weaver', 'star-lungs'].includes(landId) && (
        <>
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                top: `${3 + (i * 7) % 30}%`, left: `${5 + (i * 13) % 90}%`,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
              }} />
          ))}
        </>
      )}
      {/* Clouds for bright-sky lands */}
      {['giants-garden', 'brave-heart', 'shield-fortress', 'kaleidoscope'].includes(landId) && (
        <>
          <div className="absolute top-[8%] text-4xl opacity-50"
            style={{ animation: 'cloudDrift 40s linear infinite' }}>☁️</div>
          <div className="absolute top-[15%] text-3xl opacity-35"
            style={{ animation: 'cloudDriftReverse 50s linear infinite', animationDelay: '-20s' }}>☁️</div>
        </>
      )}
    </div>
  );
}

function LandSignatureFeature({ landId, colors }: { landId: string; colors: [string, string] }) {
  switch (landId) {
    case 'dragons-breath':
      return (
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-[5]">
          {/* Three large mountains */}
          <div className="relative" style={{ width: 340, height: 220 }}>
            <div className="absolute bottom-0 left-[20px] w-0 h-0" style={{
              borderLeft: '70px solid transparent', borderRight: '70px solid transparent',
              borderBottom: '160px solid #8B4513',
            }}>
              <div className="absolute top-0 left-[-40px] w-[80px] h-[40px] bg-gradient-to-b from-white/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-[100px] w-0 h-0" style={{
              borderLeft: '90px solid transparent', borderRight: '90px solid transparent',
              borderBottom: '200px solid #A0522D',
            }} />
            <div className="absolute bottom-0 right-[10px] w-0 h-0" style={{
              borderLeft: '60px solid transparent', borderRight: '60px solid transparent',
              borderBottom: '130px solid #8B6347',
            }} />
            {/* Smoke from peaks */}
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="absolute w-2 h-2 rounded-full bg-gray-300/40"
                style={{
                  left: `${60 + i * 50}px`, top: `${20 + (i % 2) * 30}px`,
                  animation: `smokeRise ${3 + i}s ease-out ${i * 0.5}s infinite`,
                }} />
            ))}
            {/* Friendly dragon (simplified CSS) */}
            <motion.div className="absolute bottom-[10px] right-[40px]"
              animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
              {/* Dragon body — orange oval */}
              <div className="relative">
                <div className="w-14 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-[60%_60%_40%_40%]" />
                {/* Head */}
                <div className="absolute -top-3 -left-2 w-8 h-6 bg-orange-400 rounded-full">
                  <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white">
                    <div className="w-0.5 h-0.5 bg-night rounded-full mt-0.5 ml-0.5" />
                  </div>
                  <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-white">
                    <div className="w-0.5 h-0.5 bg-night rounded-full mt-0.5 ml-0.5" />
                  </div>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 rounded-full bg-orange-300" />
                </div>
                {/* Wings */}
                <div className="absolute -top-4 left-3 w-0 h-0" style={{
                  borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                  borderBottom: '10px solid #F97316', opacity: 0.7,
                }} />
                <div className="absolute -top-3 right-2 w-0 h-0" style={{
                  borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                  borderBottom: '8px solid #F97316', opacity: 0.6,
                }} />
                {/* Tail */}
                <div className="absolute top-1 -right-4 w-5 h-1.5 bg-orange-400 rounded-r-full rotate-[-10deg]" />
              </div>
            </motion.div>
          </div>
        </div>
      );
    case 'sugar-crystals':
      return (
        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 z-[5]">
          <div className="relative" style={{ width: 280, height: 180 }}>
            {/* Large cave entrance */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-28 rounded-t-[50%] bg-[#0a1a2a]" />
            {/* Crystal stalactites */}
            {[
              { left: 40, h: 30, color: colors[0], rotate: -10 },
              { left: 80, h: 45, color: '#5DADE2', rotate: 5 },
              { left: 130, h: 35, color: colors[0], rotate: -5 },
              { left: 170, h: 25, color: colors[1], rotate: 8 },
              { left: 210, h: 40, color: '#14B8A6', rotate: -3 },
            ].map((c, i) => (
              <div key={i} className="absolute top-[30px]" style={{
                left: c.left, width: 6, height: c.h, background: c.color,
                transform: `rotate(${c.rotate}deg)`, borderRadius: '2px 2px 50% 50%',
                animation: `sparkle 2s ease-in-out ${i * 0.3}s infinite`, opacity: 0.8,
              }} />
            ))}
            {/* Sparkle dots around cave */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? colors[0] : '#5DADE2',
                  left: `${20 + (i * 35) % 240}px`, top: `${10 + (i * 23) % 60}px`,
                  animation: `sparkle 1.5s ease-in-out ${i * 0.2}s infinite`,
                }} />
            ))}
          </div>
        </div>
      );
    case 'quiet-forest':
      return (
        <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 z-[5]">
          <div className="relative" style={{ width: 320, height: 200 }}>
            {/* Large trees */}
            {[
              { left: 20, h: 70, w: 50, trunk: 25 },
              { left: 80, h: 90, w: 60, trunk: 30 },
              { left: 155, h: 100, w: 70, trunk: 35 },
              { left: 235, h: 75, w: 55, trunk: 28 },
            ].map((t, i) => (
              <div key={i} className="absolute bottom-0" style={{ left: t.left }}>
                <div className="rounded-full mx-auto" style={{
                  width: t.w, height: t.h,
                  background: `linear-gradient(180deg, ${colors[0]}CC, #5C8F48DD)`,
                }} />
                <div className="mx-auto" style={{
                  width: t.trunk / 3, height: t.trunk, background: '#6B4423',
                  marginTop: -4,
                }} />
              </div>
            ))}
            {/* Firefly dots */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
                style={{
                  left: `${30 + (i * 40) % 260}px`, top: `${20 + (i * 30) % 120}px`,
                  animation: `twinkle ${1.8 + i * 0.3}s ease-in-out ${i * 0.5}s infinite`,
                }} />
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 z-[5]">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, ${colors[0]}44, ${colors[1]}22, transparent)`,
                animation: 'sparkle 3s ease-in-out infinite',
              }} />
            <div className="absolute text-7xl">{
              BRAVE_LANDS.find(l => l.id === landId)?.emoji || '✨'
            }</div>
          </div>
        </div>
      );
  }
}

function LandParticles({ landId, colors }: { landId: string; colors: [string, string] }) {
  const getParticleConfig = () => {
    switch (landId) {
      case 'dragons-breath':
        return { color: '#FF8C42', count: 20, type: 'rise' as const };
      case 'sugar-crystals':
        return { color: '#14B8A6', count: 18, type: 'pulse' as const };
      case 'thunder-wheels':
        return { color: '#3B82F6', count: 15, type: 'pulse' as const };
      case 'quiet-forest':
        return { color: '#7FB069', count: 20, type: 'drift' as const };
      case 'echo-chamber':
        return { color: '#9B72CF', count: 15, type: 'ring' as const };
      case 'spark-tower':
        return { color: '#FFD166', count: 20, type: 'pulse' as const };
      case 'kaleidoscope':
        return { color: '#FF6B8A', count: 22, type: 'drift' as const };
      default:
        return { color: colors[0], count: 15, type: 'pulse' as const };
    }
  };

  const config = getParticleConfig();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[6]">
      {[...Array(config.count)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            background: i % 3 === 0 ? config.color : i % 3 === 1 ? colors[1] : `${config.color}88`,
            left: `${5 + (i * 17) % 90}%`,
            top: `${10 + (i * 23) % 70}%`,
            animation: config.type === 'rise'
              ? `particleRise ${3 + (i % 3)}s ease-out ${i * 0.3}s infinite`
              : config.type === 'drift'
                ? `float ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`
                : `sparkle ${2 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
