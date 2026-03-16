'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import Ember, { SparkBurst, BottomNav } from '@/components/Ember';
import { getProfile, saveProfile, CONDITIONS, type SparkProfile } from '@/lib/spark-data';

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

  useEffect(() => {
    const existing = getProfile();
    if (existing?.oathTaken) {
      setProfile(existing);
      setPhase('home');
    }
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

  /* ---- HOME ---- */
  return (
    <div className="min-h-screen pb-24 bg-cream">
      <div className="sticky top-0 z-30 bg-cream/90 backdrop-blur-lg border-b border-spark/10 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦊</span>
            <span className="font-display text-lg font-bold text-ember">SPARK</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/badges" className="text-sm font-display font-bold text-spark">🏅 {profile?.badges.length || 0}</Link>
            <Link href="/parents" className="p-2 rounded-full hover:bg-spark/10 transition-colors"><Settings className="h-4 w-4 text-text-muted" /></Link>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <Ember message={`Welcome back, ${profile?.name || 'hero'}! I missed you. What do you want to do today?`} />

        <div className="mt-6 rounded-3xl bg-gradient-to-b from-brave/10 via-cream to-forest/10 border-2 border-spark/20 overflow-hidden">
          <div className="h-16 bg-gradient-to-b from-brave/20 to-transparent relative">
            <motion.div className="absolute top-3 left-8 text-2xl" animate={{ x: [0, 10, 0] }} transition={{ duration: 20, repeat: Infinity }}>☁️</motion.div>
            <motion.div className="absolute top-5 right-12 text-lg" animate={{ x: [0, -8, 0] }} transition={{ duration: 15, repeat: Infinity }}>☁️</motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-5">
            {[
              { href: '/story', emoji: '📖', label: 'My Story', desc: 'Create a new adventure', color: 'from-ember/20 to-spark/20' },
              { href: '/badges', emoji: '🏅', label: 'Brave Badges', desc: `${profile?.badges.length || 0} earned`, color: 'from-spark/20 to-amber-100' },
              { href: '/world', emoji: '🗺️', label: 'Brave World', desc: 'Explore the lands', color: 'from-forest/20 to-brave/20' },
              { href: '/games', emoji: '🎮', label: 'Spark Games', desc: 'Play and learn', color: 'from-heart/20 to-dream/20' },
              { href: '/campfire', emoji: '🔥', label: 'The Campfire', desc: 'Quotes & laughs', color: 'from-ember/20 to-heart/20' },
              { href: '/letters', emoji: '✉️', label: 'Brave Letters', desc: 'From other heroes', color: 'from-dream/20 to-brave/20' },
              { href: '/avatar', emoji: '🦸', label: 'My Avatar', desc: 'Design your hero', color: 'from-spark/20 to-ember/20' },
              { href: '/hospital', emoji: '🏥', label: 'Hospital Mode', desc: 'Quick start', color: 'from-brave/20 to-forest/20' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`spark-card bg-gradient-to-br ${item.color} p-4 text-center hover:scale-105 transition-all`}>
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="font-display font-bold text-sm text-text">{item.label}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{item.desc}</p>
              </Link>
            ))}
          </div>

          <div className="h-8 bg-gradient-to-t from-forest/10 to-transparent" />
        </div>

        <div className="mt-6 mb-8 spark-card p-5 text-center bg-gradient-to-br from-amber-50 to-orange-50">
          <p className="text-3xl mb-2">🦊</p>
          <p className="font-body text-sm text-text leading-relaxed italic">&ldquo;Hey {profile?.name}, did I ever tell you that you&apos;re my favorite hero? Because you are. Keep shining. ✨&rdquo;</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
