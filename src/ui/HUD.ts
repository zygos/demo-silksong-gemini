import { ScreenElement, vec } from 'excalibur';
import { Player } from '../actors/Player';
import { Config } from '../config';

export class HUD extends ScreenElement {
  private player: Player;

  constructor(player: Player) {
    super({
      pos: vec(0, 0),
      width: 0, // Not used for drawing directly
      height: 0
    });
    this.player = player;
  }

  onPostDraw(ctx: CanvasRenderingContext2D) {
    // Draw Health
    const heartSize = 20;
    const spacing = 5;
    const startX = 20;
    const startY = 20;

    for (let i = 0; i < this.player.maxHp; i++) {
      if (i < this.player.hp) {
        ctx.fillStyle = 'white'; // Full heart
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Empty heart
      }
      ctx.fillRect(startX + (heartSize + spacing) * i, startY, heartSize, heartSize);
    }

    // Draw Currency
    ctx.fillStyle = 'gold';
    ctx.font = '20px Arial';
    ctx.fillText(`Geo: ${this.player.currency}`, 20, 60);

    // Draw Dash Cooldown
    const dashX = 20;
    const dashY = 70;
    const dashWidth = 100;
    const dashHeight = 10;
    
    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(dashX, dashY, dashWidth, dashHeight);

    // Foreground
    if (this.player.dashReady) {
        ctx.fillStyle = 'cyan';
        ctx.fillRect(dashX, dashY, dashWidth, dashHeight);
    } else {
        const progress = 1 - (this.player.dashCooldownRemaining / Config.Player.DashCooldown);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.fillRect(dashX, dashY, dashWidth * progress, dashHeight);
    }
  }
}
