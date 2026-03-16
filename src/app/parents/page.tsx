'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/Ember';
import { getProfile, saveProfile, ALL_BADGES } from '@/lib/spark-data';

const TALKING_POINTS = [
  { title: 'Starting the conversation', text: "\"You know how some people wear glasses to help their eyes? Your [treatment] helps your body in a similar way. It's your superpower tool.\"" },
  { title: 'When they ask \"Why me?\"', text: "\"Lots of amazing people have what you have. It doesn't make you less — it makes you someone who knows how to be brave every single day.\"" },
  { title: 'Explaining to siblings', text: "\"[Name] needs some extra help from doctors, just like you might need extra help with math or tying shoes. We all need help with different things.\"" },
  { title: 'Before a hospital visit', text: "\"Tomorrow we're going to the hospital. The doctors are going to help you, and I'll be right there. You can bring your favorite toy and we'll read your story together.\"" },
  { title: 'When school is hard', text: "\"It's okay to feel different. But different doesn't mean wrong. It means you know things other kids don't know yet — like how to be brave.\"" },
];

const BOOKS = [
  { title: 'The Invisible String', author: 'Patrice Karst', age: '3-8', desc: 'About connection and feeling safe' },
  { title: 'Brave Irene', author: 'William Steig', age: '4-8', desc: 'A story about determination and bravery' },
  { title: 'After the Fall', author: 'Dan Santat', age: '4-8', desc: 'Getting back up after something hard' },
  { title: 'The OK Book', author: 'Amy Krouse Rosenthal', age: '3-6', desc: 'Being okay with who you are' },
  { title: 'Emmanuel\'s Dream', author: 'Laurie Ann Thompson', age: '5-10', desc: 'True story of a boy born with one leg' },
  { title: 'Wonder', author: 'R.J. Palacio', age: '8-12', desc: 'Kindness and acceptance' },
];

export default function ParentsPage() {
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [childName, setChildName] = useState('');
  const [childCondition, setChildCondition] = useState('');
  const [badgesCount, setBadgesCount] = useState(0);
  const [storiesCount, setStoriesCount] = useState(0);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setStoredPin(p.parentPin || null);
      setChildName(p.name || 'Your child');
      setChildCondition(p.condition || 'Not set');
      setBadgesCount(p.badges?.length || 0);
      setStoriesCount(p.stories?.length || 0);
      if (!p.parentPin) setIsSettingPin(true);
    } else {
      setIsSettingPin(true);
    }
  }, []);

  const handlePinSubmit = () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setPinError('Please enter a 4-digit PIN');
      return;
    }
    if (isSettingPin) {
      const p = getProfile();
      if (p) {
        p.parentPin = pin;
        saveProfile(p);
        setStoredPin(pin);
      }
      setIsUnlocked(true);
      setIsSettingPin(false);
    } else if (pin === storedPin) {
      setIsUnlocked(true);
    } else {
      setPinError('Incorrect PIN. Try again.');
    }
    setPin('');
  };

  // PIN Screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-cream pb-24 flex items-center justify-center">
        <div className="max-w-sm mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-5xl block mb-4">🔒</span>
            <h1 className="text-2xl font-display font-bold text-text mb-2">
              {isSettingPin ? 'Set Your PIN' : 'Parent Area'}
            </h1>
            <p className="font-body text-text-light text-sm mb-6">
              {isSettingPin
                ? 'Create a 4-digit PIN to protect the parent dashboard.'
                : 'Enter your 4-digit PIN to continue.'}
            </p>

            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-display text-xl ${pin.length > i ? 'border-ember bg-ember/10 text-ember' : 'border-spark/30'}`}>
                  {pin.length > i ? '●' : ''}
                </div>
              ))}
            </div>

            {pinError && <p className="font-body text-heart text-sm mb-3">{pinError}</p>}

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((n, i) => {
                if (n === null) return <div key={i} />;
                return (
                  <button key={i}
                    onClick={() => {
                      setPinError('');
                      if (n === 'del') setPin(prev => prev.slice(0, -1));
                      else if (pin.length < 4) setPin(prev => prev + n);
                    }}
                    className="h-14 rounded-xl font-display text-lg bg-white border-2 border-spark/20 hover:border-ember transition-colors">
                    {n === 'del' ? '←' : n}
                  </button>
                );
              })}
            </div>

            <button onClick={handlePinSubmit} disabled={pin.length !== 4}
              className="btn-spark btn-primary w-full disabled:opacity-40">
              {isSettingPin ? 'Set PIN' : 'Unlock'}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-center mb-1 text-text">
            For Parents
          </h1>
          <p className="text-center font-body text-text-light mb-6">
            {childName}&apos;s SPARK Dashboard
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="spark-card p-4 text-center">
              <p className="text-3xl font-display font-bold text-ember">{badgesCount}</p>
              <p className="font-body text-sm text-text-muted">Badges Earned</p>
            </div>
            <div className="spark-card p-4 text-center">
              <p className="text-3xl font-display font-bold text-dream">{storiesCount}</p>
              <p className="font-body text-sm text-text-muted">Stories Created</p>
            </div>
          </div>

          {/* Child info */}
          <div className="spark-card p-5 mb-6">
            <h2 className="font-display font-semibold text-text mb-3">Profile</h2>
            <div className="space-y-2 font-body text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Name</span>
                <span className="text-text font-semibold">{childName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Condition</span>
                <span className="text-text font-semibold">{childCondition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Badges</span>
                <span className="text-text font-semibold">{badgesCount} / {ALL_BADGES.length}</span>
              </div>
            </div>
          </div>

          {/* Talking Points */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-lg text-ember mb-3">Talking Points</h2>
            <div className="space-y-3">
              {TALKING_POINTS.map((tp, i) => (
                <details key={i} className="spark-card overflow-hidden group">
                  <summary className="p-4 font-display font-semibold text-sm text-text cursor-pointer hover:bg-spark/5">
                    {tp.title}
                  </summary>
                  <div className="px-4 pb-4 pt-0">
                    <p className="font-body text-sm text-text-light italic leading-relaxed">{tp.text}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Recommended Books */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-lg text-dream mb-3">Recommended Books</h2>
            <div className="space-y-3">
              {BOOKS.map((book, i) => (
                <div key={i} className="spark-card p-4">
                  <h3 className="font-display font-semibold text-text text-sm">{book.title}</h3>
                  <p className="font-body text-xs text-text-muted">by {book.author} · Ages {book.age}</p>
                  <p className="font-body text-xs text-text-light mt-1">{book.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-lg text-forest mb-3">More From Vilmure Ventures</h2>
            <div className="space-y-2">
              {[
                { name: 'CLARITY', desc: 'Adult health empowerment', url: 'https://clarity-platform.vercel.app' },
                { name: 'HARMONY', desc: 'Couples & relationships', url: 'https://harmony-platform.vercel.app' },
                { name: 'HAVEN', desc: 'Faith-centered platform', url: 'https://haven-platform.vercel.app' },
              ].map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="spark-card p-4 flex items-center justify-between hover:shadow-md transition-shadow block">
                  <div>
                    <p className="font-display font-semibold text-sm text-text">{link.name}</p>
                    <p className="font-body text-xs text-text-muted">{link.desc}</p>
                  </div>
                  <span className="text-text-muted">→</span>
                </a>
              ))}
            </div>
          </div>

          <button onClick={() => setIsUnlocked(false)}
            className="btn-spark btn-secondary w-full text-sm">
            Lock Dashboard
          </button>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
