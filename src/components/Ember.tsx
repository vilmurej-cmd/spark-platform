'use client';

import { motion } from 'framer-motion';

interface EmberProps {
  message: string;
  expression?: 'happy' | 'encouraging' | 'thinking' | 'celebrating' | 'gentle';
  size?: 'sm' | 'md' | 'lg';
}

const EXPRESSIONS: Record<string, string> = {
  happy: '🦊',
  encouraging: '🦊',
  thinking: '🤔',
  celebrating: '🎉',
  gentle: '🦊',
};

export default function Ember({ message, expression = 'happy', size = 'md' }: EmberProps) {
  const sizeClasses = {
    sm: 'h-10 w-10 text-lg',
    md: 'h-14 w-14 text-2xl',
    lg: 'h-20 w-20 text-4xl',
  };

  return (
    <div className="flex items-start gap-3 mb-6">
      <motion.div
        className="flex-shrink-0"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-ember flex items-center justify-center shadow-lg shadow-orange-200/50`}>
          {EXPRESSIONS[expression]}
        </div>
        {/* Bandage on paw — Ember's signature */}
        <div className="w-3 h-1.5 bg-white rounded-full mx-auto -mt-1 border border-orange-200" />
      </motion.div>
      <div className="relative bg-white rounded-2xl rounded-tl-sm border-2 border-orange-200 px-4 py-3 shadow-sm max-w-sm">
        <p className="text-sm text-text font-body font-medium leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

/* ---- Spark Burst Animation ---- */
export function SparkBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-spark"
          initial={{
            left: '50%',
            top: '50%',
            opacity: 1,
            scale: 0,
          }}
          animate={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            opacity: 0,
            scale: 1.5,
          }}
          transition={{ duration: 1 + Math.random(), ease: 'easeOut' }}
          style={{ background: ['#FFD166', '#FF8C42', '#FF6B8A', '#5DADE2', '#9B72CF'][i % 5] }}
        />
      ))}
    </div>
  );
}

/* ---- Bottom Navigation — Responsive ---- */
export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-spark/20 px-2 py-2 no-print">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {[
          { href: '/', emoji: '🏠', label: 'Home' },
          { href: '/story', emoji: '📖', label: 'My Story' },
          { href: '/games', emoji: '🎮', label: 'Games' },
          { href: '/badges', emoji: '🏅', label: 'Badges' },
          { href: '/campfire', emoji: '🔥', label: 'Campfire' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-spark/10 transition-colors min-w-[56px] md:min-w-[72px] lg:min-w-[80px]"
          >
            <span className="text-xl md:text-2xl lg:text-2xl">{item.emoji}</span>
            <span className="text-[10px] md:text-xs lg:text-sm font-display font-medium text-text-light">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
