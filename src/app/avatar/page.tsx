'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/Ember';
import { getProfile, saveProfile } from '@/lib/spark-data';

const BODY_TYPES = [
  { value: 'standing', label: 'Standing', emoji: '🧍' },
  { value: 'sitting', label: 'Sitting', emoji: '🪑' },
  { value: 'wheelchair', label: 'Wheelchair', emoji: '🧑‍🦽' },
];

const SKIN_TONES = ['#FDDCB5', '#E8B98A', '#D4956B', '#A56B43', '#6B3E26', '#3D2314'];
const HAIR_STYLES = [
  { value: 'short', label: 'Short' },
  { value: 'long', label: 'Long' },
  { value: 'curly', label: 'Curly' },
  { value: 'none', label: 'None' },
];
const HAIR_COLORS = ['#2C1810', '#8B4513', '#DAA520', '#D2691E', '#DC143C'];
const POWER_TOOLS = [
  { value: 'inhaler', label: 'Inhaler', emoji: '💨' },
  { value: 'insulin-pump', label: 'Insulin Pump', emoji: '💎' },
  { value: 'hearing-aids', label: 'Hearing Aids', emoji: '🔔' },
  { value: 'wheelchair', label: 'Wheelchair', emoji: '⚡' },
  { value: 'prosthetic', label: 'Prosthetic', emoji: '🦾' },
  { value: 'invisible', label: 'Invisible Power', emoji: '✨' },
];
const CAPE_COLORS = ['#FF8C42', '#FF6B8A', '#5DADE2', '#9B72CF', '#7FB069', '#FFD166'];

export default function AvatarPage() {
  const [bodyType, setBodyType] = useState('standing');
  const [skinTone, setSkinTone] = useState(SKIN_TONES[0]);
  const [hairStyle, setHairStyle] = useState('short');
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [hasGlasses, setHasGlasses] = useState(false);
  const [powerTool, setPowerTool] = useState('invisible');
  const [capeColor, setCapeColor] = useState(CAPE_COLORS[0]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (p?.avatarConfig) {
      const a = p.avatarConfig;
      if (a.bodyType) setBodyType(a.bodyType);
      if (a.skinTone) setSkinTone(a.skinTone);
      if (a.hairStyle) setHairStyle(a.hairStyle);
      if (a.hairColor) setHairColor(a.hairColor);
      if (a.hasGlasses !== undefined) setHasGlasses(a.hasGlasses);
      if (a.powerTool) setPowerTool(a.powerTool);
      if (a.capeColor) setCapeColor(a.capeColor);
    }
  }, []);

  const handleSave = () => {
    const p = getProfile();
    if (p) {
      p.avatarConfig = { bodyType, skinTone, hairStyle, hairColor, hasGlasses, powerTool, capeColor, companionType: p.avatarConfig?.companionType || '' };
      saveProfile(p);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const hairPath = hairStyle === 'short'
    ? 'M30,26 Q40,16 50,26 Q60,16 70,26'
    : hairStyle === 'long'
      ? 'M25,26 Q40,12 50,22 Q60,12 75,26 L75,50 Q50,55 25,50Z'
      : hairStyle === 'curly'
        ? 'M28,30 Q30,18 38,20 Q42,12 50,18 Q58,12 62,20 Q70,18 72,30'
        : '';

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-center mb-1 bg-gradient-to-r from-dream to-brave bg-clip-text text-transparent">
            My Avatar
          </h1>
          <p className="text-center font-body text-text-light mb-6">
            Create your brave hero!
          </p>

          {/* Avatar Preview */}
          <div className="spark-card p-6 mb-6 flex justify-center"
            style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFD16622)' }}>
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
              style={{ width: 160, height: 200, position: 'relative' }}>
              <svg viewBox="0 0 100 130" width="160" height="200">
                {/* Cape */}
                <path d="M30,55 L20,110 Q50,120 80,110 L70,55" fill={capeColor} opacity="0.7" />
                <path d="M30,55 L25,100 Q50,108 75,100 L70,55" fill={capeColor} opacity="0.9" />

                {/* Body */}
                {bodyType === 'wheelchair' ? (
                  <>
                    <rect x="28" y="60" width="44" height="35" rx="8" fill={skinTone} />
                    {/* Wheelchair */}
                    <circle cx="35" cy="108" r="14" fill="none" stroke="#666" strokeWidth="2.5" />
                    <circle cx="65" cy="108" r="14" fill="none" stroke="#666" strokeWidth="2.5" />
                    <line x1="30" y1="95" x2="70" y2="95" stroke="#666" strokeWidth="2" />
                    <rect x="25" y="88" width="50" height="8" rx="3" fill="#888" />
                  </>
                ) : bodyType === 'sitting' ? (
                  <>
                    <rect x="32" y="55" width="36" height="30" rx="8" fill={skinTone} />
                    {/* Legs bent */}
                    <rect x="34" y="85" width="14" height="20" rx="5" fill={skinTone} />
                    <rect x="52" y="85" width="14" height="20" rx="5" fill={skinTone} />
                  </>
                ) : (
                  <>
                    <rect x="32" y="55" width="36" height="30" rx="8" fill={skinTone} />
                    {/* Legs */}
                    <rect x="34" y="85" width="12" height="28" rx="5" fill={skinTone} />
                    <rect x="54" y="85" width="12" height="28" rx="5" fill={skinTone} />
                    {/* Shoes */}
                    <ellipse cx="40" cy="115" rx="8" ry="4" fill="#555" />
                    <ellipse cx="60" cy="115" rx="8" ry="4" fill="#555" />
                  </>
                )}

                {/* Arms */}
                <rect x="18" y="58" width="12" height="24" rx="6" fill={skinTone} />
                <rect x="70" y="58" width="12" height="24" rx="6" fill={skinTone} />

                {/* Head */}
                <circle cx="50" cy="35" r="20" fill={skinTone} />

                {/* Hair */}
                {hairStyle !== 'none' && (
                  <path d={hairPath} fill={hairColor} stroke="none" />
                )}

                {/* Eyes */}
                <circle cx="43" cy="35" r="2.5" fill="#333" />
                <circle cx="57" cy="35" r="2.5" fill="#333" />
                <circle cx="44" cy="34" r="0.8" fill="white" />
                <circle cx="58" cy="34" r="0.8" fill="white" />

                {/* Glasses */}
                {hasGlasses && (
                  <>
                    <circle cx="43" cy="35" r="6" fill="none" stroke="#333" strokeWidth="1.5" />
                    <circle cx="57" cy="35" r="6" fill="none" stroke="#333" strokeWidth="1.5" />
                    <line x1="49" y1="35" x2="51" y2="35" stroke="#333" strokeWidth="1.5" />
                    <line x1="37" y1="33" x2="30" y2="30" stroke="#333" strokeWidth="1.5" />
                    <line x1="63" y1="33" x2="70" y2="30" stroke="#333" strokeWidth="1.5" />
                  </>
                )}

                {/* Smile */}
                <path d="M44,41 Q50,46 56,41" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

                {/* Power tool */}
                {powerTool === 'inhaler' && <rect x="74" y="65" width="8" height="14" rx="2" fill="#5DADE2" />}
                {powerTool === 'insulin-pump' && <circle cx="68" cy="68" r="4" fill="#14B8A6" />}
                {powerTool === 'hearing-aids' && (
                  <><circle cx="30" cy="35" r="3" fill="#FFD166" /><circle cx="70" cy="35" r="3" fill="#FFD166" /></>
                )}
                {powerTool === 'prosthetic' && <rect x="70" y="58" width="12" height="24" rx="6" fill="#C0C0C0" />}
                {powerTool === 'invisible' && (
                  <text x="78" y="56" fontSize="10">✨</text>
                )}
              </svg>
            </motion.div>
          </div>

          {/* Options */}
          <div className="space-y-5">
            {/* Body type */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Body Type</label>
              <div className="flex gap-2">
                {BODY_TYPES.map(b => (
                  <button key={b.value} onClick={() => setBodyType(b.value)}
                    className={`flex-1 p-3 rounded-xl text-center transition-all ${bodyType === b.value ? 'bg-gradient-to-br from-ember/20 to-heart/20 border-2 border-ember' : 'bg-white border-2 border-spark/20'}`}>
                    <span className="text-xl block">{b.emoji}</span>
                    <span className="font-display text-xs">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin tone */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Skin Tone</label>
              <div className="flex gap-2">
                {SKIN_TONES.map(tone => (
                  <button key={tone} onClick={() => setSkinTone(tone)}
                    className={`w-10 h-10 rounded-full border-3 transition-all ${skinTone === tone ? 'ring-3 ring-ember ring-offset-2 scale-110' : 'border-transparent'}`}
                    style={{ background: tone }} />
                ))}
              </div>
            </div>

            {/* Hair style */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Hair Style</label>
              <div className="flex gap-2">
                {HAIR_STYLES.map(h => (
                  <button key={h.value} onClick={() => setHairStyle(h.value)}
                    className={`flex-1 py-2 rounded-xl text-center font-display text-sm transition-all ${hairStyle === h.value ? 'bg-ember text-white' : 'bg-white border-2 border-spark/20'}`}>
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair color */}
            {hairStyle !== 'none' && (
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-2">Hair Color</label>
                <div className="flex gap-2">
                  {HAIR_COLORS.map(color => (
                    <button key={color} onClick={() => setHairColor(color)}
                      className={`w-10 h-10 rounded-full transition-all ${hairColor === color ? 'ring-3 ring-ember ring-offset-2 scale-110' : ''}`}
                      style={{ background: color }} />
                  ))}
                </div>
              </div>
            )}

            {/* Glasses */}
            <div className="spark-card p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-display font-semibold text-text">Glasses</span>
                <button onClick={() => setHasGlasses(!hasGlasses)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${hasGlasses ? 'bg-ember' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${hasGlasses ? 'left-7' : 'left-1'}`} />
                </button>
              </label>
            </div>

            {/* Power tool */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Power Tool</label>
              <div className="grid grid-cols-3 gap-2">
                {POWER_TOOLS.map(t => (
                  <button key={t.value} onClick={() => setPowerTool(t.value)}
                    className={`p-3 rounded-xl text-center transition-all ${powerTool === t.value ? 'bg-gradient-to-br from-brave/20 to-dream/20 border-2 border-brave' : 'bg-white border-2 border-spark/20'}`}>
                    <span className="text-xl block">{t.emoji}</span>
                    <span className="font-display text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cape color */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Cape Color</label>
              <div className="flex gap-2">
                {CAPE_COLORS.map(color => (
                  <button key={color} onClick={() => setCapeColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${capeColor === color ? 'ring-3 ring-ember ring-offset-2 scale-110' : ''}`}
                    style={{ background: color }} />
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="btn-spark btn-primary w-full text-lg">
              {saved ? 'Saved! ✨' : 'Save My Avatar'}
            </button>
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
