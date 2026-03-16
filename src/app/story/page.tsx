'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/Ember';
import {
  getProfile, STORY_TONES, FAVORITE_THINGS, CONDITIONS, DEMO_STORY,
  type GeneratedStory, type StorybookData, type StoryPage, earnBadge, saveProfile,
} from '@/lib/spark-data';

const LOADING_MESSAGES = [
  "Ember is writing your story...",
  "Mixing the magic ink...",
  "Drawing the pictures...",
  "Adding extra sparkle...",
  "Almost ready, brave one...",
  "Putting on the finishing touches...",
];

/* ---- Rich Scene Illustration Component ---- */
function SceneIllustration({ page, nightMode }: { page: StoryPage; nightMode: boolean }) {
  const mood = page.illustration.mood.toLowerCase();
  const colors = page.illustration.colors;

  // 1. Sky — mood-based gradient
  let skyGradient: string;
  let isDark = false;
  if (mood.includes('joyful') || mood.includes('adventure') || mood.includes('triumphant')) {
    skyGradient = 'linear-gradient(180deg, #87CEEB 0%, #B0D4E8 50%, #E0F7FA 100%)';
  } else if (mood.includes('concern') || mood.includes('discovery') || mood.includes('warm') || mood.includes('reassuring')) {
    skyGradient = 'linear-gradient(180deg, #FFB347 0%, #FFECD2 50%, #FFF8E7 100%)';
  } else if (mood.includes('triumph') || mood.includes('celebration') || mood.includes('empowering')) {
    skyGradient = 'linear-gradient(180deg, #FFD700 0%, #FFE88A 50%, #FFF8E1 100%)';
  } else if (mood.includes('peaceful') || mood.includes('night') || mood.includes('calm') || mood.includes('proud')) {
    skyGradient = 'linear-gradient(180deg, #1A1428 0%, #2D1B69 50%, #3D2C80 100%)';
    isDark = true;
  } else if (mood.includes('brave') || mood.includes('action') || mood.includes('kind')) {
    skyGradient = 'linear-gradient(180deg, #FF6B8A 0%, #FFB347 50%, #FFECD2 100%)';
  } else if (mood.includes('magical') || mood.includes('connected')) {
    skyGradient = 'linear-gradient(180deg, #1E3A5F 0%, #9B72CF 50%, #C4A6D6 100%)';
    isDark = true;
  } else {
    skyGradient = 'linear-gradient(180deg, #87CEEB 0%, #FFD166 100%)';
  }

  if (nightMode) {
    skyGradient = 'linear-gradient(180deg, #1A1428 0%, #2A1F3D 100%)';
    isDark = true;
  }

  // Ground color
  const groundColor = nightMode ? '#264218' : isDark ? '#2D4A22' : '#7FB069';
  const groundColor2 = nightMode ? '#1E3A16' : isDark ? '#264218' : '#5A8A3C';

  return (
    <div className="relative w-full h-56 md:h-72 overflow-hidden rounded-t-2xl"
      style={{ background: skyGradient }}>

      {/* 3. Sun or Moon */}
      {isDark ? (
        <div className="absolute top-3 right-6 w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-100"
          style={{ boxShadow: '0 0 15px rgba(255,255,255,0.25)' }}>
          {/* Crater dots */}
          <div className="absolute top-1.5 left-2 w-1 h-1 rounded-full bg-gray-300/50" />
          <div className="absolute top-4 right-1.5 w-0.5 h-0.5 rounded-full bg-gray-300/40" />
        </div>
      ) : (
        <div className="absolute top-3 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-spark to-ember"
          style={{ boxShadow: '0 0 20px #FFD166, 0 0 40px #FFD16644' }} />
      )}

      {/* Stars for dark skies */}
      {isDark && (
        <>
          {[...Array(12)].map((_, i) => (
            <div key={`star-${i}`} className="absolute rounded-full bg-white"
              style={{
                width: i % 3 === 0 ? 2 : 1.5,
                height: i % 3 === 0 ? 2 : 1.5,
                top: `${5 + (i * 7) % 35}%`,
                left: `${3 + (i * 11) % 88}%`,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
              }} />
          ))}
        </>
      )}

      {/* 2. Ground — rolling green hills */}
      <div className="absolute bottom-0 left-[-10%] w-[60%] h-[38%] rounded-t-[50%]"
        style={{ background: groundColor2, opacity: 0.6 }} />
      <div className="absolute bottom-0 right-[-8%] w-[55%] h-[33%] rounded-t-[50%]"
        style={{ background: groundColor, opacity: 0.5 }} />
      <div className="absolute bottom-0 left-[5%] w-[90%] h-[28%] rounded-t-[40%]"
        style={{ background: groundColor, opacity: 0.75 }} />

      {/* Trees for forest/brave/calm moods */}
      {(mood.includes('brave') || mood.includes('calm') || mood.includes('kind') || mood.includes('connected')) && !nightMode && (
        <>
          {[
            { left: '8%', bottom: '25%', w: 12, h: 18 },
            { left: '82%', bottom: '22%', w: 14, h: 22 },
            { left: '30%', bottom: '28%', w: 10, h: 15 },
          ].map((t, i) => (
            <div key={`tree-${i}`} className="absolute" style={{ left: t.left, bottom: t.bottom }}>
              <div className="rounded-t-full mx-auto" style={{
                width: t.w, height: t.h, background: isDark ? '#2D4A22' : '#5C8F48',
              }} />
              <div className="mx-auto" style={{ width: 3, height: 6, background: '#8B6F47' }} />
            </div>
          ))}
        </>
      )}

      {/* 4. Character (center, standing on ground) */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex items-end gap-3">
        {/* Child figure */}
        <div className="flex flex-col items-center">
          {/* Head */}
          <div className="w-8 h-8 rounded-full relative" style={{ background: '#D4A574' }}>
            {/* Eyes */}
            <div className="absolute top-3 left-1.5 w-1 h-1 rounded-full bg-night" />
            <div className="absolute top-3 right-1.5 w-1 h-1 rounded-full bg-night" />
            {/* Smile */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-1 border-b-[1.5px] border-night rounded-b-full" />
            {/* Hair */}
            <div className="absolute -top-1 left-0 right-0 h-3 rounded-t-full"
              style={{ background: '#3D2C1E' }} />
          </div>
          {/* Body */}
          <div className="w-7 h-10 rounded-lg mt-0.5" style={{ background: colors[0] || '#5DADE2' }}>
            {/* Cape */}
            <div className="absolute -right-1 top-0 w-3 h-8 rounded-r-lg opacity-70"
              style={{ background: colors[1] || '#FF8C42' }} />
          </div>
          {/* Legs */}
          <div className="flex gap-1 -mt-0.5">
            <div className="w-2.5 h-4 rounded-b-md" style={{ background: '#4A6FA5' }} />
            <div className="w-2.5 h-4 rounded-b-md" style={{ background: '#4A6FA5' }} />
          </div>
        </div>

        {/* 5. Companion */}
        <div className="mb-1 relative">
          {/* Animal body (fox/dog shape) */}
          <div className="w-6 h-4 rounded-[60%] relative" style={{ background: colors[1] || '#FF8C42', opacity: 0.85 }}>
            {/* Ears */}
            <div className="absolute -top-1.5 left-0.5 w-0 h-0" style={{
              borderLeft: '2px solid transparent', borderRight: '2px solid transparent',
              borderBottom: `4px solid ${colors[1] || '#FF8C42'}`,
            }} />
            <div className="absolute -top-1.5 right-0.5 w-0 h-0" style={{
              borderLeft: '2px solid transparent', borderRight: '2px solid transparent',
              borderBottom: `4px solid ${colors[1] || '#FF8C42'}`,
            }} />
            {/* Eye */}
            <div className="absolute top-1 left-1 w-0.5 h-0.5 rounded-full bg-night" />
            {/* Tail */}
            <div className="absolute top-0 -right-2 w-3 h-1.5 rounded-full"
              style={{ background: colors[1] || '#FF8C42', opacity: 0.7 }} />
          </div>
        </div>
      </div>

      {/* 6. Condition/mood themed element */}
      {mood.includes('magical') && (
        <motion.div className="absolute top-[15%] left-[20%] text-2xl"
          animate={{ y: [0, -5, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}>
          🐉
        </motion.div>
      )}

      {/* 7. Mood particles */}
      {[...Array(8)].map((_, i) => {
        const isJoy = mood.includes('joyful') || mood.includes('triumph') || mood.includes('celebration');
        const isPeace = mood.includes('peaceful') || mood.includes('calm');
        const isAdventure = mood.includes('adventure') || mood.includes('brave');
        return (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              background: isJoy ? '#FFD166' : isPeace ? '#FFFFFF' : isAdventure ? '#FFD166' : colors[0] || '#FFD166',
              left: `${8 + (i * 13) % 84}%`,
              top: `${10 + (i * 11) % 50}%`,
              opacity: 0.6,
              animation: isPeace
                ? `float ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`
                : isJoy
                  ? `particleRise ${4 + i * 0.5}s ease-out ${i * 0.4}s infinite`
                  : `twinkle ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        );
      })}

      {/* Illustration description (subtle) */}
      <p className="absolute bottom-2 left-3 right-3 text-[10px] text-white/30 font-body italic text-center">
        {page.illustration.description}
      </p>
    </div>
  );
}

export default function StoryPage() {
  const [phase, setPhase] = useState<'form' | 'loading' | 'reader'>('form');
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [nightMode, setNightMode] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Form state
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('7');
  const [condition, setCondition] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [companionName, setCompanionName] = useState('');
  const [companionType, setCompanionType] = useState('');
  const [storyTone, setStoryTone] = useState('adventure');
  const [dedication, setDedication] = useState('');
  const [favCategory, setFavCategory] = useState<string>('Animals');

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setChildName(profile.name || '');
      setChildAge(String(profile.age || 7));
      setCondition(profile.condition || '');
      if (profile.companion?.name) setCompanionName(profile.companion.name);
      if (profile.companion?.type) setCompanionType(profile.companion.type);
    }
  }, []);

  const toggleFavorite = (item: string) => {
    setFavorites(prev =>
      prev.includes(item) ? prev.filter(f => f !== item) : prev.length < 5 ? [...prev, item] : prev
    );
  };

  const handleSubmit = async () => {
    if (!childName.trim() || !condition) return;
    setPhase('loading');
    setLoadingMsg(0);

    const interval = setInterval(() => {
      setLoadingMsg(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    try {
      const res = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: childName.trim(),
          childAge: Number(childAge),
          condition,
          favorites,
          companion: companionName ? { name: companionName, type: companionType || 'friend' } : undefined,
          storyTone,
        }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        const s = data.story as GeneratedStory;
        if (dedication) s.dedication = dedication;
        setStory(s);
        saveStoryToProfile(s);
      } else {
        useDemoStory();
      }
    } catch {
      useDemoStory();
    } finally {
      clearInterval(interval);
      setCurrentPage(0);
      setPhase('reader');
    }
  };

  const useDemoStory = () => {
    const s: GeneratedStory = {
      ...DEMO_STORY,
      title: `${childName} and the Breathing Dragon`,
      dedication: dedication || `For ${childName}, who is braver than they know`,
      pages: DEMO_STORY.pages.map(p => ({
        ...p,
        text: p.text.replace(/\bSam\b/g, childName).replace(/\bSam's\b/g, `${childName}'s`),
      })),
    };
    setStory(s);
    saveStoryToProfile(s);
  };

  const saveStoryToProfile = (s: GeneratedStory) => {
    const profile = getProfile();
    if (profile) {
      const sbData: StorybookData = {
        story: s,
        childName: childName.trim(),
        childAge: Number(childAge),
        condition,
        volume: (profile.stories?.length || 0) + 1,
        createdAt: new Date().toISOString(),
      };
      profile.stories = [...(profile.stories || []), sbData];
      saveProfile(profile);
    }
    try {
      localStorage.setItem('spark-current-story', JSON.stringify(s));
    } catch { /* ok */ }
  };

  const handleFinishReading = useCallback(() => {
    earnBadge('storyteller');
  }, []);

  const readAloud = () => {
    if (!story) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const page = story.pages[currentPage];
    if (!page) return;
    const utter = new SpeechSynthesisUtterance(page.text);
    utter.rate = 0.85;
    utter.pitch = 1.1;
    utter.onend = () => setIsReading(false);
    speechRef.current = utter;
    setIsReading(true);
    window.speechSynthesis.speak(utter);
  };

  const goPage = (dir: number) => {
    if (!story) return;
    window.speechSynthesis.cancel();
    setIsReading(false);
    const next = currentPage + dir;
    if (next < 0 || next >= story.pages.length + 2) return;
    setCurrentPage(next);
    if (next === story.pages.length + 1) handleFinishReading();
  };

  // --- FORM PHASE ---
  if (phase === 'form') {
    return (
      <div className="min-h-screen bg-cream pb-24">
        <div className="spark-container py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-2 bg-gradient-to-r from-ember to-heart bg-clip-text text-transparent">
              My Story
            </h1>
            <p className="text-center font-body text-text-light mb-4">
              Let Ember write a magical book just for you!
            </p>

            {/* ---- MY BOOKSHELF ---- */}
            <StoryBookshelf
              onReread={(s) => { setStory(s); setCurrentPage(0); setPhase('reader'); }}
            />

            <div className="space-y-5">
              {/* Name */}
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-1">Your Name</label>
                <input
                  type="text"
                  value={childName}
                  onChange={e => setChildName(e.target.value)}
                  placeholder="What's your name, brave one?"
                  className="w-full px-4 py-3 rounded-xl border-2 border-spark/30 bg-cream/50 font-body focus:border-ember focus:outline-none"
                />
              </div>

              {/* Age */}
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-1">Your Age</label>
                <input
                  type="number"
                  value={childAge}
                  onChange={e => setChildAge(e.target.value)}
                  min={3} max={15}
                  className="w-full px-4 py-3 rounded-xl border-2 border-spark/30 bg-cream/50 font-body focus:border-ember focus:outline-none"
                />
              </div>

              {/* Condition */}
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-1">My Condition</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-spark/30 bg-cream/50 font-body focus:border-ember focus:outline-none"
                >
                  <option value="">Choose one...</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Favorites */}
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-1">
                  Favorite Things <span className="text-text-muted text-sm">(pick up to 5)</span>
                </label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {Object.keys(FAVORITE_THINGS).map(cat => (
                    <button key={cat} onClick={() => setFavCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm font-display font-medium transition-all ${favCategory === cat ? 'bg-ember text-white' : 'bg-spark/20 text-text'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(FAVORITE_THINGS as Record<string, string[]>)[favCategory]?.map(item => (
                    <button key={item} onClick={() => toggleFavorite(item)}
                      className={`px-3 py-1.5 rounded-full text-sm font-body transition-all ${favorites.includes(item) ? 'bg-brave text-white shadow-md' : 'bg-white border border-spark/30 text-text hover:border-ember'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Companion */}
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-1">Story Companion</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={companionName} onChange={e => setCompanionName(e.target.value)}
                    placeholder="Name (e.g. Biscuit)" className="px-3 py-2 rounded-xl border-2 border-spark/30 bg-cream/50 font-body text-sm focus:border-ember focus:outline-none" />
                  <input type="text" value={companionType} onChange={e => setCompanionType(e.target.value)}
                    placeholder="Type (e.g. dog)" className="px-3 py-2 rounded-xl border-2 border-spark/30 bg-cream/50 font-body text-sm focus:border-ember focus:outline-none" />
                </div>
              </div>

              {/* Story Tone */}
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-2">Story Tone</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {STORY_TONES.map(t => (
                    <button key={t.value} onClick={() => setStoryTone(t.value)}
                      className={`p-3 rounded-xl text-left transition-all ${storyTone === t.value ? 'bg-gradient-to-br from-ember/20 to-heart/20 border-2 border-ember shadow-md' : 'bg-white border-2 border-spark/20 hover:border-ember/40'}`}>
                      <span className="text-xl">{t.emoji}</span>
                      <span className="block font-display font-semibold text-sm">{t.label}</span>
                      <span className="block text-xs text-text-muted font-body">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dedication */}
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-1">Special Dedication</label>
                <input type="text" value={dedication} onChange={e => setDedication(e.target.value)}
                  placeholder={`For ${childName || 'you'}, who is braver than they know`}
                  className="w-full px-4 py-3 rounded-xl border-2 border-spark/30 bg-cream/50 font-body focus:border-ember focus:outline-none" />
              </div>

              <button onClick={handleSubmit} disabled={!childName.trim() || !condition}
                className="btn-spark btn-primary w-full text-lg disabled:opacity-40 disabled:cursor-not-allowed">
                Create My Story
              </button>
            </div>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // --- LOADING PHASE ---
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center px-6">
          <motion.div className="text-7xl mb-6"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            📖
          </motion.div>
          <div className="relative h-8 mb-4">
            {[...Array(8)].map((_, i) => (
              <motion.div key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ left: `${10 + i * 11}%`, background: ['#FFD166', '#FF8C42', '#FF6B8A', '#5DADE2', '#9B72CF', '#7FB069', '#FFD166', '#FF6B8A'][i] }}
                animate={{ y: [0, -16, 0], opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
          <motion.p key={loadingMsg} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="font-display font-semibold text-xl text-ember">
            {LOADING_MESSAGES[loadingMsg]}
          </motion.p>
        </div>
      </div>
    );
  }

  // --- READER PHASE ---
  if (!story) return null;
  const totalPages = story.pages.length + 2;
  const isCover = currentPage === 0;
  const isEnd = currentPage === totalPages - 1;
  const pageData = !isCover && !isEnd ? story.pages[currentPage - 1] : null;

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-500 ${nightMode ? 'night-mode' : ''}`}
      style={{ background: nightMode ? '#1A1428' : '#FFF8E7' }}>
      <div className="spark-container py-4">
        <div className="max-w-2xl mx-auto">
          {/* Controls bar */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { setPhase('form'); window.speechSynthesis.cancel(); }}
              className="text-sm font-display text-text-muted hover:text-ember transition-colors min-h-[48px] flex items-center">
              New Story
            </button>
            <div className="flex gap-2">
              <button onClick={readAloud}
                className={`px-3 py-1.5 rounded-full text-sm font-display transition-all min-h-[48px] ${isReading ? 'bg-heart text-white' : 'bg-white border border-spark/30'}`}>
                {isReading ? 'Stop' : 'Read to Me'}
              </button>
              <button onClick={() => setNightMode(!nightMode)}
                className="px-3 py-1.5 rounded-full text-sm font-display bg-white border border-spark/30 min-h-[48px]">
                {nightMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Page display with 3D perspective page turn */}
          <AnimatePresence mode="wait">
            <motion.div key={currentPage}
              initial={{ opacity: 0, rotateY: 15, x: 40 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -15, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ perspective: 800, transformStyle: 'preserve-3d' }}
              className="rounded-3xl overflow-hidden shadow-xl mb-6"
            >
              <div style={{ background: nightMode ? '#2A2438' : 'white' }}>
                {/* Illustration area */}
                {isCover && (
                  <div className="h-56 md:h-72 flex items-center justify-center relative overflow-hidden rounded-t-2xl"
                    style={{ background: nightMode ? 'linear-gradient(135deg, #FF8C4222, #FFD16622)' : 'linear-gradient(135deg, #FF8C4233, #FFD16633, #FF6B8A22)' }}>
                    <div className="text-center px-6">
                      <motion.div className="text-6xl mb-3" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                        📖✨
                      </motion.div>
                      <h1 className={`font-display font-bold text-2xl ${nightMode ? 'text-cream' : 'text-text'}`}>{story.title}</h1>
                      <p className={`font-body text-sm mt-2 italic ${nightMode ? 'text-cream/60' : 'text-text-muted'}`}>{story.dedication}</p>
                    </div>
                  </div>
                )}

                {isEnd && (
                  <div className="h-56 md:h-72 flex items-center justify-center relative overflow-hidden rounded-t-2xl"
                    style={{ background: nightMode ? 'linear-gradient(135deg, #FFD16622, #7FB06922)' : 'linear-gradient(135deg, #FFD16633, #7FB06933, #5DADE233)' }}>
                    <div className="text-center px-6">
                      <motion.div className="text-5xl mb-3" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        🌟
                      </motion.div>
                      <h2 className={`font-display font-bold text-xl ${nightMode ? 'text-cream' : 'text-text'}`}>The End</h2>
                      <p className={`font-body text-sm mt-1 ${nightMode ? 'text-cream/60' : 'text-text-muted'}`}>You are braver than you know.</p>
                    </div>
                  </div>
                )}

                {pageData && <SceneIllustration page={pageData} nightMode={nightMode} />}

                {/* Text area */}
                <div className="p-6">
                  {pageData && (
                    <p className={`font-body text-lg leading-relaxed ${nightMode ? 'text-cream/90' : 'text-text'}`}>
                      {pageData.text}
                    </p>
                  )}
                  {isEnd && story.aboutTheCondition && (
                    <div className="mt-4 space-y-3">
                      <div className="spark-card p-4">
                        <h3 className="font-display font-semibold text-sm text-ember mb-1">For Kids</h3>
                        <p className="font-body text-sm text-text">{story.aboutTheCondition.forKids}</p>
                      </div>
                      <div className="spark-card p-4">
                        <h3 className="font-display font-semibold text-sm text-dream mb-1">For Parents</h3>
                        <p className="font-body text-sm text-text">{story.aboutTheCondition.forParents}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => goPage(-1)} disabled={currentPage === 0}
              className="btn-spark btn-secondary text-sm disabled:opacity-30 min-h-[48px]">
              Previous
            </button>
            <span className={`font-display text-sm ${nightMode ? 'text-cream/50' : 'text-text-muted'}`}>
              {currentPage + 1} / {totalPages}
            </span>
            <button onClick={() => goPage(1)} disabled={currentPage === totalPages - 1}
              className="btn-spark btn-primary text-sm disabled:opacity-30 min-h-[48px]">
              Next
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => { setCurrentPage(i); if (i === totalPages - 1) handleFinishReading(); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentPage ? 'bg-ember scale-125' : nightMode ? 'bg-spark/20' : 'bg-spark/40'}`} />
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

/* ---- Story Bookshelf Component ---- */
function StoryBookshelf({ onReread }: { onReread: (story: GeneratedStory) => void }) {
  const profile = getProfile();
  if (!profile || !profile.stories || profile.stories.length === 0) return null;

  const stories = profile.stories;
  const nextVolume = stories.length + 1;

  // Check if next volume is unlocked (requires a day to pass since last story)
  const lastStory = stories[stories.length - 1];
  const lastStoryDate = lastStory?.createdAt ? new Date(lastStory.createdAt).toISOString().split('T')[0] : '';
  const today = new Date().toISOString().split('T')[0];
  const nextVolumeUnlocked = lastStoryDate !== today;

  // Book spine colors
  const spineColors = ['#FF8C42', '#5DADE2', '#9B72CF', '#FF6B8A', '#7FB069', '#FFD166', '#14B8A6', '#DC2626', '#3B82F6', '#F59E0B'];

  return (
    <div className="mb-6">
      <h2 className="font-display font-bold text-lg text-text mb-3 flex items-center gap-2">
        📚 My Bookshelf
        <span className="text-xs font-body text-text-muted font-normal">({stories.length} volume{stories.length !== 1 ? 's' : ''})</span>
      </h2>

      {/* Bookshelf visual */}
      <div className="spark-card p-4 overflow-hidden" style={{ background: 'linear-gradient(180deg, #8B6F47 0%, #6B5434 100%)' }}>
        {/* Shelf */}
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ minHeight: 100 }}>
          {stories.map((s, i) => {
            const isSpecial = (i + 1) === 5 || (i + 1) === 10;
            return (
              <button
                key={i}
                onClick={() => onReread(s.story)}
                className="flex-shrink-0 rounded-lg flex flex-col items-center justify-end p-1.5 hover:brightness-110 transition-all"
                style={{
                  width: 48,
                  height: 80,
                  background: `linear-gradient(135deg, ${spineColors[i % spineColors.length]}, ${spineColors[(i + 3) % spineColors.length]})`,
                  border: isSpecial ? '2px solid #FFD166' : 'none',
                }}
              >
                <span className="font-display text-[8px] font-bold text-white/90 text-center leading-tight">
                  Vol. {i + 1}
                </span>
                <span className="font-body text-[6px] text-white/60 text-center leading-tight truncate w-full">
                  {s.story.title.split(' ').slice(0, 3).join(' ')}
                </span>
              </button>
            );
          })}

          {/* Next volume slot */}
          <div className="flex-shrink-0 rounded-lg flex flex-col items-center justify-center p-1.5 border-2 border-dashed"
            style={{
              width: 48, height: 80,
              borderColor: nextVolumeUnlocked ? '#FFD166' : '#FFFFFF33',
              background: nextVolumeUnlocked ? 'rgba(255,209,102,0.15)' : 'rgba(255,255,255,0.05)',
            }}>
            {nextVolumeUnlocked ? (
              <>
                <span className="text-lg">✨</span>
                <span className="font-display text-[7px] font-bold text-spark text-center">NEW!</span>
              </>
            ) : (
              <>
                <span className="text-lg">🔒</span>
                <span className="font-display text-[7px] text-white/40 text-center">Vol. {nextVolume}</span>
              </>
            )}
          </div>
        </div>

        {/* Shelf bottom */}
        <div className="h-2 bg-amber-900/80 rounded-b-lg -mx-4 -mb-4 mt-2" />
      </div>

      {/* Unlock message */}
      {!nextVolumeUnlocked && stories.length > 0 && (
        <p className="font-body text-xs text-text-muted text-center mt-2 italic">
          Volume {nextVolume} unlocks tomorrow! Come back for your next adventure.
        </p>
      )}
      {nextVolumeUnlocked && stories.length > 0 && (
        <motion.p
          className="font-body text-xs text-spark text-center mt-2 font-bold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🦊 Your next adventure is ready! Create Volume {nextVolume} below!
        </motion.p>
      )}
    </div>
  );
}
