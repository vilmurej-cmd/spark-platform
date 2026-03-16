'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/Ember';
import {
  getProfile, STORY_TONES, FAVORITE_THINGS, CONDITIONS, DEMO_STORY,
  type GeneratedStory, type StorybookData, earnBadge, saveProfile,
} from '@/lib/spark-data';

const LOADING_MESSAGES = [
  "Ember is writing your story...",
  "Mixing the magic ink...",
  "Drawing the pictures...",
  "Adding extra sparkle...",
  "Almost ready, brave one...",
  "Putting on the finishing touches...",
];

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
    if (next < 0 || next >= story.pages.length + 2) return; // +2 for cover & end
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
          {/* Sparkle particles */}
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
  const totalPages = story.pages.length + 2; // cover + pages + end
  const isCover = currentPage === 0;
  const isEnd = currentPage === totalPages - 1;
  const pageData = !isCover && !isEnd ? story.pages[currentPage - 1] : null;

  const gradientBg = pageData
    ? `linear-gradient(135deg, ${pageData.illustration.colors[0]}33, ${pageData.illustration.colors[1]}33, ${pageData.illustration.colors[2] || pageData.illustration.colors[0]}22)`
    : isCover
      ? 'linear-gradient(135deg, #FF8C4233, #FFD16633, #FF6B8A22)'
      : 'linear-gradient(135deg, #FFD16633, #7FB06933, #5DADE233)';

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-500 ${nightMode ? 'night-mode' : ''}`}
      style={{ background: nightMode ? '#1A1428' : '#FFF8E7' }}>
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Controls bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setPhase('form'); window.speechSynthesis.cancel(); }}
            className="text-sm font-display text-text-muted hover:text-ember transition-colors">
            New Story
          </button>
          <div className="flex gap-2">
            <button onClick={readAloud}
              className={`px-3 py-1.5 rounded-full text-sm font-display transition-all ${isReading ? 'bg-heart text-white' : 'bg-white border border-spark/30'}`}>
              {isReading ? 'Stop' : 'Read to Me'}
            </button>
            <button onClick={() => setNightMode(!nightMode)}
              className="px-3 py-1.5 rounded-full text-sm font-display bg-white border border-spark/30">
              {nightMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Page display */}
        <AnimatePresence mode="wait">
          <motion.div key={currentPage}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl overflow-hidden shadow-xl mb-6"
            style={{ background: nightMode ? '#2A2438' : 'white' }}>

            {/* Illustration area */}
            <div className="h-56 flex items-center justify-center relative overflow-hidden"
              style={{ background: nightMode ? gradientBg.replace(/33/g, '22') : gradientBg }}>
              {isCover && (
                <div className="text-center px-6">
                  <motion.div className="text-6xl mb-3" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                    📖✨
                  </motion.div>
                  <h1 className="font-display font-bold text-2xl text-text">{story.title}</h1>
                  <p className="font-body text-sm text-text-muted mt-2 italic">{story.dedication}</p>
                </div>
              )}
              {isEnd && (
                <div className="text-center px-6">
                  <motion.div className="text-5xl mb-3" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    🌟
                  </motion.div>
                  <h2 className="font-display font-bold text-xl text-text">The End</h2>
                  <p className="font-body text-sm text-text-muted mt-1">You are braver than you know.</p>
                </div>
              )}
              {pageData && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${pageData.illustration.colors[0]}, ${pageData.illustration.colors[1]})` }} />
                  <p className="absolute bottom-3 left-4 right-4 text-xs text-text-muted/60 font-body italic text-center">
                    {pageData.illustration.description}
                  </p>
                </div>
              )}
            </div>

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
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => goPage(-1)} disabled={currentPage === 0}
            className="btn-spark btn-secondary text-sm disabled:opacity-30">
            Previous
          </button>
          <span className="font-display text-sm text-text-muted">{currentPage + 1} / {totalPages}</span>
          <button onClick={() => goPage(1)} disabled={currentPage === totalPages - 1}
            className="btn-spark btn-primary text-sm disabled:opacity-30">
            Next
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => { setCurrentPage(i); if (i === totalPages - 1) handleFinishReading(); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentPage ? 'bg-ember scale-125' : 'bg-spark/40'}`} />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
