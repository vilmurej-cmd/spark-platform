'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav, SparkBurst } from '@/components/Ember';
import { ALL_BADGES, getProfile, earnBadge } from '@/lib/spark-data';

const COURAGE_CLAIMABLE = ['dragon-tamer', 'shot-superstar', 'hospital-hero', 'first-day-back', 'tell-my-story', 'helper-heart'];

const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  courage: { label: 'Courage Badges', emoji: '🛡️', color: '#FF8C42' },
  story: { label: 'Story Badges', emoji: '📖', color: '#9B72CF' },
  game: { label: 'Game Badges', emoji: '🎮', color: '#5DADE2' },
  kindness: { label: 'Kindness Badges', emoji: '💗', color: '#FF6B8A' },
  milestone: { label: 'Milestone Badges', emoji: '🏆', color: '#7FB069' },
};

export default function BadgesPage() {
  const [earned, setEarned] = useState<string[]>([]);
  const [childName, setChildName] = useState('Brave One');
  const [burst, setBurst] = useState(false);
  const [justEarned, setJustEarned] = useState<string | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setEarned(p.badges || []);
      setChildName(p.name || 'Brave One');
    }
  }, []);

  const handleClaim = (badgeId: string) => {
    const result = earnBadge(badgeId);
    if (result) {
      setEarned(prev => [...prev, badgeId]);
      setJustEarned(badgeId);
      setBurst(true);
      setTimeout(() => { setBurst(false); setJustEarned(null); }, 2000);
    }
  };

  const categories = ['courage', 'story', 'game', 'kindness', 'milestone'];

  return (
    <div className="min-h-screen bg-cream pb-24">
      <SparkBurst active={burst} />
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-center mb-1 bg-gradient-to-r from-ember to-spark bg-clip-text text-transparent">
            Brave Badges
          </h1>
          <p className="text-center font-body text-text-light mb-2">
            Every badge is proof of your courage
          </p>

          {/* Progress */}
          <div className="spark-card p-4 mb-6 text-center">
            <p className="font-display font-semibold text-lg text-ember">
              {earned.length} / {ALL_BADGES.length} earned
            </p>
            <div className="w-full h-3 bg-spark/20 rounded-full mt-2 overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-ember to-heart"
                initial={{ width: 0 }}
                animate={{ width: `${(earned.length / ALL_BADGES.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
          </div>

          {/* Badge categories */}
          {categories.map(cat => {
            const meta = CATEGORY_META[cat];
            const badges = ALL_BADGES.filter(b => b.category === cat);
            return (
              <div key={cat} className="mb-8">
                <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2" style={{ color: meta.color }}>
                  <span>{meta.emoji}</span> {meta.label}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {badges.map(badge => {
                    const isEarned = earned.includes(badge.id);
                    const isNew = justEarned === badge.id;
                    const canClaim = COURAGE_CLAIMABLE.includes(badge.id) && !isEarned;
                    return (
                      <motion.div key={badge.id}
                        className={`spark-card p-4 text-center relative overflow-hidden ${isEarned ? '' : 'opacity-60'}`}
                        style={isEarned ? { borderColor: '#FFD166', borderWidth: 3, boxShadow: '0 0 16px rgba(255,209,102,0.3)' } : {}}
                        animate={isNew ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}>
                        <div className={`text-3xl mb-2 ${isEarned ? '' : 'grayscale'}`} style={isEarned ? {} : { filter: 'grayscale(1)' }}>
                          {badge.emoji}
                        </div>
                        <h3 className="font-display font-semibold text-sm text-text">{badge.name}</h3>
                        <p className="font-body text-xs text-text-muted mt-1 leading-snug">{badge.description}</p>
                        {canClaim && (
                          <button onClick={() => handleClaim(badge.id)}
                            className="mt-2 btn-spark btn-primary text-xs py-1.5 px-3">
                            I Did This!
                          </button>
                        )}
                        {isEarned && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-spark to-ember flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Certificate of Bravery */}
          <div className="mt-8 spark-card p-6 text-center border-4 border-spark/50 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFD16622, #FF8C4211)' }}>
            <div className="absolute top-2 left-2 text-2xl">🌟</div>
            <div className="absolute top-2 right-2 text-2xl">🌟</div>
            <div className="absolute bottom-2 left-2 text-2xl">✨</div>
            <div className="absolute bottom-2 right-2 text-2xl">✨</div>
            <h2 className="font-display font-bold text-2xl text-ember mb-2">Certificate of Bravery</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-ember to-transparent mx-auto mb-3" />
            <p className="font-body text-text mb-1">This certifies that</p>
            <p className="font-display font-bold text-xl text-heart mb-1">{childName}</p>
            <p className="font-body text-text mb-3">
              has earned <span className="font-bold text-ember">{earned.length}</span> Brave Badges
              <br />and is officially one of the bravest people we know.
            </p>
            <p className="font-body text-sm text-text-muted italic mb-4">
              &quot;Being brave doesn&apos;t mean not being scared. It means doing the thing even when you are.&quot;
            </p>
            <button onClick={() => window.print()} className="btn-spark btn-secondary text-sm no-print">
              Print Certificate
            </button>
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
