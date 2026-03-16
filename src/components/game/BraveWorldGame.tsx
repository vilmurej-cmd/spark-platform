'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Application, Graphics, Text, TextStyle, Container } from 'pixi.js';
import { GameCamera } from './utils/camera';
import { GameControls } from './utils/controls';
import { distance, clamp, lerp } from './utils/physics';
import { getLandConfig, type LandConfig, type Hotspot, type NPC } from './lands/LandConfig';
import {
  getProfile, saveProfile, collectSparkle, getSparklesForLand, awardXP,
  XP_AWARDS, type AvatarConfig, BRAVE_LANDS,
} from '@/lib/spark-data';

interface BraveWorldGameProps {
  landId: string;
  onBack: () => void;
  onOpenHotspot: (type: string, landId: string) => void;
}

// Check WebGL support
function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl') || c.getContext('webgl2'));
  } catch { return false; }
}

export default function BraveWorldGame({ landId, onBack, onOpenHotspot }: BraveWorldGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const controlsRef = useRef<GameControls | null>(null);
  const [canRender, setCanRender] = useState(true);
  const [interactLabel, setInteractLabel] = useState<string | null>(null);
  const [npcMessage, setNpcMessage] = useState<{ name: string; message: string; emoji: string } | null>(null);
  const [sparkleCollected, setSparkleCollected] = useState(false);
  const [collectibleCount, setCollectibleCount] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!hasWebGL()) {
      setCanRender(false);
      return;
    }

    const config = getLandConfig(landId);
    if (!config || !containerRef.current) return;

    const profile = getProfile();
    const avatarConfig = profile?.avatarConfig;
    const collectedSparkles = profile?.collectedSparkles || [];
    const landCollectibles = profile?.landCollectibles?.[landId] || [];

    let destroyed = false;
    let app: Application;

    const init = async () => {
      const container = containerRef.current!;
      const width = container.clientWidth;
      const height = container.clientHeight;

      app = new Application();
      await app.init({
        width,
        height,
        backgroundColor: 0x1a1428,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
      });

      if (destroyed) { app.destroy(); return; }

      container.appendChild(app.canvas as HTMLCanvasElement);
      appRef.current = app;

      const controls = new GameControls();
      controls.attach(app.canvas as HTMLCanvasElement);
      controlsRef.current = controls;

      const camera = new GameCamera(width, height, config.worldWidth, config.worldHeight);

      // ---- Create game world ----
      const worldContainer = new Container();
      const bgContainer = new Container(); // parallax bg
      const midContainer = new Container(); // mid parallax
      const fgContainer = new Container(); // foreground (1:1)
      const uiContainer = new Container(); // HUD

      app.stage.addChild(worldContainer);
      worldContainer.addChild(bgContainer, midContainer, fgContainer);
      app.stage.addChild(uiContainer);

      // Sky
      const sky = new Graphics();
      drawSky(sky, config, width, height);
      bgContainer.addChild(sky);

      // Mountains (parallax 0.3)
      for (const m of config.mountains) {
        const mountain = new Graphics();
        mountain.fill({ color: m.color.replace('#', '0x').slice(0, 8) });
        mountain.moveTo(m.x, config.groundY);
        mountain.lineTo(m.x + m.width / 2, config.groundY - m.height);
        mountain.lineTo(m.x + m.width, config.groundY);
        mountain.closePath();
        mountain.fill();
        midContainer.addChild(mountain);
      }

      // Ground
      const ground = new Graphics();
      ground.fill({ color: config.groundColor[0] });
      ground.rect(0, config.groundY, config.worldWidth, config.worldHeight - config.groundY);
      ground.fill();
      fgContainer.addChild(ground);

      // Ground detail line
      const groundLine = new Graphics();
      groundLine.fill({ color: config.groundColor[1] });
      groundLine.rect(0, config.groundY, config.worldWidth, 4);
      groundLine.fill();
      fgContainer.addChild(groundLine);

      // Particles
      const particles: { g: Graphics; vx: number; vy: number; life: number; maxLife: number }[] = [];
      for (let i = 0; i < config.particleCount; i++) {
        const p = new Graphics();
        const size = 2 + Math.random() * 4;
        p.fill({ color: config.particleColor });
        p.circle(0, 0, size);
        p.fill();
        p.x = Math.random() * config.worldWidth;
        p.y = config.groundY - Math.random() * (config.groundY - 50);
        p.alpha = 0.3 + Math.random() * 0.4;
        fgContainer.addChild(p);
        const maxLife = 120 + Math.random() * 180;
        particles.push({
          g: p,
          vx: (Math.random() - 0.5) * 0.5,
          vy: config.particleDirection === 'up' ? -(0.3 + Math.random() * 0.8) : config.particleDirection === 'down' ? (0.3 + Math.random() * 0.5) : (Math.random() - 0.5) * 0.3,
          life: Math.random() * maxLife,
          maxLife,
        });
      }

      // Hotspot visuals
      const hotspotGraphics: { g: Container; hotspot: Hotspot }[] = [];
      for (const h of config.hotspots) {
        const hContainer = new Container();
        // Glow circle
        const glow = new Graphics();
        glow.fill({ color: 0xffd166, alpha: 0.15 });
        glow.circle(0, 0, 40);
        glow.fill();
        hContainer.addChild(glow);
        // Label
        const label = new Text({
          text: `${h.emoji} ${h.label}`,
          style: new TextStyle({
            fontFamily: 'Fredoka, Nunito, sans-serif',
            fontSize: 14,
            fill: 0xffffff,
            align: 'center',
            dropShadow: { color: 0x000000, blur: 4, distance: 1, alpha: 0.5 },
          }),
        });
        label.anchor.set(0.5);
        label.y = -50;
        label.alpha = 0;
        hContainer.addChild(label);
        hContainer.x = h.x;
        hContainer.y = config.groundY - 30;
        fgContainer.addChild(hContainer);
        hotspotGraphics.push({ g: hContainer, hotspot: h });
      }

      // NPC visuals
      const npcGraphics: { g: Container; npc: NPC; frame: number }[] = [];
      for (const n of config.npcs) {
        const nc = new Container();
        const npcText = new Text({
          text: n.emoji,
          style: new TextStyle({ fontSize: 36 }),
        });
        npcText.anchor.set(0.5);
        nc.addChild(npcText);
        nc.x = n.x;
        nc.y = n.y;
        fgContainer.addChild(nc);
        npcGraphics.push({ g: nc, npc: n, frame: 0 });
      }

      // Sparkles
      const sparkleLocations = getSparklesForLand(landId);
      const sparkleGraphics: { g: Graphics; id: string; collected: boolean }[] = [];
      for (const s of sparkleLocations) {
        if (collectedSparkles.includes(s.id)) continue;
        // Check if requires action
        if (s.requiresAction) {
          // Simple check: skip sparkles that require actions for now
          // In future, check profile for completed actions
        }
        const sg = new Graphics();
        sg.fill({ color: 0xffd166 });
        sg.circle(0, 0, 6);
        sg.fill();
        sg.fill({ color: 0xffffff, alpha: 0.6 });
        sg.circle(0, 0, 3);
        sg.fill();
        sg.x = s.x;
        sg.y = Math.min(s.y, config.groundY - 20);
        fgContainer.addChild(sg);
        sparkleGraphics.push({ g: sg, id: s.id, collected: false });
      }

      // Collectibles
      let collectedThisSession = 0;
      const collectibleGraphics: { g: Graphics; id: string; collected: boolean }[] = [];
      for (const c of config.collectibles) {
        if (landCollectibles.includes(c.id)) {
          collectedThisSession++;
          continue;
        }
        const cg = new Graphics();
        // Diamond shape
        cg.fill({ color: 0xffd166 });
        cg.moveTo(0, -8);
        cg.lineTo(6, 0);
        cg.lineTo(0, 8);
        cg.lineTo(-6, 0);
        cg.closePath();
        cg.fill();
        cg.x = c.x;
        cg.y = c.y;
        fgContainer.addChild(cg);
        collectibleGraphics.push({ g: cg, id: c.id, collected: false });
      }
      setCollectibleCount(collectedThisSession);

      // Player avatar
      const player = new Container();
      const playerBody = new Graphics();
      drawAvatar(playerBody, avatarConfig);
      player.addChild(playerBody);
      player.x = 100;
      player.y = config.groundY - 24;
      fgContainer.addChild(player);

      // Ember companion
      const ember = new Container();
      const emberBody = new Graphics();
      drawEmberFox(emberBody);
      ember.addChild(emberBody);
      ember.x = 50;
      ember.y = config.groundY - 16;
      fgContainer.addChild(ember);

      let playerFacing = 1; // 1 = right, -1 = left
      let walkFrame = 0;
      let idleTimer = 0;
      let emberSitting = false;
      let frame = 0;

      // Portal zone at far right
      const portalZone = config.worldWidth - 100;

      // Mark land as explored
      if (profile && !profile.exploredLands.includes(landId)) {
        profile.exploredLands.push(landId);
        awardXP(profile, XP_AWARDS.EXPLORE_LAND);
        saveProfile(profile);
      }

      // Virtual joystick + interact button (drawn as UI overlay)
      const joystickBg = new Graphics();
      joystickBg.alpha = 0;
      uiContainer.addChild(joystickBg);

      const joystickKnob = new Graphics();
      joystickKnob.fill({ color: 0xffffff, alpha: 0.5 });
      joystickKnob.circle(0, 0, 20);
      joystickKnob.fill();
      joystickKnob.alpha = 0;
      uiContainer.addChild(joystickKnob);

      const interactBtn = new Graphics();
      interactBtn.fill({ color: 0xffd166, alpha: 0.3 });
      interactBtn.circle(0, 0, 30);
      interactBtn.fill();
      const interactText = new Text({
        text: 'A',
        style: new TextStyle({
          fontFamily: 'Fredoka, sans-serif', fontSize: 20, fill: 0xffffff, fontWeight: 'bold',
        }),
      });
      interactText.anchor.set(0.5);
      interactBtn.addChild(interactText);
      interactBtn.x = width - 60;
      interactBtn.y = height - 80;
      interactBtn.alpha = 0.3;
      uiContainer.addChild(interactBtn);

      // ---- GAME LOOP ----
      app.ticker.add(() => {
        if (pausedRef.current || destroyed) return;
        frame++;

        const input = controls.getInput();
        const speed = 3;

        // Player movement
        if (input.magnitude > 0.1) {
          player.x += input.dx * speed * input.magnitude;
          player.y = config.groundY - 24; // stay on ground
          player.x = clamp(player.x, 24, config.worldWidth - 24);

          if (input.dx > 0.1) playerFacing = 1;
          else if (input.dx < -0.1) playerFacing = -1;
          player.scale.x = playerFacing;

          walkFrame++;
          idleTimer = 0;
          if (emberSitting) emberSitting = false;
        } else {
          idleTimer++;
          // Idle bob
          player.y = config.groundY - 24 + Math.sin(frame * 0.03) * 2;
          // Blink every 5s
          if (frame % 300 < 6) {
            player.scale.y = 0.95;
          } else {
            player.scale.y = 1;
          }
        }

        // Ember follow
        const targetEmberX = player.x - playerFacing * 50;
        const targetEmberY = config.groundY - 16;
        ember.x = lerp(ember.x, targetEmberX, 0.05);
        ember.y = lerp(ember.y, targetEmberY, 0.05);
        if (idleTimer > 300 && !emberSitting) {
          emberSitting = true;
        }
        // Ember tail wag
        if (ember.children[0]) {
          (ember.children[0] as Graphics).rotation = Math.sin(frame * 0.1) * 0.1;
        }
        ember.scale.x = player.x > ember.x ? 1 : -1;

        // Camera follow
        camera.update(player.x, player.y);

        // Apply camera to containers
        fgContainer.x = -camera.x;
        fgContainer.y = -camera.y;
        midContainer.x = camera.getParallaxOffset(0.3);
        midContainer.y = -camera.y * 0.3;

        // Particles
        for (const p of particles) {
          p.life++;
          p.g.x += p.vx;
          p.g.y += p.vy;
          const lifeRatio = p.life / p.maxLife;
          p.g.alpha = lifeRatio < 0.2 ? lifeRatio * 5 * 0.6 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 * 0.6 : 0.6;
          if (p.life >= p.maxLife) {
            p.life = 0;
            p.g.x = Math.random() * config.worldWidth;
            p.g.y = config.groundY - Math.random() * (config.groundY - 50);
          }
        }

        // NPC animations
        for (const n of npcGraphics) {
          n.frame++;
          if (n.npc.idleAnim === 'bounce') {
            n.g.y = n.npc.y + Math.sin(n.frame * 0.04) * 4;
          } else if (n.npc.idleAnim === 'wave') {
            n.g.rotation = Math.sin(n.frame * 0.06) * 0.1;
          } else if (n.npc.idleAnim === 'breathe') {
            n.g.scale.set(1 + Math.sin(n.frame * 0.03) * 0.05);
          } else if (n.npc.idleAnim === 'spin') {
            n.g.rotation = Math.sin(n.frame * 0.02) * 0.2;
          }
        }

        // Hotspot proximity detection
        let nearestHotspot: Hotspot | null = null;
        let nearestDist = Infinity;
        for (const hg of hotspotGraphics) {
          const d = Math.abs(player.x - hg.hotspot.x);
          // Show label when close
          const label = hg.g.children[1] as Text;
          if (d < 80) {
            label.alpha = lerp(label.alpha, 1, 0.1);
            // Glow pulse
            const glow = hg.g.children[0] as Graphics;
            glow.alpha = 0.15 + Math.sin(frame * 0.05) * 0.1;
            if (d < nearestDist) {
              nearestDist = d;
              nearestHotspot = hg.hotspot;
            }
          } else {
            label.alpha = lerp(label.alpha, 0, 0.1);
          }
        }

        // NPC proximity
        let nearestNPC: NPC | null = null;
        for (const ng of npcGraphics) {
          const d = distance(player.x, player.y, ng.npc.x, ng.npc.y);
          if (d < 60 && (!nearestHotspot || d < nearestDist)) {
            nearestNPC = ng.npc;
          }
        }

        // Update interact button glow
        if (nearestHotspot || nearestNPC) {
          interactBtn.alpha = lerp(interactBtn.alpha, 0.8, 0.1);
          setInteractLabel(nearestHotspot?.name || nearestNPC?.name || null);
        } else {
          interactBtn.alpha = lerp(interactBtn.alpha, 0.3, 0.1);
          setInteractLabel(null);
        }

        // Handle interact
        if (input.interact) {
          if (nearestHotspot) {
            onOpenHotspot(nearestHotspot.type, landId);
          } else if (nearestNPC) {
            setNpcMessage({ name: nearestNPC.name, message: nearestNPC.message, emoji: nearestNPC.emoji });
            setTimeout(() => setNpcMessage(null), 4000);
          }
        }

        // Sparkle collection
        for (const sg of sparkleGraphics) {
          if (sg.collected) continue;
          // Pulse animation
          sg.g.alpha = 0.5 + Math.sin(frame * 0.08 + sg.g.x) * 0.3;
          sg.g.scale.set(1 + Math.sin(frame * 0.06 + sg.g.y) * 0.2);

          if (distance(player.x, player.y, sg.g.x, sg.g.y) < 30) {
            sg.collected = true;
            sg.g.alpha = 0;
            collectSparkle(sg.id);
            setSparkleCollected(true);
            setTimeout(() => setSparkleCollected(false), 1500);
          }
        }

        // Collectible collection
        for (const cg of collectibleGraphics) {
          if (cg.collected) continue;
          // Rotate
          cg.g.rotation += 0.02;
          cg.g.alpha = 0.7 + Math.sin(frame * 0.05) * 0.3;

          if (distance(player.x, player.y, cg.g.x, cg.g.y) < 30) {
            cg.collected = true;
            cg.g.alpha = 0;
            collectedThisSession++;
            setCollectibleCount(collectedThisSession);
            // Save to profile
            const p = getProfile();
            if (p) {
              if (!p.landCollectibles[landId]) p.landCollectibles[landId] = [];
              if (!p.landCollectibles[landId].includes(cg.id)) {
                p.landCollectibles[landId].push(cg.id);
                awardXP(p, XP_AWARDS.COLLECT_SPARKLE);
                saveProfile(p);
              }
            }
          }
        }

        // Portal check
        if (player.x >= portalZone) {
          onBack();
        }

        // Joystick visual
        if (controls.joystickVisible) {
          joystickBg.clear();
          joystickBg.fill({ color: 0xffffff, alpha: 0.15 });
          joystickBg.circle(controls.joystickX, controls.joystickY, 50);
          joystickBg.fill();
          joystickBg.alpha = 1;
          joystickKnob.x = controls.joystickX + controls.joystickDX * 50;
          joystickKnob.y = controls.joystickY + controls.joystickDY * 50;
          joystickKnob.alpha = 0.6;
        } else {
          joystickBg.alpha = 0;
          joystickKnob.alpha = 0;
        }

        // Escape to go back
        if (controls.isEscapePressed()) {
          onBack();
        }
      });
    };

    init();

    return () => {
      destroyed = true;
      if (controlsRef.current) controlsRef.current.detach();
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [landId, onBack, onOpenHotspot]);

  // Pause/resume when hotspot modal opens
  const pause = useCallback(() => { pausedRef.current = true; }, []);
  const resume = useCallback(() => { pausedRef.current = false; }, []);

  const land = BRAVE_LANDS.find(l => l.id === landId);

  if (!canRender) {
    // Fallback — user will see the CSS land page
    return null;
  }

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 56px)' }}>
      {/* PixiJS canvas container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Back button overlay */}
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-20 font-display text-sm font-bold text-white/90 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full min-h-[44px] flex items-center hover:bg-black/50 transition-colors"
      >
        ← Map
      </button>

      {/* Land name */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 text-center">
        <span className="font-display text-sm font-bold text-white/80 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
          {land?.emoji} {land?.name}
        </span>
      </div>

      {/* Collectible count */}
      <div className="absolute top-3 right-3 z-20">
        <span className="font-display text-sm font-bold text-spark bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
          💎 {collectibleCount}/3
        </span>
      </div>

      {/* Interact label */}
      <AnimatePresence>
        {interactLabel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <p className="font-display text-sm text-white font-bold">{interactLabel}</p>
            <p className="font-body text-[10px] text-white/60 text-center">Tap A or press Space</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NPC speech bubble */}
      <AnimatePresence>
        {npcMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-lg max-w-xs"
          >
            <p className="text-2xl text-center mb-1">{npcMessage.emoji}</p>
            <p className="font-display text-sm font-bold text-text mb-1">{npcMessage.name}</p>
            <p className="font-body text-xs text-text-light">{npcMessage.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle collected toast */}
      <AnimatePresence>
        {sparkleCollected && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-spark/90 text-night px-4 py-2 rounded-full shadow-lg"
          >
            <p className="font-display text-sm font-bold">✨ Sparkle found! +5 XP</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile control hint */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <p className="font-body text-[10px] text-white/30">Drag left side to move</p>
      </div>
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <p className="font-body text-[10px] text-white/30">Tap to interact</p>
      </div>
    </div>
  );
}

/* ---- Drawing helpers ---- */

function drawSky(g: Graphics, config: LandConfig, width: number, height: number) {
  // Simple gradient approximation with rectangles
  const steps = 10;
  const colors = config.skyGradient;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const colorIdx = t < 0.5 ? 0 : 1;
    const color = colors[colorIdx];
    g.fill({ color, alpha: 0.8 });
    g.rect(0, (height / steps) * i, config.worldWidth, height / steps + 1);
    g.fill();
  }
}

function drawAvatar(g: Graphics, avatarConfig?: AvatarConfig) {
  const skinColor = avatarConfig?.skinTone || '#D4A574';
  const capeColor = avatarConfig?.capeColor || '#FF8C42';
  const isWheelchair = avatarConfig?.bodyType === 'wheelchair';

  // Cape (behind body)
  g.fill({ color: capeColor });
  g.moveTo(-4, -10);
  g.lineTo(8, -10);
  g.lineTo(12, 10);
  g.lineTo(-8, 10);
  g.closePath();
  g.fill();

  // Body
  g.fill({ color: capeColor });
  g.roundRect(-6, -8, 12, 16, 3);
  g.fill();

  // Head
  g.fill({ color: skinColor });
  g.circle(0, -16, 8);
  g.fill();

  // Eyes
  g.fill({ color: '#1A1428' });
  g.circle(-3, -17, 1.5);
  g.circle(3, -17, 1.5);
  g.fill();

  // Hair
  g.fill({ color: avatarConfig?.hairColor || '#3D2C1E' });
  g.arc(0, -18, 8, Math.PI, 0);
  g.fill();

  if (isWheelchair) {
    // Wheelchair
    g.fill({ color: '#666666' });
    g.rect(-8, 8, 16, 4);
    g.fill();
    g.fill({ color: '#888888' });
    g.circle(-6, 14, 5);
    g.circle(6, 14, 5);
    g.fill();
    g.fill({ color: '#AAAAAA' });
    g.circle(-6, 14, 3);
    g.circle(6, 14, 3);
    g.fill();
  } else {
    // Legs
    g.fill({ color: '#4A6FA5' });
    g.rect(-5, 8, 4, 8);
    g.rect(1, 8, 4, 8);
    g.fill();
  }

  // Smile
  g.stroke({ color: '#1A1428', width: 1 });
  g.arc(0, -14, 3, 0, Math.PI);
  g.stroke();
}

function drawEmberFox(g: Graphics) {
  // Body
  g.fill({ color: '#F59E0B' });
  g.ellipse(0, 0, 10, 7);
  g.fill();

  // Head
  g.fill({ color: '#FBBF24' });
  g.circle(-8, -4, 7);
  g.fill();

  // Ears
  g.fill({ color: '#F59E0B' });
  g.moveTo(-12, -10);
  g.lineTo(-10, -16);
  g.lineTo(-8, -10);
  g.closePath();
  g.fill();
  g.moveTo(-6, -10);
  g.lineTo(-4, -15);
  g.lineTo(-2, -10);
  g.closePath();
  g.fill();

  // Eyes
  g.fill({ color: '#1A1428' });
  g.circle(-10, -5, 1);
  g.circle(-6, -5, 1);
  g.fill();

  // White muzzle
  g.fill({ color: '#FFFFFF', alpha: 0.8 });
  g.ellipse(-8, -1, 4, 2);
  g.fill();

  // Tail
  g.fill({ color: '#FBBF24' });
  g.ellipse(12, -2, 8, 3);
  g.fill();
  g.fill({ color: '#FFFFFF', alpha: 0.8 });
  g.circle(16, -2, 2);
  g.fill();

  // Bandage on paw
  g.fill({ color: '#FFFFFF' });
  g.rect(-4, 6, 4, 1.5);
  g.fill();
}
