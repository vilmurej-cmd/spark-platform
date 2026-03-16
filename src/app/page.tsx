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
    // Determine time of day
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

  /* ---- HOME — Illustrated Landscape ---- */
  const badgeCount = profile?.badges?.length || 0;
  const storyCount = profile?.stories?.length || 0;
  const dailyMessage = EMBER_MESSAGES[Math.floor(Date.now() / 86400000) % EMBER_MESSAGES.length]
    .replace('{name}', profile?.name || 'hero');

  // Time-of-day theming
  const skyGradient = timeOfDay === 'day'
    ? 'from-[#87CEEB] via-[#B0D4E8] to-[#E8F4FD]'
    : timeOfDay === 'sunset'
      ? 'from-[#FF8C42]/60 via-[#9B72CF]/40 to-[#FFD166]/30'
      : 'from-[#1A1428] via-[#2A1F3D] to-[#1A1428]';

  const landscapeItems = [
    { href: '/story', emoji: '📖', label: 'My Story', top: '18%', left: '15%' },
    { href: '/badges', emoji: '🏅', label: 'Badges', top: '15%', left: '78%' },
    { href: '/world', emoji: '🗺️', label: 'Brave World', top: '38%', left: '12%' },
    { href: '/games', emoji: '🎮', label: 'Games', top: '35%', left: '82%' },
    { href: '/campfire', emoji: '🔥', label: 'Campfire', top: '62%', left: '48%' },
    { href: '/letters', emoji: '✉️', label: 'Letters', top: '60%', left: '15%' },
    { href: '/avatar', emoji: '🦸', label: 'Avatar', top: '58%', left: '82%' },
    { href: '/hospital', emoji: '🏥', label: 'Hospital', top: '40%', left: '55%' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: timeOfDay === 'night' ? '#1A1428' : '#FFF8E7' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-lg border-b px-4 py-3"
        style={{
          background: timeOfDay === 'night' ? 'rgba(26,20,40,0.9)' : 'rgba(255,248,231,0.9)',
          borderColor: timeOfDay === 'night' ? 'rgba(255,209,102,0.15)' : 'rgba(255,209,102,0.1)',
        }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦊</span>
            <span className="font-display text-lg font-bold text-ember">SPARK</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/badges" className="text-sm font-display font-bold text-spark">🏅 {badgeCount}</Link>
            <Link href="/parents" className="p-2 rounded-full hover:bg-spark/10 transition-colors">
              <Settings className="h-4 w-4" style={{ color: timeOfDay === 'night' ? '#FFD166' : '#999' }} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* ---- The Brave World Homescape ---- */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl mb-6" style={{ height: 420 }}>
          {/* Sky */}
          <div className={`absolute inset-0 bg-gradient-to-b ${skyGradient}`} />

          {/* Sun/Moon */}
          {timeOfDay === 'night' ? (
            <motion.div
              className="absolute top-6 right-8 w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"
              animate={{ boxShadow: ['0 0 10px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.4)', '0 0 10px rgba(255,255,255,0.3)'] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          ) : (
            <motion.div
              className="absolute top-5 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-spark to-ember"
              animate={{ boxShadow: ['0 0 15px #FFD166', '0 0 30px #FFD166', '0 0 15px #FFD166'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          {/* Stars (night only) */}
          {timeOfDay === 'night' && (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{ top: `${5 + Math.random() * 35}%`, left: `${5 + Math.random() * 90}%` }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </>
          )}

          {/* Clouds */}
          <motion.div className="absolute top-10 text-2xl" style={{ left: '10%' }}
            animate={{ x: [0, 60, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
            {timeOfDay === 'night' ? '' : '☁️'}
          </motion.div>
          <motion.div className="absolute top-16 text-xl" style={{ left: '55%' }}
            animate={{ x: [0, -40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
            {timeOfDay === 'night' ? '' : '☁️'}
          </motion.div>
          <motion.div className="absolute top-6 text-lg" style={{ left: '35%' }}
            animate={{ x: [0, 30, 0] }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}>
            {timeOfDay === 'night' ? '' : '☁️'}
          </motion.div>

          {/* Rolling green hills */}
          <div className="absolute bottom-0 left-0 right-0 h-[45%]">
            <div className="absolute bottom-0 left-[-10%] w-[55%] h-[80%] rounded-t-full"
              style={{ background: timeOfDay === 'night' ? '#2D4A22' : '#7FB069', opacity: 0.5 }} />
            <div className="absolute bottom-0 right-[-8%] w-[50%] h-[70%] rounded-t-full"
              style={{ background: timeOfDay === 'night' ? '#264218' : '#6A9F55', opacity: 0.6 }} />
            <div className="absolute bottom-0 left-[15%] w-[65%] h-[60%] rounded-t-full"
              style={{ background: timeOfDay === 'night' ? '#355E28' : '#8BC070', opacity: 0.7 }} />
          </div>

          {/* Golden winding path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 420" preserveAspectRatio="none">
            <path
              d="M200,400 C180,350 130,320 170,280 C210,240 270,260 240,210 C210,160 150,150 190,110"
              fill="none"
              stroke={timeOfDay === 'night' ? '#FFD16644' : '#FFD16688'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="10 8"
            />
          </svg>

          {/* Landscape nav items */}
          {landscapeItems.map((item, i) => (
            <motion.div
              key={item.href}
              className="absolute"
              style={{ top: item.top, left: item.left, transform: 'translate(-50%, -50%)', zIndex: 10 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 200 }}
            >
              <Link href={item.href} className="flex flex-col items-center group">
                <motion.div
                  className="text-3xl mb-0.5"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
                  whileHover={{ scale: 1.2 }}
                >
                  {item.emoji}
                </motion.div>
                <span className="font-display text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap"
                  style={{
                    background: timeOfDay === 'night' ? 'rgba(26,20,40,0.8)' : 'rgba(255,255,255,0.85)',
                    color: timeOfDay === 'night' ? '#FFD166' : '#1A1428',
                  }}>
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}

          {/* Ember by the campfire */}
          <motion.div
            className="absolute text-3xl"
            style={{ top: '68%', left: '40%', zIndex: 10 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🦊
          </motion.div>

          {/* Campfire glow (brighter at night) */}
          {timeOfDay === 'night' && (
            <motion.div
              className="absolute w-16 h-16 rounded-full"
              style={{ top: '58%', left: '44%', transform: 'translate(-50%, -50%)' }}
              animate={{ boxShadow: ['0 0 20px #FF8C4255', '0 0 40px #FF8C4244', '0 0 20px #FF8C4255'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        {/* Ember daily message */}
        <div className="spark-card p-5 text-center mb-4"
          style={{
            background: timeOfDay === 'night'
              ? 'linear-gradient(135deg, #2A1F3D, #1A1428)'
              : 'linear-gradient(135deg, #FFF8E7, #FFD16622)',
            border: timeOfDay === 'night' ? '2px solid rgba(255,209,102,0.2)' : undefined,
          }}>
          <p className="text-3xl mb-2">🦊</p>
          <p className={`font-body text-sm leading-relaxed italic ${timeOfDay === 'night' ? 'text-amber-100/80' : 'text-text'}`}>
            &ldquo;{dailyMessage}&rdquo;
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 spark-card p-3 text-center"
            style={{
              background: timeOfDay === 'night' ? '#2A1F3D' : 'white',
              border: timeOfDay === 'night' ? '2px solid rgba(255,209,102,0.15)' : undefined,
            }}>
            <span className="text-xl block">🏅</span>
            <span className={`font-display text-lg font-bold ${timeOfDay === 'night' ? 'text-spark' : 'text-ember'}`}>{badgeCount}</span>
            <span className={`block text-xs font-body ${timeOfDay === 'night' ? 'text-amber-100/50' : 'text-text-muted'}`}>Badges</span>
          </div>
          <div className="flex-1 spark-card p-3 text-center"
            style={{
              background: timeOfDay === 'night' ? '#2A1F3D' : 'white',
              border: timeOfDay === 'night' ? '2px solid rgba(255,209,102,0.15)' : undefined,
            }}>
            <span className="text-xl block">📖</span>
            <span className={`font-display text-lg font-bold ${timeOfDay === 'night' ? 'text-spark' : 'text-ember'}`}>{storyCount}</span>
            <span className={`block text-xs font-body ${timeOfDay === 'night' ? 'text-amber-100/50' : 'text-text-muted'}`}>Stories</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
