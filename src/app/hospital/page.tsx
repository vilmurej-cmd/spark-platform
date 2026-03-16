'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONDITIONS, DEMO_STORY, type GeneratedStory } from '@/lib/spark-data';

const LOADING_MESSAGES = [
  "Writing your story...",
  "Adding the magic...",
  "Almost ready...",
];

export default function HospitalPage() {
  const [phase, setPhase] = useState<'form' | 'loading' | 'reader'>('form');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('7');
  const [condition, setCondition] = useState('');
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(0);

  const handleSubmit = async () => {
    if (!childName.trim() || !condition) return;
    setPhase('loading');
    setLoadingMsg(0);

    const interval = setInterval(() => {
      setLoadingMsg(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    try {
      const res = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childName: childName.trim(), childAge: Number(childAge), condition }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setStory(data.story);
      } else {
        fallback();
      }
    } catch {
      fallback();
    } finally {
      clearInterval(interval);
      setCurrentPage(0);
      setPhase('reader');
    }
  };

  const fallback = () => {
    const name = childName.trim() || 'Sam';
    setStory({
      ...DEMO_STORY,
      title: `${name} and the Breathing Dragon`,
      dedication: `For ${name}, who is braver than they know`,
      pages: DEMO_STORY.pages.map(p => ({
        ...p,
        text: p.text.replace(/\bSam\b/g, name).replace(/\bSam's\b/g, `${name}'s`),
      })),
    });
  };

  // FORM
  if (phase === 'form') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md">
          <div className="text-center mb-8">
            <motion.div className="text-6xl mb-3" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
              ✨🦊✨
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-ember">SPARK</h1>
            <p className="font-body text-text-light">Hospital Quick Start</p>
          </div>

          <div className="space-y-4">
            <input type="text" value={childName} onChange={e => setChildName(e.target.value)}
              placeholder="Child's name"
              className="w-full px-5 py-4 rounded-2xl border-2 border-spark/30 bg-white font-body text-lg focus:border-ember focus:outline-none" />

            <input type="number" value={childAge} onChange={e => setChildAge(e.target.value)}
              placeholder="Age" min={3} max={15}
              className="w-full px-5 py-4 rounded-2xl border-2 border-spark/30 bg-white font-body text-lg focus:border-ember focus:outline-none" />

            <select value={condition} onChange={e => setCondition(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-spark/30 bg-white font-body text-lg focus:border-ember focus:outline-none">
              <option value="">Condition...</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button onClick={handleSubmit} disabled={!childName.trim() || !condition}
              className="btn-spark btn-primary w-full text-xl py-5 disabled:opacity-40">
              Create Story
            </button>
          </div>

          <div className="text-center mt-6">
            <a href="/hospital/partner" className="font-body text-sm text-text-muted hover:text-ember underline">
              Hospital Partner Info
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // LOADING
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <motion.div className="text-7xl mb-4"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            📖
          </motion.div>
          <motion.p key={loadingMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-display font-semibold text-xl text-ember">
            {LOADING_MESSAGES[loadingMsg]}
          </motion.p>
        </div>
      </div>
    );
  }

  // READER
  if (!story) return null;
  const totalPages = story.pages.length + 2;
  const isCover = currentPage === 0;
  const isEnd = currentPage === totalPages - 1;
  const pageData = !isCover && !isEnd ? story.pages[currentPage - 1] : null;

  return (
    <div className="min-h-screen bg-cream p-4">
      <div className="max-w-2xl mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setPhase('form'); setStory(null); }}
            className="font-display text-sm text-text-muted hover:text-ember">
            ← New Story
          </button>
          <button onClick={() => window.print()}
            className="btn-spark btn-secondary text-sm py-2 px-4 no-print">
            Print Brave Kit
          </button>
        </div>

        {/* Page */}
        <AnimatePresence mode="wait">
          <motion.div key={currentPage}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="spark-card overflow-hidden mb-6">

            <div className="h-48 flex items-center justify-center"
              style={{ background: pageData ? `linear-gradient(135deg, ${pageData.illustration.colors[0]}33, ${pageData.illustration.colors[1]}33)` : 'linear-gradient(135deg, #FF8C4222, #FFD16622)' }}>
              {isCover && (
                <div className="text-center px-4">
                  <div className="text-5xl mb-2">📖✨</div>
                  <h1 className="font-display font-bold text-2xl text-text">{story.title}</h1>
                  <p className="font-body text-sm text-text-muted italic mt-1">{story.dedication}</p>
                </div>
              )}
              {isEnd && (
                <div className="text-center px-4">
                  <div className="text-4xl mb-2">🌟</div>
                  <h2 className="font-display font-bold text-xl text-text">The End</h2>
                </div>
              )}
              {pageData && (
                <div className="w-24 h-24 rounded-full opacity-30"
                  style={{ background: `radial-gradient(circle, ${pageData.illustration.colors[0]}, ${pageData.illustration.colors[1]})` }} />
              )}
            </div>

            <div className="p-6">
              {pageData && <p className="font-body text-lg leading-relaxed text-text">{pageData.text}</p>}
              {isEnd && story.aboutTheCondition && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-brave/10">
                    <p className="font-display font-semibold text-sm text-brave mb-1">For Kids</p>
                    <p className="font-body text-sm">{story.aboutTheCondition.forKids}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-dream/10">
                    <p className="font-display font-semibold text-sm text-dream mb-1">For Parents</p>
                    <p className="font-body text-sm">{story.aboutTheCondition.forParents}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}
            className="btn-spark btn-secondary py-3 px-6 text-lg disabled:opacity-30">
            ← Back
          </button>
          <span className="font-display text-text-muted">{currentPage + 1} / {totalPages}</span>
          <button onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1}
            className="btn-spark btn-primary py-3 px-6 text-lg disabled:opacity-30">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
