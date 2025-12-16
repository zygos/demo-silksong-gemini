import { ScreenElement, vec } from 'excalibur';
import { Boss } from '../actors/Boss';

export class BossHealthBar extends ScreenElement {
  private boss: Boss;
  private maxHp = 20;
  private currentHp = 20;
  private barWidth = 400;
  private barHeight = 20;

  constructor(boss: Boss) {
    super({
      pos: vec(200, 50), // Top center-ish
      width: 400,
      height: 20
    });
    this.boss = boss;
  }

  onPreUpdate() {
      this.currentHp = this.boss.currentHp;
      this.maxHp = this.boss.maxHealth;
  }

  onPostDraw(ctx: CanvasRenderingContext2D) {
      // Background
      ctx.fillStyle = 'black';
      ctx.fillRect(this.pos.x, this.pos.y, this.barWidth, this.barHeight);

      // Foreground
      const width = (this.currentHp / this.maxHp) * this.barWidth;
      ctx.fillStyle = 'red';
      ctx.fillRect(this.pos.x, this.pos.y, width, this.barHeight);
      
      // Border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.pos.x, this.pos.y, this.barWidth, this.barHeight);
  }
}
