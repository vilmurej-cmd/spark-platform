'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import Ember, { SparkBurst, BottomNav } from '@/components/Ember';
import { getProfile, saveProfile, CONDITIONS, EMBER_MESSAGES, type SparkProfile } from '@/lib/spark-data';

type Phase = 'oath-intro' | 'oath-name' | 'oath-condition' | 'oath-lines' | 'bloom' | 'home';

const OATH_INTRO_LINES = [
  "Hi there. I'm Ember. I've been waiting for you.",
  "Someone told me you're going through something big. Something that might feel scary sometimes.",
  "Can I tell you a secret? That thing that makes you different? It doesn't make you weaker.",
  "It makes you one of the bravest kids in the whole world.",
  "Ready to find out why? Take The Brave Oath with me:",
];

export default function HomePage() {
  const [profile, setProfile] = useState<SparkProfile | null>(null);
  const [phase, setPhase] = useState<Phase>('oath-intro');
  const [introIdx, setIntroIdx] = useState(0);
  const [oathLineIdx, setOathLineIdx] = useState(0);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number | null>(null);
  const [condition, setCondition] = useState('');
  const [showBurst, setShowBurst] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');

  useEffect(() => {
    const existing = getProfile();
    if (existing?.oathTaken) {
      setProfile(existing);
      setPhase('home');
    }
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) setTimeOfDay('day');
    else if (hour >= 18 && hour < 21) setTimeOfDay('sunset');
    else setTimeOfDay('night');
    setLoaded(true);
  }, []);

  const handleOathIntroTap = () => {
    if (introIdx < OATH_INTRO_LINES.length - 1) {
      setIntroIdx((i) => i + 1);
    } else {
      setPhase('oath-name');
    }
  };

  const handleNameSubmit = () => {
    if (childName.trim().length < 1) return;
    setPhase('oath-condition');
  };

  const handleConditionSubmit = () => {
    if (!condition.trim()) return;
    setPhase('oath-lines');
    setOathLineIdx(0);
  };

  const oathLines = [
    `I am ${childName}.`,
    "I am brave.",
    "I am strong.",
    "I am exactly who I'm supposed to be.",
    `My ${condition.toLowerCase()} doesn't make me weaker — it makes me MIGHTY.`,
    "My treatment isn't a burden — it's my SUPERPOWER.",
    "I am not alone.",
    "And I? I am a HERO.",
  ];

  const handleOathTap = () => {
    if (oathLineIdx < oathLines.length - 1) {
      setOathLineIdx((i) => i + 1);
    } else {
      const newProfile: SparkProfile = {
        name: childName.trim(),
        age: childAge || 7,
        condition: condition.trim(),
        avatarConfig: { bodyType: 'standing', skinTone: '#D4A574', hairStyle: 'short', hairColor: '#3D2C1E', hasGlasses: false, powerTool: 'invisible', capeColor: '#FF8C42', companionType: 'fox' },
        companion: { name: 'Ember Jr.', type: 'fox' },
        badges: ['the-spark'],
        stories: [],
        oathTaken: true,
        createdAt: new Date().toISOString(),
      };
      saveProfile(newProfile);
      setProfile(newProfile);
      setShowBurst(true);
      setPhase('bloom');
      setTimeout(() => { setShowBurst(false); setPhase('home'); }, 3000);
    }
  };

  if (!loaded) return null;

  /* ---- OATH INTRO ---- */
  if (phase === 'oath-intro') {
    return (
      <div className="min-h-screen bg-night flex flex-col items-center justify-center px-6 cursor-pointer select-none" onClick={handleOathIntroTap}>
        <motion.div
          className="w-4 h-4 rounded-full bg-spark mb-12"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5], boxShadow: ['0 0 8px #FFD166', '0 0 24px #FFD166', '0 0 8px #FFD166'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <AnimatePresence mode="wait">
          <motion.div key={introIdx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }} className="text-center max-w-md">
            {introIdx === 0 && (
              <motion.div className="text-5xl mb-6" animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}>🦊</motion.div>
            )}
            <p className="font-body text-xl text-amber-100 leading-relaxed italic">&ldquo;{OATH_INTRO_LINES[introIdx]}&rdquo;</p>
          </motion.div>
        </AnimatePresence>
        <p className="absolute bottom-10 text-amber-100/40 text-sm font-body">Tap to continue</p>
      </div>
    );
  }

  /* ---- OATH NAME ---- */
  if (phase === 'oath-name') {
    return (
      <div className="min-h-screen bg-night flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full max-w-sm">
          <p className="text-5xl mb-6">🦊</p>
          <p className="font-body text-lg text-amber-100 mb-8">&ldquo;First — what&apos;s your name, hero?&rdquo;</p>
          <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Your name" autoFocus className="w-full rounded-2xl bg-white/10 border-2 border-spark/30 px-5 py-4 text-xl text-center text-amber-100 placeholder:text-amber-100/30 focus:outline-none focus:border-spark font-display" />
          <div className="mt-4">
            <p className="text-amber-100/50 text-sm font-body mb-3">How old are you?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                <button key={age} onClick={() => setChildAge(age)} className={`w-10 h-10 rounded-full text-sm font-display font-bold transition-all ${childAge === age ? 'bg-spark text-night scale-110' : 'bg-white/10 text-amber-100/60 hover:bg-white/20'}`}>{age}</button>
              ))}
            </div>
          </div>
          <button onClick={handleNameSubmit} disabled={!childName.trim()} className="mt-8 btn-spark btn-primary w-full disabled:opacity-30">That&apos;s me! →</button>
        </motion.div>
      </div>
    );
  }

  /* ---- OATH CONDITION ---- */
  if (phase === 'oath-condition') {
    return (
      <div className="min-h-screen bg-night flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full max-w-sm">
          <p className="text-5xl mb-6">🦊</p>
          <p className="font-body text-lg text-amber-100 mb-6">&ldquo;Hey {childName}! What&apos;s the thing that makes you extra special?&rdquo;</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CONDITIONS.slice(0, 12).map((c) => (
              <button key={c} onClick={() => setCondition(c)} className={`rounded-full px-3 py-1.5 text-xs font-body transition-all ${condition === c ? 'bg-spark text-night font-bold' : 'bg-white/10 text-amber-100/60 hover:bg-white/20'}`}>{c}</button>
            ))}
          </div>
          <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Or type anything..." className="w-full rounded-2xl bg-white/10 border-2 border-spark/30 px-5 py-3 text-base text-center text-amber-100 placeholder:text-amber-100/30 focus:outline-none focus:border-spark font-body" />
          <button onClick={handleConditionSubmit} disabled={!condition.trim()} className="mt-8 btn-spark btn-primary w-full disabled:opacity-30">Ready for the oath! ✨</button>
        </motion.div>
      </div>
    );
  }

  /* ---- OATH LINES ---- */
  if (phase === 'oath-lines') {
    return (
      <div className="min-h-screen bg-night flex flex-col items-center justify-center px-6 cursor-pointer select-none" onClick={handleOathTap}>
        <div className="text-center max-w-md w-full">
          <p className="font-display text-sm text-spark/60 uppercase tracking-[0.2em] mb-8">The Brave Oath</p>
          {oathLines.slice(0, oathLineIdx + 1).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: i === oathLineIdx ? 1 : 0.4, y: 0 }}
              className={`font-display leading-relaxed mb-3 ${i === oathLineIdx ? 'text-spark' : 'text-amber-100/40'} ${line.includes('MIGHTY') || line.includes('SUPERPOWER') || line.includes('HERO') ? 'text-2xl font-bold' : 'text-xl'}`}
            >
              {line}
            </motion.p>
          ))}
        </div>
        <p className="absolute bottom-10 text-amber-100/30 text-sm font-body">Tap to continue</p>
      </div>
    );
  }

  /* ---- BLOOM ---- */
  if (phase === 'bloom') {
    return (
      <>
        <SparkBurst active={showBurst} />
        <motion.div className="min-h-screen flex flex-col items-center justify-center px-6" initial={{ backgroundColor: '#1A1428' }} animate={{ backgroundColor: '#FFF8E7' }} transition={{ duration: 2.5, ease: 'easeOut' }}>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-center">
            <p className="text-6xl mb-4">✨</p>
            <h1 className="font-display text-4xl font-bold text-ember mb-2">Welcome, {childName}!</h1>
            <p className="font-body text-lg text-text-light">Your first badge: <strong className="text-spark">The Spark ✨</strong></p>
          </motion.div>
        </motion.div>
      </>
    );
  }

  /* ---- HOME — Immersive Illustrated Landscape ---- */
  const badgeCount = profile?.badges?.length || 0;
  const storyCount = profile?.stories?.length || 0;
  const dailyMessage = EMBER_MESSAGES[Math.floor(Date.now() / 86400000) % EMBER_MESSAGES.length]
    .replace('{name}', profile?.name || 'hero');

  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  const landscapeItems = [
    { href: '/story', emoji: '📖', label: 'My Story', top: '16%', left: '14%' },
    { href: '/badges', emoji: '🏅', label: 'Badges', top: '13%', left: '80%' },
    { href: '/world', emoji: '🗺️', label: 'Brave World', top: '35%', left: '10%' },
    { href: '/games', emoji: '🎮', label: 'Games', top: '32%', left: '85%' },
    { href: '/campfire', emoji: '🔥', label: 'Campfire', top: '62%', left: '50%' },
    { href: '/letters', emoji: '✉️', label: 'Letters', top: '58%', left: '14%' },
    { href: '/avatar', emoji: '🦸', label: 'Avatar', top: '55%', left: '85%' },
    { href: '/hospital', emoji: '🏥', label: 'Hospital', top: '38%', left: '55%' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: isNight ? '#1A1428' : '#FFF8E7' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-lg border-b px-4 py-3"
        style={{
          background: isNight ? 'rgba(26,20,40,0.9)' : 'rgba(255,248,231,0.9)',
          borderColor: isNight ? 'rgba(255,209,102,0.15)' : 'rgba(255,209,102,0.1)',
        }}>
        <div className="spark-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦊</span>
            <span className="font-display text-lg font-bold text-ember">SPARK</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/badges" className="text-sm font-display font-bold text-spark">🏅 {badgeCount}</Link>
            <Link href="/parents" className="p-2 rounded-full hover:bg-spark/10 transition-colors">
              <Settings className="h-4 w-4" style={{ color: isNight ? '#FFD166' : '#999' }} />
            </Link>
          </div>
        </div>
      </div>

      {/* ---- IMMERSIVE LANDSCAPE — Full-width, 70vh+ ---- */}
      <div className="immersive-scene" style={{ minHeight: '72vh' }}>
        {/* Sky gradient */}
        <div className="absolute inset-0" style={{
          background: isNight
            ? 'linear-gradient(180deg, #0D0A1A 0%, #1A1428 30%, #2A1F3D 70%, #1A1428 100%)'
            : isSunset
              ? 'linear-gradient(180deg, #FF6B8A 0%, #FF8C42 25%, #FFD166 50%, #87CEEB 80%, #B0D4E8 100%)'
              : 'linear-gradient(180deg, #4A90D9 0%, #87CEEB 25%, #B0D4E8 50%, #E8F4FD 80%, #FFF8E7 100%)',
        }} />

        {/* Sun/Moon */}
        {isNight ? (
          <div className="absolute top-[8%] right-[12%] w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"
            style={{ boxShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)' }}>
            {/* Crater dots */}
            <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-gray-300/50" />
            <div className="absolute top-5 right-2 w-1.5 h-1.5 rounded-full bg-gray-300/40" />
            <div className="absolute bottom-3 left-5 w-1 h-1 rounded-full bg-gray-300/30" />
          </div>
        ) : (
          <div className="absolute top-[6%] right-[12%] w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-spark to-ember"
            style={{ boxShadow: '0 0 40px #FFD166, 0 0 80px #FFD16644' }} />
        )}

        {/* Stars (night) — actual visible dots that twinkle */}
        {isNight && (
          <>
            {[...Array(25)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
                  height: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
                  top: `${3 + (i * 7) % 35}%`,
                  left: `${2 + (i * 13) % 95}%`,
                  animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            ))}
          </>
        )}

        {/* Clouds — drift across the sky (CSS animation for smooth long movement) */}
        {!isNight && (
          <>
            <div className="absolute top-[8%] text-4xl md:text-5xl opacity-80"
              style={{ animation: 'cloudDrift 35s linear infinite', animationDelay: '-5s' }}>☁️</div>
            <div className="absolute top-[15%] text-3xl md:text-4xl opacity-60"
              style={{ animation: 'cloudDriftReverse 42s linear infinite', animationDelay: '-12s' }}>☁️</div>
            <div className="absolute top-[6%] text-2xl md:text-3xl opacity-50"
              style={{ animation: 'cloudDrift 50s linear infinite', animationDelay: '-25s' }}>☁️</div>
            <div className="absolute top-[20%] text-3xl opacity-40"
              style={{ animation: 'cloudDriftReverse 38s linear infinite', animationDelay: '-18s' }}>☁️</div>
          </>
        )}

        {/* Rolling green hills — three layers for depth */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '55%' }}>
          {/* Distant hill */}
          <div className="absolute bottom-0 left-[-15%] w-[70%] h-[85%] rounded-t-[50%]"
            style={{ background: isNight ? '#1E3A16' : '#6A9F55', opacity: 0.4 }} />
          <div className="absolute bottom-0 right-[-12%] w-[65%] h-[75%] rounded-t-[50%]"
            style={{ background: isNight ? '#1B3514' : '#5C8F48', opacity: 0.5 }} />
          {/* Mid hill */}
          <div className="absolute bottom-0 left-[10%] w-[80%] h-[65%] rounded-t-[50%]"
            style={{ background: isNight ? '#264218' : '#7FB069', opacity: 0.65 }} />
          {/* Foreground hill */}
          <div className="absolute bottom-0 left-[-5%] w-[110%] h-[50%] rounded-t-[40%]"
            style={{ background: isNight ? '#2D4A22' : '#8BC070', opacity: 0.8 }} />
        </div>

        {/* Golden winding path — thicker, visible */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
          <path
            d="M500,680 C470,600 380,560 430,480 C480,400 600,420 550,340 C500,260 380,240 440,170 C500,100 600,130 570,80"
            fill="none"
            stroke={isNight ? '#FFD16633' : '#FFD16688'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="16 12"
          />
        </svg>

        {/* Landscape navigation items — LARGE icons with glow */}
        {landscapeItems.map((item, i) => (
          <motion.div
            key={item.href}
            className="absolute z-10"
            style={{ top: item.top, left: item.left, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 200 }}
          >
            <Link href={item.href} className="flex flex-col items-center group">
              <motion.div
                className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center"
                style={{
                  background: isNight ? 'rgba(26,20,40,0.7)' : 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                  animation: 'pulseGlow 3s ease-in-out infinite',
                  animationDelay: `${i * 0.4}s`,
                }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
                whileHover={{ scale: 1.15 }}
              >
                <span className="text-3xl md:text-4xl">{item.emoji}</span>
              </motion.div>
              <span className="font-display text-xs md:text-sm font-bold mt-1 px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{
                  background: isNight ? 'rgba(26,20,40,0.85)' : 'rgba(255,255,255,0.9)',
                  color: isNight ? '#FFD166' : '#1A1428',
                  textShadow: isNight ? 'none' : '0 1px 2px rgba(0,0,0,0.1)',
                }}>
                {item.label}
              </span>
            </Link>
          </motion.div>
        ))}

        {/* Animated campfire flame (CSS art, not emoji) */}
        <div className="absolute z-10" style={{ top: '66%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="relative w-10 h-12">
            {/* Main flame */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-8 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
              style={{
                background: 'radial-gradient(ellipse at bottom, #FF8C42, #FFD166, transparent)',
                animation: 'flicker 0.5s ease-in-out infinite alternate',
              }} />
            {/* Inner flame */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-6 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
              style={{
                background: 'radial-gradient(ellipse at bottom, #FFD166, #FFF8E7, transparent)',
                animation: 'flickerAlt 0.4s ease-in-out infinite alternate',
              }} />
            {/* Glow */}
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-12 h-6 rounded-full"
              style={{ background: 'radial-gradient(ellipse, #FF8C4244, transparent)', filter: 'blur(4px)' }} />
          </div>
          {/* Logs */}
          <div className="flex justify-center gap-0.5 -mt-1">
            <div className="w-6 h-1.5 bg-amber-800 rounded-full rotate-[-15deg]" />
            <div className="w-6 h-1.5 bg-amber-900 rounded-full rotate-[15deg] -ml-2" />
          </div>
        </div>

        {/* Ember the fox — CSS figure, not emoji */}
        <div className="absolute z-10" style={{ top: '68%', left: '43%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ animation: 'emberBounce 3s ease-in-out infinite' }}>
            {/* Fox body */}
            <div className="relative">
              {/* Body */}
              <div className="w-8 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-[60%_60%_40%_40%]" />
              {/* Head */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-6 bg-gradient-to-b from-amber-300 to-orange-400 rounded-full">
                {/* Ears */}
                <div className="absolute -top-2 left-0.5 w-0 h-0" style={{
                  borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
                  borderBottom: '6px solid #F59E0B',
                }} />
                <div className="absolute -top-2 right-0.5 w-0 h-0" style={{
                  borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
                  borderBottom: '6px solid #F59E0B',
                }} />
                {/* Eyes */}
                <div className="absolute top-2 left-1.5 w-1 h-1 rounded-full bg-night" />
                <div className="absolute top-2 right-1.5 w-1 h-1 rounded-full bg-night" />
                {/* Nose */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-1 h-0.5 rounded-full bg-night" />
                {/* White muzzle */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-white/80 rounded-b-full" />
              </div>
              {/* Tail */}
              <div className="absolute -right-3 top-0 w-4 h-2 bg-gradient-to-r from-orange-400 to-amber-300 rounded-full rotate-[-20deg]">
                <div className="absolute right-0 top-0 w-1.5 h-1.5 bg-white/80 rounded-full" />
              </div>
              {/* Paws */}
              <div className="absolute bottom-[-3px] left-1 w-2 h-1.5 bg-orange-400 rounded-b-full" />
              <div className="absolute bottom-[-3px] right-1 w-2 h-1.5 bg-orange-400 rounded-b-full" />
              {/* Bandage on paw */}
              <div className="absolute bottom-[-3px] left-0.5 w-2.5 h-0.5 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Below landscape — Ember message + stats */}
      <div className="spark-container pt-6">
        <div className="max-w-2xl mx-auto">
          {/* Ember daily message */}
          <div className="spark-card p-5 text-center mb-4"
            style={{
              background: isNight
                ? 'linear-gradient(135deg, #2A1F3D, #1A1428)'
                : 'linear-gradient(135deg, #FFF8E7, #FFD16622)',
              border: isNight ? '2px solid rgba(255,209,102,0.2)' : undefined,
            }}>
            <p className="text-3xl mb-2">🦊</p>
            <p className={`font-body text-sm leading-relaxed italic ${isNight ? 'text-amber-100/80' : 'text-text'}`}>
              &ldquo;{dailyMessage}&rdquo;
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 spark-card p-4 text-center"
              style={{
                background: isNight ? '#2A1F3D' : 'white',
                border: isNight ? '2px solid rgba(255,209,102,0.15)' : undefined,
              }}>
              <span className="text-2xl block">🏅</span>
              <span className={`font-display text-xl font-bold ${isNight ? 'text-spark' : 'text-ember'}`}>{badgeCount}</span>
              <span className={`block text-xs font-body ${isNight ? 'text-amber-100/50' : 'text-text-muted'}`}>Badges</span>
            </div>
            <div className="flex-1 spark-card p-4 text-center"
              style={{
                background: isNight ? '#2A1F3D' : 'white',
                border: isNight ? '2px solid rgba(255,209,102,0.15)' : undefined,
              }}>
              <span className="text-2xl block">📖</span>
              <span className={`font-display text-xl font-bold ${isNight ? 'text-spark' : 'text-ember'}`}>{storyCount}</span>
              <span className={`block text-xs font-body ${isNight ? 'text-amber-100/50' : 'text-text-muted'}`}>Stories</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
