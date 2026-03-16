'use client';

import { useState, useEffect, useCallback } from 'react';
import SoundEngine from './SoundEngine';

/** React hook for the SPARK sound system */
export function useSparkSound() {
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    SoundEngine.loadState();
    setSoundOn(SoundEngine.isEnabled);
  }, []);

  const toggleSound = useCallback(async () => {
    const newState = await SoundEngine.toggle();
    setSoundOn(newState);
  }, []);

  return { soundOn, toggleSound };
}
