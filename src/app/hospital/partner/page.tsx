'use client';

import { motion } from 'framer-motion';

export default function HospitalPartnerPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">🦊✨</div>
            <h1 className="text-3xl font-display font-bold text-text mb-2">SPARK for Hospitals</h1>
            <p className="font-body text-text-light text-lg">Children&apos;s Health Empowerment Platform</p>
          </div>

          {/* Mission */}
          <div className="spark-card p-6 mb-6 text-center"
            style={{ background: 'linear-gradient(135deg, #FF8C4211, #FFD16611)' }}>
            <h2 className="font-display font-bold text-2xl text-ember mb-3">
              SPARK is free. It will always be free.
            </h2>
            <p className="font-body text-text leading-relaxed">
              Every child facing a health condition deserves to feel brave, understood, and never alone.
              SPARK uses personalized storytelling, gentle games, and a mascot named Ember to help children
              reframe their condition as a source of strength.
            </p>
          </div>

          {/* How it works */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-xl text-text mb-4">How Hospitals Can Use SPARK</h2>
            <div className="space-y-4">
              {[
                {
                  emoji: '📱',
                  title: 'Ward Tablets',
                  desc: 'Load SPARK on ward tablets. Children can create their personalized story in minutes with the Hospital Quick Start mode — just name, age, and condition.',
                },
                {
                  emoji: '📖',
                  title: 'Personalized Stories',
                  desc: 'Each child gets a storybook where THEY are the hero and their condition is a source of power. Print the story as a take-home brave kit.',
                },
                {
                  emoji: '🐉',
                  title: 'Breathing Exercises',
                  desc: 'Dragon Breathing is a guided breathing exercise disguised as a game. Perfect for pre-procedure anxiety.',
                },
                {
                  emoji: '🏅',
                  title: 'Brave Badges',
                  desc: 'Children earn badges for courage — getting through a blood test, a hospital stay, or helping another scared kid.',
                },
                {
                  emoji: '🖨️',
                  title: 'Print Brave Kits',
                  desc: 'Every story can be printed as a take-home brave kit. The child keeps their story forever.',
                },
              ].map((item, i) => (
                <motion.div key={i} className="spark-card p-5 flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h3 className="font-display font-semibold text-text">{item.title}</h3>
                    <p className="font-body text-sm text-text-light mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Evidence */}
          <div className="spark-card p-6 mb-6"
            style={{ background: 'linear-gradient(135deg, #5DADE211, #9B72CF11)' }}>
            <h2 className="font-display font-bold text-lg text-brave mb-3">Why It Works</h2>
            <ul className="space-y-3 font-body text-sm text-text">
              <li className="flex items-start gap-2">
                <span className="text-brave mt-0.5">●</span>
                <span>Narrative therapy research shows children who understand their condition through story have better treatment adherence and lower anxiety.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brave mt-0.5">●</span>
                <span>Reframing treatment tools as &quot;superpowers&quot; increases children&apos;s sense of agency and reduces fear.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brave mt-0.5">●</span>
                <span>Guided breathing exercises significantly reduce pre-procedure anxiety in pediatric settings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brave mt-0.5">●</span>
                <span>Seeing famous role models with the same condition normalizes the experience and builds hope.</span>
              </li>
            </ul>
          </div>

          {/* No cost */}
          <div className="spark-card p-6 mb-6 text-center border-2 border-ember/30">
            <h2 className="font-display font-bold text-lg text-text mb-2">No Cost. No Ads. No Data Collection.</h2>
            <p className="font-body text-sm text-text-light leading-relaxed">
              SPARK does not collect, store, or transmit any child data. All information stays on the device.
              Hospital Mode requires zero login and zero personal information beyond a first name.
            </p>
          </div>

          {/* Contact */}
          <div className="spark-card p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #7FB06911, #FFD16611)' }}>
            <h2 className="font-display font-bold text-lg text-text mb-3">Get SPARK for Your Hospital</h2>
            <p className="font-body text-text-light mb-4">
              We&apos;d love to bring SPARK to your ward. Reach out to learn how.
            </p>
            <a href="mailto:josh@myezre.ai"
              className="btn-spark btn-primary text-lg inline-block">
              josh@myezre.ai
            </a>
            <p className="font-body text-xs text-text-muted mt-4">
              A Vilmure Ventures platform
            </p>
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <a href="/hospital" className="font-display text-sm text-text-muted hover:text-ember">
              ← Back to Hospital Quick Start
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
