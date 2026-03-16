'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Ember, { SparkBurst, BottomNav } from '@/components/Ember';
import { getProfile, saveProfile, SHOP_ITEMS, awardCoins } from '@/lib/spark-data';

const BODY_TYPES = [
  { value: 'standing', label: 'Standing', emoji: '🧍' },
  { value: 'sitting', label: 'Sitting', emoji: '🪑' },
  { value: 'wheelchair', label: 'Wheelchair', emoji: '🧑‍🦽' },
];

const SKIN_TONES = ['#FDDCB5', '#E8B98A', '#D4956B', '#A56B43', '#6B3E26', '#3D2314', '#F5D6C3', '#C68642'];
const VITILIGO_ID = 'vitiligo';

const HAIR_STYLES = [
  { value: 'short', label: 'Short' },
  { value: 'long', label: 'Long' },
  { value: 'curly', label: 'Curly' },
  { value: 'braids', label: 'Braids' },
  { value: 'afro', label: 'Afro' },
  { value: 'bald', label: '✨ Wind Racer ✨' },
  { value: 'mohawk', label: 'Mohawk' },
  { value: 'ponytail', label: 'Ponytail' },
];

const HAIR_COLORS = [
  { value: '#2C1810', label: 'Black' },
  { value: '#8B4513', label: 'Brown' },
  { value: '#DAA520', label: 'Blonde' },
  { value: '#D2691E', label: 'Auburn' },
  { value: '#DC143C', label: 'Red' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#9B72CF', label: 'Purple' },
  { value: '#FF6B8A', label: 'Pink' },
  { value: 'rainbow', label: 'Rainbow' },
];

const POWER_TOOLS = [
  { value: 'inhaler', label: 'Dragon Whisper', emoji: '💨' },
  { value: 'insulin-pump', label: 'Crystal Keeper', emoji: '💎' },
  { value: 'hearing-aids', label: 'Echo Gems', emoji: '🔔' },
  { value: 'wheelchair', label: 'Thunder Throne', emoji: '⚡' },
  { value: 'prosthetic', label: 'Power Limb', emoji: '🦾' },
  { value: 'leg-braces', label: 'Lightning Striders', emoji: '⚡' },
  { value: 'communication-device', label: 'Voice Star', emoji: '🌟' },
  { value: 'epipen', label: 'Shield Staff', emoji: '🛡️' },
  { value: 'heart-monitor', label: 'Rhythm Stone', emoji: '❤️' },
  { value: 'invisible', label: 'Invisible Power', emoji: '✨' },
];

const CAPE_COLORS = ['#FF8C42', '#FF6B8A', '#5DADE2', '#9B72CF', '#7FB069', '#FFD166'];

const COMPANION_ANIMALS = ['🐕', '🐈', '🐇', '🐦', '🐉', '🦄', '🦊', '🐻', '🦋', '🦉', '🐢', '🐧'];

export default function AvatarPage() {
  const [bodyType, setBodyType] = useState('standing');
  const [skinTone, setSkinTone] = useState(SKIN_TONES[0]);
  const [isVitiligo, setIsVitiligo] = useState(false);
  const [hairStyle, setHairStyle] = useState('short');
  const [hairColor, setHairColor] = useState('#2C1810');
  const [hasGlasses, setHasGlasses] = useState(false);
  const [powerTool, setPowerTool] = useState('invisible');
  const [capeColor, setCapeColor] = useState(CAPE_COLORS[0]);
  const [companion, setCompanion] = useState('🦊');
  const [saved, setSaved] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    const p = getProfile();
    if (p?.avatarConfig) {
      const a = p.avatarConfig;
      if (a.bodyType) setBodyType(a.bodyType);
      if (a.skinTone) {
        if (a.skinTone === VITILIGO_ID) {
          setIsVitiligo(true);
          setSkinTone(SKIN_TONES[3]);
        } else {
          setSkinTone(a.skinTone);
        }
      }
      if (a.hairStyle) setHairStyle(a.hairStyle);
      if (a.hairColor) setHairColor(a.hairColor);
      if (a.hasGlasses !== undefined) setHasGlasses(a.hasGlasses);
      if (a.powerTool) setPowerTool(a.powerTool);
      if (a.capeColor) setCapeColor(a.capeColor);
      if (a.companionType) setCompanion(a.companionType);
    }
    if (p?.name) setProfileName(p.name);
  }, []);

  const handleSave = () => {
    const p = getProfile();
    if (p) {
      p.avatarConfig = {
        bodyType,
        skinTone: isVitiligo ? VITILIGO_ID : skinTone,
        hairStyle,
        hairColor,
        hasGlasses,
        powerTool,
        capeColor,
        companionType: companion,
      };
      saveProfile(p);
      setSaved(true);
      setShowBurst(true);
      setTimeout(() => { setSaved(false); setShowBurst(false); }, 2500);
    }
  };

  const capeInitial = profileName ? profileName.charAt(0).toUpperCase() : '';

  // Hair path generation
  const getHairPath = () => {
    switch (hairStyle) {
      case 'short': return 'M30,26 Q40,16 50,26 Q60,16 70,26';
      case 'long': return 'M25,26 Q40,12 50,22 Q60,12 75,26 L75,50 Q50,55 25,50Z';
      case 'curly': return 'M28,30 Q30,18 38,20 Q42,12 50,18 Q58,12 62,20 Q70,18 72,30 Q74,22 68,16 Q60,8 50,14 Q40,8 32,16 Q26,22 28,30Z';
      case 'braids': return 'M30,26 Q40,14 50,24 Q60,14 70,26';
      case 'afro': return 'M22,34 Q20,14 35,10 Q50,4 65,10 Q80,14 78,34 Q76,20 50,12 Q24,20 22,34Z';
      case 'mohawk': return 'M44,10 Q50,2 56,10 L56,26 L44,26Z';
      case 'ponytail': return 'M30,26 Q40,16 50,24 Q60,16 70,26';
      default: return '';
    }
  };

  const hairColorFill = hairColor === 'rainbow'
    ? 'url(#rainbowGrad)'
    : hairColor;

  return (
    <div className="min-h-screen bg-cream pb-24">
      <SparkBurst active={showBurst} />
      <div className="spark-container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-center mb-1 bg-gradient-to-r from-dream to-brave bg-clip-text text-transparent">
            My Avatar
          </h1>
          <p className="text-center font-body text-text-light mb-6">
            Create your brave hero!
          </p>

          {/* Avatar Preview — 240px tall */}
          <div className="spark-card p-6 mb-6 flex justify-center"
            style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFD16622)' }}>
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
              style={{ width: 192, height: 240, position: 'relative' }}>
              <svg viewBox="0 0 100 130" width="192" height="240">
                <defs>
                  <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B8A" />
                    <stop offset="25%" stopColor="#FFD166" />
                    <stop offset="50%" stopColor="#7FB069" />
                    <stop offset="75%" stopColor="#5DADE2" />
                    <stop offset="100%" stopColor="#9B72CF" />
                  </linearGradient>
                  {/* Vitiligo pattern */}
                  {isVitiligo && (
                    <pattern id="vitiligoPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                      <rect width="12" height="12" fill={skinTone} />
                      <circle cx="3" cy="3" r="2.5" fill="#FDDCB5" opacity="0.7" />
                      <circle cx="9" cy="8" r="2" fill="#FDDCB5" opacity="0.6" />
                    </pattern>
                  )}
                </defs>

                {/* Cape with flutter animation */}
                <g>
                  <motion.path
                    d="M30,55 L20,112 Q50,122 80,112 L70,55"
                    fill={capeColor}
                    opacity="0.7"
                    animate={{ d: ['M30,55 L20,112 Q50,122 80,112 L70,55', 'M30,55 L18,114 Q50,120 82,114 L70,55', 'M30,55 L20,112 Q50,122 80,112 L70,55'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.path
                    d="M30,55 L25,102 Q50,110 75,102 L70,55"
                    fill={capeColor}
                    opacity="0.9"
                    animate={{ d: ['M30,55 L25,102 Q50,110 75,102 L70,55', 'M30,55 L23,104 Q50,108 77,104 L70,55', 'M30,55 L25,102 Q50,110 75,102 L70,55'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  />
                  {/* Initial on cape */}
                  {capeInitial && (
                    <text x="50" y="82" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" opacity="0.9" fontFamily="sans-serif">
                      {capeInitial}
                    </text>
                  )}
                </g>

                {/* Body */}
                {bodyType === 'wheelchair' ? (
                  <>
                    <rect x="28" y="60" width="44" height="35" rx="8" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />
                    <circle cx="35" cy="108" r="14" fill="none" stroke="#666" strokeWidth="2.5" />
                    <circle cx="65" cy="108" r="14" fill="none" stroke="#666" strokeWidth="2.5" />
                    <line x1="30" y1="95" x2="70" y2="95" stroke="#666" strokeWidth="2" />
                    <rect x="25" y="88" width="50" height="8" rx="3" fill="#888" />
                  </>
                ) : bodyType === 'sitting' ? (
                  <>
                    <rect x="32" y="55" width="36" height="30" rx="8" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />
                    <rect x="34" y="85" width="14" height="20" rx="5" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />
                    <rect x="52" y="85" width="14" height="20" rx="5" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />
                  </>
                ) : (
                  <>
                    <rect x="32" y="55" width="36" height="30" rx="8" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />
                    <rect x="34" y="85" width="12" height="28" rx="5" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />
                    <rect x="54" y="85" width="12" height="28" rx="5" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />
                    <ellipse cx="40" cy="115" rx="8" ry="4" fill="#555" />
                    <ellipse cx="60" cy="115" rx="8" ry="4" fill="#555" />
                  </>
                )}

                {/* Arms */}
                <rect x="18" y="58" width="12" height="24" rx="6" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />
                <rect x="70" y="58" width="12" height="24" rx="6" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />

                {/* Head */}
                <circle cx="50" cy="35" r="20" fill={isVitiligo ? 'url(#vitiligoPattern)' : skinTone} />

                {/* Bald sparkle effect */}
                {hairStyle === 'bald' && (
                  <>
                    <motion.circle cx="42" cy="20" r="1.5" fill="#FFD166"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="58" cy="18" r="1" fill="#FFD166"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.3, 0.5] }}
                      transition={{ duration: 2.3, repeat: Infinity, delay: 0.5 }} />
                    <motion.circle cx="50" cy="16" r="1.2" fill="#FF8C42"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.1, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: 1 }} />
                  </>
                )}

                {/* Hair */}
                {hairStyle !== 'bald' && (
                  <>
                    <path d={getHairPath()} fill={hairColorFill} stroke="none" />
                    {/* Braids extension */}
                    {hairStyle === 'braids' && (
                      <>
                        <line x1="32" y1="26" x2="28" y2="48" stroke={hairColorFill === 'url(#rainbowGrad)' ? '#9B72CF' : hairColor} strokeWidth="3" strokeLinecap="round" />
                        <line x1="68" y1="26" x2="72" y2="48" stroke={hairColorFill === 'url(#rainbowGrad)' ? '#5DADE2' : hairColor} strokeWidth="3" strokeLinecap="round" />
                      </>
                    )}
                    {/* Ponytail extension */}
                    {hairStyle === 'ponytail' && (
                      <path d="M70,26 Q78,30 76,46 Q74,52 70,50" fill={hairColorFill} stroke="none" />
                    )}
                  </>
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

                {/* Power tools */}
                {powerTool === 'inhaler' && <rect x="74" y="65" width="8" height="14" rx="2" fill="#5DADE2" />}
                {powerTool === 'insulin-pump' && (
                  <><circle cx="68" cy="68" r="4" fill="#14B8A6" /><line x1="68" y1="64" x2="68" y2="60" stroke="#14B8A6" strokeWidth="1" /></>
                )}
                {powerTool === 'hearing-aids' && (
                  <><circle cx="30" cy="35" r="3" fill="#FFD166" /><circle cx="70" cy="35" r="3" fill="#FFD166" /></>
                )}
                {powerTool === 'prosthetic' && <rect x="70" y="58" width="12" height="24" rx="6" fill="#C0C0C0" />}
                {powerTool === 'leg-braces' && (
                  <><rect x="33" y="90" width="3" height="22" rx="1" fill="#C0C0C0" /><rect x="64" y="90" width="3" height="22" rx="1" fill="#C0C0C0" /></>
                )}
                {powerTool === 'communication-device' && <rect x="74" y="60" width="10" height="8" rx="2" fill="#9B72CF" />}
                {powerTool === 'epipen' && <rect x="76" y="64" width="4" height="16" rx="2" fill="#FFD166" />}
                {powerTool === 'heart-monitor' && (
                  <><circle cx="50" cy="62" r="4" fill="none" stroke="#DC2626" strokeWidth="1.5" />
                    <path d="M46,62 L48,60 L50,64 L52,60 L54,62" fill="none" stroke="#DC2626" strokeWidth="1" /></>
                )}
                {powerTool === 'invisible' && (
                  <text x="78" y="56" fontSize="10">✨</text>
                )}

                {/* Companion */}
                <text x="12" y="100" fontSize="14">{companion}</text>
              </svg>
            </motion.div>
          </div>

          {/* Save message */}
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Ember message="NOW that's a hero!" expression="celebrating" />
            </motion.div>
          )}

          {/* Options */}
          <div className="space-y-5">
            {/* Body type */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Body Type</label>
              <div className="flex gap-2">
                {BODY_TYPES.map(b => (
                  <button key={b.value} onClick={() => setBodyType(b.value)}
                    className={`flex-1 p-3 rounded-xl text-center transition-all min-h-[64px] ${bodyType === b.value ? 'bg-gradient-to-br from-ember/20 to-heart/20 border-2 border-ember' : 'bg-white border-2 border-spark/20'}`}>
                    <span className="text-xl block">{b.emoji}</span>
                    <span className="font-display text-xs">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin tone */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Skin Tone</label>
              <div className="flex gap-2 flex-wrap">
                {SKIN_TONES.map(tone => (
                  <button key={tone} onClick={() => { setSkinTone(tone); setIsVitiligo(false); }}
                    className={`w-10 h-10 rounded-full transition-all min-h-[40px] ${skinTone === tone && !isVitiligo ? 'ring-3 ring-ember ring-offset-2 scale-110' : ''}`}
                    style={{ background: tone }} />
                ))}
                {/* Vitiligo option */}
                <button
                  onClick={() => setIsVitiligo(!isVitiligo)}
                  className={`w-10 h-10 rounded-full transition-all min-h-[40px] overflow-hidden ${isVitiligo ? 'ring-3 ring-ember ring-offset-2 scale-110' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${skinTone} 40%, #FDDCB5 40%, #FDDCB5 60%, ${skinTone} 60%)` }}
                  title="Vitiligo"
                />
              </div>
              {isVitiligo && (
                <p className="font-body text-xs text-text-muted mt-2">Vitiligo pattern selected</p>
              )}
            </div>

            {/* Hair style */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Hair Style</label>
              <div className="flex gap-2 flex-wrap">
                {HAIR_STYLES.map(h => (
                  <button key={h.value} onClick={() => setHairStyle(h.value)}
                    className={`px-3 py-2 rounded-xl text-center font-display text-sm transition-all min-h-[44px] ${hairStyle === h.value ? 'bg-ember text-white' : 'bg-white border-2 border-spark/20'}`}>
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair color */}
            {hairStyle !== 'bald' && (
              <div className="spark-card p-4">
                <label className="block font-display font-semibold text-text mb-2">Hair Color</label>
                <div className="flex gap-2 flex-wrap">
                  {HAIR_COLORS.map(c => (
                    <button key={c.value} onClick={() => setHairColor(c.value)}
                      className={`w-10 h-10 rounded-full transition-all min-h-[40px] ${hairColor === c.value ? 'ring-3 ring-ember ring-offset-2 scale-110' : ''}`}
                      style={{
                        background: c.value === 'rainbow'
                          ? 'conic-gradient(#FF6B8A, #FFD166, #7FB069, #5DADE2, #9B72CF, #FF6B8A)'
                          : c.value,
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Glasses */}
            <div className="spark-card p-4">
              <label className="flex items-center justify-between cursor-pointer min-h-[48px]">
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
              <div className="grid grid-cols-2 gap-2">
                {POWER_TOOLS.map(t => (
                  <button key={t.value} onClick={() => setPowerTool(t.value)}
                    className={`p-3 rounded-xl text-center transition-all min-h-[64px] ${powerTool === t.value ? 'bg-gradient-to-br from-brave/20 to-dream/20 border-2 border-brave' : 'bg-white border-2 border-spark/20'}`}>
                    <span className="text-xl block">{t.emoji}</span>
                    <span className="font-display text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cape color */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">
                Cape Color {capeInitial && <span className="text-text-muted text-sm">(shows your initial: {capeInitial})</span>}
              </label>
              <div className="flex gap-2">
                {CAPE_COLORS.map(color => (
                  <button key={color} onClick={() => setCapeColor(color)}
                    className={`w-10 h-10 rounded-full transition-all min-h-[40px] ${capeColor === color ? 'ring-3 ring-ember ring-offset-2 scale-110' : ''}`}
                    style={{ background: color }} />
                ))}
              </div>
            </div>

            {/* Companion selector */}
            <div className="spark-card p-4">
              <label className="block font-display font-semibold text-text mb-2">Companion Animal</label>
              <div className="flex gap-2 flex-wrap">
                {COMPANION_ANIMALS.map(animal => (
                  <button key={animal} onClick={() => setCompanion(animal)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all min-h-[48px] ${companion === animal ? 'bg-gradient-to-br from-spark/30 to-ember/30 border-2 border-ember scale-110' : 'bg-white border-2 border-spark/20'}`}>
                    {animal}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="btn-spark btn-primary w-full text-lg min-h-[56px]">
              {saved ? 'Saved! ✨' : 'Save My Avatar'}
            </button>

            {/* ---- SPARK SHOP ---- */}
            <SparkShop />
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}

/* ---- Spark Shop Component ---- */
function SparkShop() {
  const [profile, setProfile] = useState(getProfile());
  const [purchased, setPurchased] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState<'cape' | 'companion' | 'decoration' | 'tool'>('cape');

  if (!profile) return null;

  const coins = profile.sparkCoins || 0;
  const owned = profile.unlockedCosmetics || [];

  const handleBuy = (itemId: string, cost: number) => {
    if (coins < cost || owned.includes(itemId)) return;
    const p = getProfile();
    if (!p) return;
    p.sparkCoins -= cost;
    if (!p.unlockedCosmetics) p.unlockedCosmetics = [];
    p.unlockedCosmetics.push(itemId);
    saveProfile(p);
    setProfile({ ...p });
    setPurchased(itemId);
    setTimeout(() => setPurchased(null), 2000);
  };

  const categories = [
    { id: 'cape' as const, label: 'Capes', emoji: '🧥' },
    { id: 'companion' as const, label: 'Companion', emoji: '🐾' },
    { id: 'decoration' as const, label: 'Home', emoji: '🏡' },
    { id: 'tool' as const, label: 'Tools', emoji: '⚔️' },
  ];

  const filteredItems = SHOP_ITEMS.filter(i => i.category === shopCategory);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-display font-bold text-center mb-1 bg-gradient-to-r from-spark to-ember bg-clip-text text-transparent">
        Spark Shop
      </h2>
      <p className="text-center font-body text-text-muted mb-1 text-sm">Spend your earned coins on cool stuff!</p>
      <p className="text-center font-display font-bold text-lg mb-4" style={{ color: '#FFD700' }}>
        🪙 {coins} Spark Coins
      </p>
      <p className="text-center font-body text-[10px] text-text-muted mb-4 italic">
        Coins are earned through playing — never purchased. SPARK is free forever.
      </p>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setShopCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-display font-medium transition-all ${
              shopCategory === cat.id ? 'bg-ember text-white' : 'bg-spark/20 text-text'
            }`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map(item => {
          const isOwned = owned.includes(item.id);
          const canAfford = coins >= item.cost;
          const justBought = purchased === item.id;

          return (
            <div key={item.id}
              className={`spark-card p-4 text-center transition-all ${isOwned ? 'opacity-60' : ''}`}
              style={isOwned ? { borderColor: '#7FB069' } : {}}>
              <span className="text-3xl block mb-2">{item.emoji}</span>
              <p className="font-display font-bold text-sm text-text">{item.name}</p>
              <p className="font-body text-[10px] text-text-muted mb-2">{item.description}</p>
              {isOwned ? (
                <span className="font-display text-xs text-forest font-bold">✅ Owned</span>
              ) : justBought ? (
                <span className="font-display text-xs text-spark font-bold">✨ Purchased!</span>
              ) : (
                <button
                  onClick={() => handleBuy(item.id, item.cost)}
                  disabled={!canAfford}
                  className={`px-3 py-1 rounded-full text-xs font-display font-bold transition-all ${
                    canAfford
                      ? 'bg-spark text-night hover:bg-ember hover:text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}>
                  🪙 {item.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
