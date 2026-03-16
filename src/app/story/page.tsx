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

/* ---- Mood-based color palettes for illustrations ---- */
function getMoodTheme(mood: string): { sky: string[]; hasStars: boolean; hasTrees: boolean; particleType: 'sparkle' | 'feather' | 'stars' | 'glow'; groundColor: string } {
  const m = mood.toLowerCase();
  if (m.includes('joyful') || m.includes('triumphant')) {
    return { sky: ['#FFD166', '#87CEEB'], hasStars: false, hasTrees: false, particleType: 'sparkle', groundColor: '#7FB069' };
  }
  if (m.includes('concern') || m.includes('empathy')) {
    return { sky: ['#FF8C42', '#C4A6D6'], hasStars: false, hasTrees: false, particleType: 'glow', groundColor: '#8BC070' };
  }
  if (m.includes('magical') || m.includes('empowering')) {
    return { sky: ['#1E3A5F', '#9B72CF'], hasStars: true, hasTrees: false, particleType: 'sparkle', groundColor: '#5C8F48' };
  }
  if (m.includes('peaceful') || m.includes('proud')) {
    return { sky: ['#1A1428', '#2A1F3D'], hasStars: true, hasTrees: false, particleType: 'stars', groundColor: '#355E28' };
  }
  if (m.includes('warm') || m.includes('reassuring')) {
    return { sky: ['#FFF8E7', '#FFB3C1'], hasStars: false, hasTrees: false, particleType: 'glow', groundColor: '#8BC070' };
  }
  if (m.includes('brave') || m.includes('kind')) {
    return { sky: ['#FFD166', '#7FB069'], hasStars: false, hasTrees: true, particleType: 'sparkle', groundColor: '#6A9F55' };
  }
  if (m.includes('calm') || m.includes('connected')) {
    return { sky: ['#C1E8C1', '#C4A6D6'], hasStars: false, hasTrees: true, particleType: 'feather', groundColor: '#7FB069' };
  }
  // Default
  return { sky: ['#87CEEB', '#FFD166'], hasStars: false, hasTrees: false, particleType: 'sparkle', groundColor: '#7FB069' };
}

/* ---- Rich Story Illustration Component ---- */
function StoryIllustration({ page, nightMode }: { page: StoryPage; nightMode: boolean }) {
  const theme = getMoodTheme(page.illustration.mood);
  const sky0 = nightMode ? '#1A1428' : theme.sky[0];
  const sky1 = nightMode ? '#2A1F3D' : theme.sky[1];

  return (
    <div className="relative w-full h-64 overflow-hidden" style={{ background: `linear-gradient(to bottom, ${sky0}, ${sky1})` }}>
      {/* Layer 1: Sky + Stars */}
      {(theme.hasStars || nightMode) && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: nightMode ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)',
                top: `${5 + Math.random() * 30}%`,
                left: `${5 + Math.random() * 90}%`,
              }}
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </>
      )}

      {/* Moon for night/peaceful moods */}
      {(theme.sky[0] === '#1A1428' || nightMode) && (
        <div className="absolute top-3 right-6 w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 opacity-80"
          style={{ boxShadow: '0 0 12px rgba(255,255,255,0.3)' }} />
      )}

      {/* Layer 2: Ground/Setting */}
      <div className="absolute bottom-0 left-[-10%] w-[60%] h-[35%] rounded-t-[50%]"
        style={{ background: nightMode ? '#264218' : theme.groundColor, opacity: 0.6 }} />
      <div className="absolute bottom-0 right-[-8%] w-[55%] h-[30%] rounded-t-[50%]"
        style={{ background: nightMode ? '#2D4A22' : theme.groundColor, opacity: 0.5 }} />

      {/* Trees for forest moods */}
      {theme.hasTrees && !nightMode && (
        <>
          <div className="absolute bottom-[28%] left-[10%]">
            <div className="w-4 h-6 rounded-t-full" style={{ background: '#5C8F48' }} />
            <div className="w-1.5 h-3 mx-auto" style={{ background: '#8B6F47' }} />
          </div>
          <div className="absolute bottom-[25%] right-[15%]">
            <div className="w-5 h-7 rounded-t-full" style={{ background: '#7FB069' }} />
            <div className="w-1.5 h-3 mx-auto" style={{ background: '#8B6F47' }} />
          </div>
          <div className="absolute bottom-[30%] left-[35%]">
            <div className="w-3.5 h-5 rounded-t-full" style={{ background: '#6A9F55' }} />
            <div className="w-1 h-2.5 mx-auto" style={{ background: '#8B6F47' }} />
          </div>
        </>
      )}

      {/* Layer 3: Mood particles */}
      {theme.particleType === 'sparkle' && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`sp-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: nightMode ? '#FFD16688' : page.illustration.colors[i % page.illustration.colors.length],
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 15}%`,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.5, 1.2, 0.5], y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </>
      )}

      {theme.particleType === 'feather' && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ft-${i}`}
              className="absolute w-2 h-4 rounded-full bg-white/50"
              style={{ left: `${20 + i * 25}%`, top: `${15 + i * 10}%` }}
              animate={{ y: [0, 30, 60], opacity: [0.6, 0.3, 0], rotate: [0, 20, -10] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
            />
          ))}
        </>
      )}

      {theme.particleType === 'stars' && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`st-${i}`}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{ left: `${10 + i * 20}%`, top: `${10 + (i % 3) * 12}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </>
      )}

      {theme.particleType === 'glow' && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`gl-${i}`}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: nightMode ? 'rgba(255,209,102,0.2)' : `${page.illustration.colors[i % page.illustration.colors.length]}44`,
                left: `${15 + i * 22}%`,
                top: `${25 + (i % 2) * 20}%`,
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        </>
      )}

      {/* Layer 4: Central figure */}
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex items-end gap-2">
        {/* Child figure */}
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full" style={{ background: '#D4A574' }} />
          <div className="w-5 h-8 rounded-lg mt-0.5" style={{ background: page.illustration.colors[0] || '#5DADE2' }} />
        </div>
        {/* Companion */}
        <div className="w-4 h-4 rounded-full mb-1" style={{ background: page.illustration.colors[1] || '#FF8C42', opacity: 0.7 }} />
      </div>

      {/* Illustration description */}
      <p className="absolute bottom-2 left-3 right-3 text-[10px] text-white/40 font-body italic text-center">
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
        <div className="max-w-lg mx-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-center mb-2 bg-gradient-to-r from-ember to-heart bg-clip-text text-transparent">
              My Story
            </h1>
            <p className="text-center font-body text-text-light mb-6">
              Let Ember write a magical book just for you!
            </p>

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
                <div className="grid grid-cols-2 gap-2">
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
      <div className="max-w-lg mx-auto px-4 py-4">
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
                <div className="h-64 flex items-center justify-center relative overflow-hidden"
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
                <div className="h-64 flex items-center justify-center relative overflow-hidden"
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

              {pageData && <StoryIllustration page={pageData} nightMode={nightMode} />}

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
      <BottomNav />
    </div>
  );
}
