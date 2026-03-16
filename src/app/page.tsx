'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import Ember, { SparkBurst, BottomNav } from '@/components/Ember';
import {
  getProfile,
  saveProfile,
  CONDITIONS,
  EMBER_MESSAGES,
  processDailyLogin,
  getLevelForXP,
  getXPProgress,
  getNextLevel,
  getActiveEvent,
  isBraveWeek,
  SPECIAL_EMBER_MESSAGES,
  HERO_LEVELS,
  XP_AWARDS,
  awardXP,
  type SparkProfile,
  type DailyReward,
  type HeroLevel,
} from '@/lib/spark-data';
import { useSparkSound } from '@/lib/sound/useSparkSound';
import { SFXEngine, MusicEngine, VoiceEngine } from '@/lib/sound';

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
  const { soundOn, toggleSound } = useSparkSound();

  // Engagement overlay states
  const [showDailySpark, setShowDailySpark] = useState(false);
  const [dailySparkData, setDailySparkData] = useState<{
    streak: number;
    reward: DailyReward;
    dayNumber: number;
    emberMessage: string;
  } | null>(null);
  const [pendingLevelUp, setPendingLevelUp] = useState<{
    oldLevel: HeroLevel;
    newLevel: HeroLevel;
  } | null>(null);

  useEffect(() => {
    const existing = getProfile();
    if (existing?.oathTaken) {
      setProfile(existing);
      setPhase('home');

      // Process daily login
      const loginResult = processDailyLogin(existing);
      if (loginResult.isNewDay) {
        const specialMsg =
          SPECIAL_EMBER_MESSAGES[
            Math.floor(Math.random() * SPECIAL_EMBER_MESSAGES.length)
          ].replace('{name}', existing.name || 'hero');
        setDailySparkData({
          streak: loginResult.streak,
          reward: loginResult.reward,
          dayNumber: loginResult.streak,
          emberMessage: specialMsg,
        });
        setShowDailySpark(true);
        // Re-read profile after processDailyLogin saved it
        const updated = getProfile();
        if (updated) setProfile(updated);
      }
    }
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) setTimeOfDay('day');
    else if (hour >= 18 && hour < 21) setTimeOfDay('sunset');
    else setTimeOfDay('night');
    setLoaded(true);
  }, []);

  // Start/stop home music based on phase and sound
  useEffect(() => {
    if (phase === 'home' && soundOn && !showDailySpark && !pendingLevelUp) {
      MusicEngine.playTheme('home', timeOfDay === 'night');
    }
    return () => {
      if (phase !== 'home') MusicEngine.stopMusic();
    };
  }, [phase, soundOn, timeOfDay, showDailySpark, pendingLevelUp]);

  const handleCollectDailySpark = useCallback(() => {
    setShowDailySpark(false);
    setDailySparkData(null);
    SFXEngine.coinCollect();
  }, []);

  const triggerLevelUp = useCallback(
    (oldLevel: HeroLevel, newLevel: HeroLevel) => {
      setPendingLevelUp({ oldLevel, newLevel });
      setShowBurst(true);
      SFXEngine.levelUp();
      setTimeout(() => {
        setShowBurst(false);
      }, 3000);
    },
    []
  );

  const handleDismissLevelUp = useCallback(() => {
    setPendingLevelUp(null);
  }, []);

  const handleOathIntroTap = () => {
    if (introIdx === 0) SFXEngine.oathSparkAppear();
    SFXEngine.oathIntroTap(introIdx);
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
      SFXEngine.oathReveal(oathLineIdx + 1);
    } else {
      SFXEngine.oathReveal(7); // final "HERO" line — full musical climax
      const newProfile: SparkProfile = {
        name: childName.trim(),
        age: childAge || 7,
        condition: condition.trim(),
        avatarConfig: {
          bodyType: 'standing',
          skinTone: '#D4A574',
          hairStyle: 'short',
          hairColor: '#3D2C1E',
          hasGlasses: false,
          powerTool: 'invisible',
          capeColor: '#FF8C42',
          companionType: 'fox',
        },
        companion: { name: 'Ember Jr.', type: 'fox' },
        badges: ['the-spark'],
        stories: [],
        oathTaken: true,
        createdAt: new Date().toISOString(),
        // Engagement fields initialized
        sparkCoins: 10, // Welcome bonus
        xp: 0,
        level: 1,
        loginStreak: 1,
        lastLoginDate: new Date().toISOString().split('T')[0],
        collectedSparkles: [],
        exploredLands: [],
        unlockedCosmetics: [],
        landCollectibles: {},
      };

      // Award 100 XP for the oath
      const xpResult = awardXP(newProfile, XP_AWARDS.OATH);
      saveProfile(newProfile);
      setProfile(newProfile);
      setShowBurst(true);
      setPhase('bloom');

      setTimeout(() => {
        setShowBurst(false);
        setPhase('home');
        // Check if the oath XP caused a level up
        if (xpResult.leveled) {
          const oldLvl = HERO_LEVELS.find((l) => l.level === xpResult.oldLevel) || HERO_LEVELS[0];
          const newLvl = HERO_LEVELS.find((l) => l.level === xpResult.newLevel) || HERO_LEVELS[1];
          triggerLevelUp(oldLvl, newLvl);
        }
      }, 3000);
    }
  };

  if (!loaded) return null;

  /* ---- DAILY SPARK OVERLAY ---- */
  if (showDailySpark && dailySparkData) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          background:
            'radial-gradient(ellipse at center, #FFD166 0%, #FF8C42 40%, #1A1428 100%)',
        }}
      >
        <SparkBurst active={true} />

        {/* Sparkle particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`ds-sparkle-${i}`}
            className="absolute text-2xl"
            initial={{
              opacity: 0,
              x: 0,
              y: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.cos((i * Math.PI * 2) / 12) * 120,
              y: Math.sin((i * Math.PI * 2) / 12) * 120,
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 2,
              delay: 0.3 + i * 0.1,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            {i % 3 === 0 ? '✨' : i % 3 === 1 ? '🌟' : '⭐'}
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="text-center"
        >
          <motion.p
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {dailySparkData.reward.emoji}
          </motion.p>

          <h1 className="font-display text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Your Daily Spark!
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-display text-xl text-amber-100 mb-1">
              Day {dailySparkData.dayNumber}
            </p>
            <p className="font-body text-lg text-amber-200 mb-4">
              {dailySparkData.streak >= 7
                ? `${dailySparkData.streak} Day Streak! Amazing!`
                : dailySparkData.streak >= 3
                ? `${dailySparkData.streak} Day Streak! Keep going!`
                : `Streak: ${dailySparkData.streak}`}
            </p>
          </motion.div>

          {/* Reward card */}
          <motion.div
            className="bg-white/20 backdrop-blur-md rounded-2xl p-5 mb-6 border border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-3xl mb-2">{dailySparkData.reward.emoji}</p>
            <p className="font-display text-lg font-bold text-white">
              {dailySparkData.reward.description}
            </p>
          </motion.div>

          {/* Ember message */}
          <motion.div
            className="bg-night/30 backdrop-blur-sm rounded-xl p-4 mb-6 max-w-xs mx-auto border border-amber-100/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-xl mb-1">🦊</p>
            <p className="font-body text-sm text-amber-100 italic leading-relaxed">
              &ldquo;{dailySparkData.emberMessage}&rdquo;
            </p>
          </motion.div>

          {/* Collect button */}
          <motion.button
            className="btn-spark btn-primary px-10 py-4 text-xl font-display font-bold rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCollectDailySpark}
          >
            Collect! ✨
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  /* ---- LEVEL UP OVERLAY ---- */
  if (pendingLevelUp) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          background:
            'radial-gradient(ellipse at center, #9B72CF 0%, #5B3A8C 40%, #1A1428 100%)',
        }}
      >
        <SparkBurst active={showBurst} />

        {/* Level transition animation */}
        <motion.div className="text-center">
          {/* Old level fading out */}
          <motion.div
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{ opacity: 0, scale: 0.5, y: -60 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <p className="font-display text-6xl font-bold text-white/60">
                {pendingLevelUp.oldLevel.level}
              </p>
              <p className="font-body text-lg text-white/40">
                {pendingLevelUp.oldLevel.title}
              </p>
            </div>
          </motion.div>

          {/* New level appearing */}
          <motion.div
            initial={{ opacity: 0, scale: 2, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, type: 'spring', stiffness: 150 }}
          >
            <motion.p
              className="text-5xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              🎉
            </motion.p>

            <h1 className="font-display text-3xl font-bold text-white mb-2 drop-shadow-lg">
              LEVEL UP!
            </h1>

            <motion.div
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span className="font-display text-2xl text-white/50">
                Lv.{pendingLevelUp.oldLevel.level}
              </span>
              <motion.span
                className="text-3xl"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                ➡️
              </motion.span>
              <span className="font-display text-4xl font-bold text-spark drop-shadow-lg">
                Lv.{pendingLevelUp.newLevel.level}
              </span>
            </motion.div>

            <motion.p
              className="font-display text-2xl font-bold text-amber-200 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              {pendingLevelUp.newLevel.title}
            </motion.p>

            {/* Unlock reveal */}
            {pendingLevelUp.newLevel.unlock && (
              <motion.div
                className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-6 border border-spark/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, type: 'spring' }}
              >
                <p className="text-2xl mb-1">🔓</p>
                <p className="font-display text-sm font-bold text-spark">
                  NEW UNLOCK
                </p>
                <p className="font-body text-base text-white">
                  {pendingLevelUp.newLevel.unlock}
                </p>
              </motion.div>
            )}

            {/* Ember congrats */}
            <motion.div
              className="bg-night/30 backdrop-blur-sm rounded-xl p-4 mb-6 max-w-xs mx-auto border border-amber-100/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <p className="text-xl mb-1">🦊</p>
              <p className="font-body text-sm text-amber-100 italic leading-relaxed">
                &ldquo;Look at you, growing stronger every day! Level{' '}
                {pendingLevelUp.newLevel.level} looks good on you!&rdquo;
              </p>
            </motion.div>

            <motion.button
              className="btn-spark btn-primary px-10 py-4 text-xl font-display font-bold rounded-full shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDismissLevelUp}
            >
              Awesome! ✨
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  /* ---- OATH INTRO ---- */
  if (phase === 'oath-intro') {
    return (
      <div
        className="min-h-screen bg-night flex flex-col items-center justify-center px-6 cursor-pointer select-none"
        onClick={handleOathIntroTap}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-spark mb-12"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              '0 0 8px #FFD166',
              '0 0 24px #FFD166',
              '0 0 8px #FFD166',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={introIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            {introIdx === 0 && (
              <motion.div
                className="text-5xl mb-6"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🦊
              </motion.div>
            )}
            <p className="font-body text-xl text-amber-100 leading-relaxed italic">
              &ldquo;{OATH_INTRO_LINES[introIdx]}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>
        <p className="absolute bottom-10 text-amber-100/40 text-sm font-body">
          Tap to continue
        </p>
      </div>
    );
  }

  /* ---- OATH NAME ---- */
  if (phase === 'oath-name') {
    return (
      <div className="min-h-screen bg-night flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full max-w-sm"
        >
          <p className="text-5xl mb-6">🦊</p>
          <p className="font-body text-lg text-amber-100 mb-8">
            &ldquo;First — what&apos;s your name, hero?&rdquo;
          </p>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="w-full rounded-2xl bg-white/10 border-2 border-spark/30 px-5 py-4 text-xl text-center text-amber-100 placeholder:text-amber-100/30 focus:outline-none focus:border-spark font-display"
          />
          <div className="mt-4">
            <p className="text-amber-100/50 text-sm font-body mb-3">
              How old are you?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                <button
                  key={age}
                  onClick={() => setChildAge(age)}
                  className={`w-10 h-10 rounded-full text-sm font-display font-bold transition-all ${
                    childAge === age
                      ? 'bg-spark text-night scale-110'
                      : 'bg-white/10 text-amber-100/60 hover:bg-white/20'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleNameSubmit}
            disabled={!childName.trim()}
            className="mt-8 btn-spark btn-primary w-full disabled:opacity-30"
          >
            That&apos;s me! →
          </button>
        </motion.div>
      </div>
    );
  }

  /* ---- OATH CONDITION ---- */
  if (phase === 'oath-condition') {
    return (
      <div className="min-h-screen bg-night flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full max-w-sm"
        >
          <p className="text-5xl mb-6">🦊</p>
          <p className="font-body text-lg text-amber-100 mb-6">
            &ldquo;Hey {childName}! What&apos;s the thing that makes you extra
            special?&rdquo;
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CONDITIONS.slice(0, 12).map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-body transition-all ${
                  condition === c
                    ? 'bg-spark text-night font-bold'
                    : 'bg-white/10 text-amber-100/60 hover:bg-white/20'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Or type anything..."
            className="w-full rounded-2xl bg-white/10 border-2 border-spark/30 px-5 py-3 text-base text-center text-amber-100 placeholder:text-amber-100/30 focus:outline-none focus:border-spark font-body"
          />
          <button
            onClick={handleConditionSubmit}
            disabled={!condition.trim()}
            className="mt-8 btn-spark btn-primary w-full disabled:opacity-30"
          >
            Ready for the oath! ✨
          </button>
        </motion.div>
      </div>
    );
  }

  /* ---- OATH LINES ---- */
  if (phase === 'oath-lines') {
    return (
      <div
        className="min-h-screen bg-night flex flex-col items-center justify-center px-6 cursor-pointer select-none"
        onClick={handleOathTap}
      >
        <div className="text-center max-w-md w-full">
          <p className="font-display text-sm text-spark/60 uppercase tracking-[0.2em] mb-8">
            The Brave Oath
          </p>
          {oathLines.slice(0, oathLineIdx + 1).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: i === oathLineIdx ? 1 : 0.4,
                y: 0,
              }}
              className={`font-display leading-relaxed mb-3 ${
                i === oathLineIdx ? 'text-spark' : 'text-amber-100/40'
              } ${
                line.includes('MIGHTY') ||
                line.includes('SUPERPOWER') ||
                line.includes('HERO')
                  ? 'text-2xl font-bold'
                  : 'text-xl'
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>
        <p className="absolute bottom-10 text-amber-100/30 text-sm font-body">
          Tap to continue
        </p>
      </div>
    );
  }

  /* ---- BLOOM ---- */
  if (phase === 'bloom') {
    return (
      <>
        <SparkBurst active={showBurst} />
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center px-6"
          initial={{ backgroundColor: '#1A1428' }}
          animate={{ backgroundColor: '#FFF8E7' }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center"
          >
            <p className="text-6xl mb-4">✨</p>
            <h1 className="font-display text-4xl font-bold text-ember mb-2">
              Welcome, {childName}!
            </h1>
            <p className="font-body text-lg text-text-light">
              Your first badge:{' '}
              <strong className="text-spark">The Spark ✨</strong>
            </p>
            <motion.p
              className="font-body text-sm text-text-muted mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              +{XP_AWARDS.OATH} XP earned! +10 Spark Coins!
            </motion.p>
          </motion.div>
        </motion.div>
      </>
    );
  }

  /* ---- HOME — Immersive Illustrated Landscape ---- */
  const badgeCount = profile?.badges?.length || 0;
  const storyCount = profile?.stories?.length || 0;
  const coinCount = profile?.sparkCoins || 0;
  const currentXP = profile?.xp || 0;
  const currentStreak = profile?.loginStreak || 0;
  const currentLevel = getLevelForXP(currentXP);
  const xpProgress = getXPProgress(currentXP);
  const nextLevel = getNextLevel(currentLevel.level);
  const activeEvent = getActiveEvent();
  const braveWeekActive = isBraveWeek();

  const dailyMessage = EMBER_MESSAGES[
    Math.floor(Date.now() / 86400000) % EMBER_MESSAGES.length
  ].replace('{name}', profile?.name || 'hero');

  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  // Streak color based on length
  const streakColor =
    currentStreak >= 30
      ? '#FFD700' // gold
      : currentStreak >= 7
      ? '#5DADE2' // blue
      : currentStreak >= 3
      ? '#FF8C42' // orange
      : isNight
      ? '#FFD166'
      : '#FF8C42';

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
    <div
      className="min-h-screen pb-24"
      style={{ background: isNight ? '#1A1428' : '#FFF8E7' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 backdrop-blur-lg border-b px-4 py-3"
        style={{
          background: isNight
            ? 'rgba(26,20,40,0.9)'
            : 'rgba(255,248,231,0.9)',
          borderColor: isNight
            ? 'rgba(255,209,102,0.15)'
            : 'rgba(255,209,102,0.1)',
        }}
      >
        <div className="spark-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦊</span>
            <span className="font-display text-lg font-bold text-ember">
              SPARK
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="p-2 rounded-full hover:bg-spark/10 transition-colors"
              title={soundOn ? 'Sound On' : 'Sound Off'}
            >
              {soundOn ? (
                <Volume2 className="h-4 w-4" style={{ color: isNight ? '#FFD166' : '#FF8C42' }} />
              ) : (
                <VolumeX className="h-4 w-4" style={{ color: isNight ? '#FFD16666' : '#999' }} />
              )}
            </button>
            <span
              className="text-sm font-display font-bold"
              style={{ color: '#FFD700' }}
            >
              🪙 {coinCount}
            </span>
            <Link
              href="/badges"
              className="text-sm font-display font-bold text-spark"
            >
              🏅 {badgeCount}
            </Link>
            <Link
              href="/parents"
              className="p-2 rounded-full hover:bg-spark/10 transition-colors"
            >
              <Settings
                className="h-4 w-4"
                style={{ color: isNight ? '#FFD166' : '#999' }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Event banner */}
      {(activeEvent || braveWeekActive) && (
        <motion.div
          className="px-4 py-2 text-center text-xs font-body"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: activeEvent
              ? `linear-gradient(90deg, ${activeEvent.particleColor}33, ${activeEvent.particleColor}11)`
              : 'linear-gradient(90deg, #FFD16633, #FFD16611)',
            color: isNight ? '#FFD166' : '#1A1428',
          }}
        >
          {activeEvent && (
            <span>
              {activeEvent.emberAccessory} {activeEvent.name} —{' '}
              {activeEvent.description}
              {activeEvent.xpMultiplier > 1 &&
                ` (${activeEvent.xpMultiplier}x XP!)`}
            </span>
          )}
          {braveWeekActive && (
            <span className="ml-2">
              {activeEvent ? ' | ' : ''}⚡ Brave Week: 2x XP!
            </span>
          )}
        </motion.div>
      )}

      {/* ---- IMMERSIVE LANDSCAPE — Full-width, 70vh+ ---- */}
      <div className="immersive-scene" style={{ minHeight: '72vh' }}>
        {/* Sky gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: isNight
              ? 'linear-gradient(180deg, #0D0A1A 0%, #1A1428 30%, #2A1F3D 70%, #1A1428 100%)'
              : isSunset
              ? 'linear-gradient(180deg, #FF6B8A 0%, #FF8C42 25%, #FFD166 50%, #87CEEB 80%, #B0D4E8 100%)'
              : 'linear-gradient(180deg, #4A90D9 0%, #87CEEB 25%, #B0D4E8 50%, #E8F4FD 80%, #FFF8E7 100%)',
          }}
        />

        {/* Sun/Moon */}
        {isNight ? (
          <div
            className="absolute top-[8%] right-[12%] w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"
            style={{
              boxShadow:
                '0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)',
            }}
          >
            <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-gray-300/50" />
            <div className="absolute top-5 right-2 w-1.5 h-1.5 rounded-full bg-gray-300/40" />
            <div className="absolute bottom-3 left-5 w-1 h-1 rounded-full bg-gray-300/30" />
          </div>
        ) : (
          <div
            className="absolute top-[6%] right-[12%] w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-spark to-ember"
            style={{ boxShadow: '0 0 40px #FFD166, 0 0 80px #FFD16644' }}
          />
        )}

        {/* Stars (night) */}
        {isNight && (
          <>
            {[...Array(25)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
                  height: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
                  top: `${3 + ((i * 7) % 35)}%`,
                  left: `${2 + ((i * 13) % 95)}%`,
                  animation: `twinkle ${2 + (i % 3)}s ease-in-out ${
                    i * 0.3
                  }s infinite`,
                }}
              />
            ))}
          </>
        )}

        {/* Clouds */}
        {!isNight && (
          <>
            <div
              className="absolute top-[8%] text-4xl md:text-5xl opacity-80"
              style={{
                animation: 'cloudDrift 35s linear infinite',
                animationDelay: '-5s',
              }}
            >
              ☁️
            </div>
            <div
              className="absolute top-[15%] text-3xl md:text-4xl opacity-60"
              style={{
                animation: 'cloudDriftReverse 42s linear infinite',
                animationDelay: '-12s',
              }}
            >
              ☁️
            </div>
            <div
              className="absolute top-[6%] text-2xl md:text-3xl opacity-50"
              style={{
                animation: 'cloudDrift 50s linear infinite',
                animationDelay: '-25s',
              }}
            >
              ☁️
            </div>
            <div
              className="absolute top-[20%] text-3xl opacity-40"
              style={{
                animation: 'cloudDriftReverse 38s linear infinite',
                animationDelay: '-18s',
              }}
            >
              ☁️
            </div>
          </>
        )}

        {/* Rolling green hills */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: '55%' }}
        >
          <div
            className="absolute bottom-0 left-[-15%] w-[70%] h-[85%] rounded-t-[50%]"
            style={{
              background: isNight ? '#1E3A16' : '#6A9F55',
              opacity: 0.4,
            }}
          />
          <div
            className="absolute bottom-0 right-[-12%] w-[65%] h-[75%] rounded-t-[50%]"
            style={{
              background: isNight ? '#1B3514' : '#5C8F48',
              opacity: 0.5,
            }}
          />
          <div
            className="absolute bottom-0 left-[10%] w-[80%] h-[65%] rounded-t-[50%]"
            style={{
              background: isNight ? '#264218' : '#7FB069',
              opacity: 0.65,
            }}
          />
          <div
            className="absolute bottom-0 left-[-5%] w-[110%] h-[50%] rounded-t-[40%]"
            style={{
              background: isNight ? '#2D4A22' : '#8BC070',
              opacity: 0.8,
            }}
          />
        </div>

        {/* Golden winding path */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M500,680 C470,600 380,560 430,480 C480,400 600,420 550,340 C500,260 380,240 440,170 C500,100 600,130 570,80"
            fill="none"
            stroke={isNight ? '#FFD16633' : '#FFD16688'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="16 12"
          />
        </svg>

        {/* Landscape navigation items */}
        {landscapeItems.map((item, i) => (
          <motion.div
            key={item.href}
            className="absolute z-10"
            style={{
              top: item.top,
              left: item.left,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1 + i * 0.07,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <Link
              href={item.href}
              className="flex flex-col items-center group"
            >
              <motion.div
                className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center"
                style={{
                  background: isNight
                    ? 'rgba(26,20,40,0.7)'
                    : 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                  animation: 'pulseGlow 3s ease-in-out infinite',
                  animationDelay: `${i * 0.4}s`,
                }}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 2.5 + i * 0.3,
                  repeat: Infinity,
                }}
                whileHover={{ scale: 1.15 }}
              >
                <span className="text-3xl md:text-4xl">{item.emoji}</span>
              </motion.div>
              <span
                className="font-display text-xs md:text-sm font-bold mt-1 px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{
                  background: isNight
                    ? 'rgba(26,20,40,0.85)'
                    : 'rgba(255,255,255,0.9)',
                  color: isNight ? '#FFD166' : '#1A1428',
                  textShadow: isNight
                    ? 'none'
                    : '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {item.label}
              </span>
            </Link>
          </motion.div>
        ))}

        {/* Animated campfire flame */}
        <div
          className="absolute z-10"
          style={{
            top: '66%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative w-10 h-12">
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-8 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
              style={{
                background:
                  'radial-gradient(ellipse at bottom, #FF8C42, #FFD166, transparent)',
                animation:
                  'flicker 0.5s ease-in-out infinite alternate',
              }}
            />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-6 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
              style={{
                background:
                  'radial-gradient(ellipse at bottom, #FFD166, #FFF8E7, transparent)',
                animation:
                  'flickerAlt 0.4s ease-in-out infinite alternate',
              }}
            />
            <div
              className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-12 h-6 rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse, #FF8C4244, transparent)',
                filter: 'blur(4px)',
              }}
            />
          </div>
          <div className="flex justify-center gap-0.5 -mt-1">
            <div className="w-6 h-1.5 bg-amber-800 rounded-full rotate-[-15deg]" />
            <div className="w-6 h-1.5 bg-amber-900 rounded-full rotate-[15deg] -ml-2" />
          </div>
        </div>

        {/* Ember the fox */}
        <div
          className="absolute z-10"
          style={{
            top: '68%',
            left: '43%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div style={{ animation: 'emberBounce 3s ease-in-out infinite' }}>
            <div className="relative">
              <div className="w-8 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-[60%_60%_40%_40%]" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-6 bg-gradient-to-b from-amber-300 to-orange-400 rounded-full">
                <div
                  className="absolute -top-2 left-0.5 w-0 h-0"
                  style={{
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderBottom: '6px solid #F59E0B',
                  }}
                />
                <div
                  className="absolute -top-2 right-0.5 w-0 h-0"
                  style={{
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderBottom: '6px solid #F59E0B',
                  }}
                />
                <div className="absolute top-2 left-1.5 w-1 h-1 rounded-full bg-night" />
                <div className="absolute top-2 right-1.5 w-1 h-1 rounded-full bg-night" />
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-1 h-0.5 rounded-full bg-night" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-white/80 rounded-b-full" />
              </div>
              <div className="absolute -right-3 top-0 w-4 h-2 bg-gradient-to-r from-orange-400 to-amber-300 rounded-full rotate-[-20deg]">
                <div className="absolute right-0 top-0 w-1.5 h-1.5 bg-white/80 rounded-full" />
              </div>
              <div className="absolute bottom-[-3px] left-1 w-2 h-1.5 bg-orange-400 rounded-b-full" />
              <div className="absolute bottom-[-3px] right-1 w-2 h-1.5 bg-orange-400 rounded-b-full" />
              <div className="absolute bottom-[-3px] left-0.5 w-2.5 h-0.5 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Below landscape — Streak, XP bar, Ember message + stats */}
      <div className="spark-container pt-6">
        <div className="max-w-2xl mx-auto">
          {/* Streak display */}
          {currentStreak > 0 && (
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.p
                className="font-display text-xl font-bold"
                style={{ color: streakColor }}
                animate={
                  currentStreak >= 7
                    ? { scale: [1, 1.05, 1] }
                    : undefined
                }
                transition={
                  currentStreak >= 7
                    ? { duration: 2, repeat: Infinity }
                    : undefined
                }
              >
                🔥 {currentStreak} Day Streak!
              </motion.p>
              {currentStreak >= 30 && (
                <p
                  className="font-body text-xs mt-1"
                  style={{
                    color: isNight ? '#FFD700' : '#B8860B',
                  }}
                >
                  LEGENDARY STREAK
                </p>
              )}
              {currentStreak >= 7 && currentStreak < 30 && (
                <p
                  className="font-body text-xs mt-1"
                  style={{
                    color: isNight ? '#5DADE2' : '#2980B9',
                  }}
                >
                  SUPER STREAK
                </p>
              )}
            </motion.div>
          )}

          {/* XP Progress Bar */}
          <motion.div
            className="mb-5 px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="font-display text-sm font-bold"
                  style={{
                    color: isNight ? '#FFD166' : '#FF8C42',
                  }}
                >
                  Lv.{currentLevel.level}
                </span>
                <span
                  className="font-body text-xs"
                  style={{
                    color: isNight
                      ? 'rgba(255,209,102,0.6)'
                      : '#666',
                  }}
                >
                  {currentLevel.title}
                </span>
              </div>
              <span
                className="font-body text-xs"
                style={{
                  color: isNight
                    ? 'rgba(255,209,102,0.5)'
                    : '#999',
                }}
              >
                {nextLevel
                  ? `${xpProgress.current} / ${xpProgress.needed} XP`
                  : 'MAX LEVEL'}
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{
                background: isNight
                  ? 'rgba(255,209,102,0.15)'
                  : 'rgba(255,140,66,0.15)',
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #FF8C42, #FFD166, #FF8C42)',
                  backgroundSize: '200% 100%',
                  animation:
                    'shimmer 2s ease-in-out infinite',
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${xpProgress.percent}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            {nextLevel && (
              <p
                className="text-right font-body text-[10px] mt-0.5"
                style={{
                  color: isNight
                    ? 'rgba(255,209,102,0.4)'
                    : '#bbb',
                }}
              >
                Next: Lv.{nextLevel.level} {nextLevel.title}
              </p>
            )}
          </motion.div>

          {/* Ember daily message */}
          <div
            className="spark-card p-5 text-center mb-4"
            style={{
              background: isNight
                ? 'linear-gradient(135deg, #2A1F3D, #1A1428)'
                : 'linear-gradient(135deg, #FFF8E7, #FFD16622)',
              border: isNight
                ? '2px solid rgba(255,209,102,0.2)'
                : undefined,
            }}
          >
            <p className="text-3xl mb-2">🦊</p>
            <p
              className={`font-body text-sm leading-relaxed italic ${
                isNight ? 'text-amber-100/80' : 'text-text'
              }`}
            >
              &ldquo;{dailyMessage}&rdquo;
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 mb-8">
            <div
              className="flex-1 spark-card p-4 text-center"
              style={{
                background: isNight ? '#2A1F3D' : 'white',
                border: isNight
                  ? '2px solid rgba(255,209,102,0.15)'
                  : undefined,
              }}
            >
              <span className="text-2xl block">🏅</span>
              <span
                className={`font-display text-xl font-bold ${
                  isNight ? 'text-spark' : 'text-ember'
                }`}
              >
                {badgeCount}
              </span>
              <span
                className={`block text-xs font-body ${
                  isNight ? 'text-amber-100/50' : 'text-text-muted'
                }`}
              >
                Badges
              </span>
            </div>
            <div
              className="flex-1 spark-card p-4 text-center"
              style={{
                background: isNight ? '#2A1F3D' : 'white',
                border: isNight
                  ? '2px solid rgba(255,209,102,0.15)'
                  : undefined,
              }}
            >
              <span className="text-2xl block">📖</span>
              <span
                className={`font-display text-xl font-bold ${
                  isNight ? 'text-spark' : 'text-ember'
                }`}
              >
                {storyCount}
              </span>
              <span
                className={`block text-xs font-body ${
                  isNight ? 'text-amber-100/50' : 'text-text-muted'
                }`}
              >
                Stories
              </span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Shimmer keyframe for XP bar */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
