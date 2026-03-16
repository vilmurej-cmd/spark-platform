/* Camera system — smooth follow with parallax support */

export class GameCamera {
  public x = 0;
  public y = 0;
  private screenWidth: number;
  private screenHeight: number;
  private worldWidth: number;
  private worldHeight: number;
  private lerp = 0.1;

  constructor(screenWidth: number, screenHeight: number, worldWidth: number, worldHeight: number) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  update(targetX: number, targetY: number) {
    // Center camera on target
    const desiredX = targetX - this.screenWidth / 2;
    const desiredY = targetY - this.screenHeight / 2;

    // Smooth follow
    this.x += (desiredX - this.x) * this.lerp;
    this.y += (desiredY - this.y) * this.lerp;

    // Clamp to world bounds
    this.x = Math.max(0, Math.min(this.worldWidth - this.screenWidth, this.x));
    this.y = Math.max(0, Math.min(this.worldHeight - this.screenHeight, this.y));
  }

  resize(screenWidth: number, screenHeight: number) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }

  getParallaxOffset(depth: number): number {
    // depth: 0 = fixed background, 1 = foreground (moves with camera)
    return -this.x * depth;
  }

  getScreenX(worldX: number): number {
    return worldX - this.x;
  }

  getScreenY(worldY: number): number {
    return worldY - this.y;
  }
}
