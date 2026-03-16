/* Virtual joystick + keyboard controls for the PixiJS game */

export interface InputState {
  dx: number; // -1 to 1
  dy: number; // -1 to 1
  interact: boolean;
  magnitude: number; // 0 to 1
}

export class GameControls {
  private keys: Set<string> = new Set();
  private joystickActive = false;
  private joystickOrigin = { x: 0, y: 0 };
  private joystickPos = { x: 0, y: 0 };
  private interactPressed = false;
  private canvas: HTMLCanvasElement | null = null;
  private touchId: number | null = null;

  // Public for rendering the joystick overlay
  public joystickVisible = false;
  public joystickX = 0;
  public joystickY = 0;
  public joystickDX = 0;
  public joystickDY = 0;
  public interactGlow = false;

  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
    canvas.addEventListener('touchend', this.onTouchEnd);
    canvas.addEventListener('touchcancel', this.onTouchEnd);
  }

  detach() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this.onTouchStart);
      this.canvas.removeEventListener('touchmove', this.onTouchMove);
      this.canvas.removeEventListener('touchend', this.onTouchEnd);
      this.canvas.removeEventListener('touchcancel', this.onTouchEnd);
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    this.keys.add(e.key.toLowerCase());
    if (e.key === ' ' || e.key === 'Enter') {
      this.interactPressed = true;
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      // handled externally
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    this.keys.delete(e.key.toLowerCase());
    if (e.key === ' ' || e.key === 'Enter') {
      this.interactPressed = false;
    }
  }

  private onTouchStart(e: TouchEvent) {
    e.preventDefault();
    const rect = this.canvas!.getBoundingClientRect();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;

      // Left 40% of screen = joystick
      if (x < rect.width * 0.4 && this.touchId === null) {
        this.touchId = t.identifier;
        this.joystickActive = true;
        this.joystickVisible = true;
        this.joystickOrigin = { x, y };
        this.joystickPos = { x, y };
        this.joystickX = x;
        this.joystickY = y;
      }
      // Right 40% = interact
      if (x > rect.width * 0.6) {
        this.interactPressed = true;
        setTimeout(() => { this.interactPressed = false; }, 100);
      }
    }
  }

  private onTouchMove(e: TouchEvent) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === this.touchId) {
        const rect = this.canvas!.getBoundingClientRect();
        this.joystickPos = {
          x: t.clientX - rect.left,
          y: t.clientY - rect.top,
        };
      }
    }
  }

  private onTouchEnd(e: TouchEvent) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === this.touchId) {
        this.touchId = null;
        this.joystickActive = false;
        this.joystickVisible = false;
        this.joystickDX = 0;
        this.joystickDY = 0;
      }
    }
  }

  getInput(): InputState {
    let dx = 0;
    let dy = 0;
    let interact = this.interactPressed;
    let magnitude = 0;

    // Keyboard
    if (this.keys.has('arrowleft') || this.keys.has('a')) dx -= 1;
    if (this.keys.has('arrowright') || this.keys.has('d')) dx += 1;
    if (this.keys.has('arrowup') || this.keys.has('w')) dy -= 1;
    if (this.keys.has('arrowdown') || this.keys.has('s')) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
      magnitude = 1;
    }

    // Joystick overrides if active
    if (this.joystickActive) {
      const jdx = this.joystickPos.x - this.joystickOrigin.x;
      const jdy = this.joystickPos.y - this.joystickOrigin.y;
      const maxDist = 50;
      const dist = Math.sqrt(jdx * jdx + jdy * jdy);
      if (dist > 5) { // dead zone
        const clamped = Math.min(dist, maxDist);
        dx = (jdx / dist) * (clamped / maxDist);
        dy = (jdy / dist) * (clamped / maxDist);
        magnitude = clamped / maxDist;
        this.joystickDX = dx;
        this.joystickDY = dy;
      } else {
        this.joystickDX = 0;
        this.joystickDY = 0;
      }
    }

    // Reset single-press interact
    if (interact) {
      this.interactPressed = false;
    }

    return { dx, dy, interact, magnitude };
  }

  isEscapePressed(): boolean {
    if (this.keys.has('escape')) {
      this.keys.delete('escape');
      return true;
    }
    return false;
  }
}
