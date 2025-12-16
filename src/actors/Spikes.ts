import { Actor, Color, CollisionType, Vector } from 'excalibur';
import { Player } from './Player';

export class Spikes extends Actor {
  constructor(pos: Vector, width: number) {
    super({
      pos: pos,
      width: width,
      height: 20,
      color: Color.Gray,
      collisionType: CollisionType.Passive
    });
  }

  onPostCollision(evt: any) {
      if (evt.other instanceof Player) {
          evt.other.takeDamage(1, this.pos);
      }
  }
  
  onPostDraw(ctx: CanvasRenderingContext2D) {
      // Simple visual representation
      ctx.fillStyle = '#A9A9A9';
      const spikeWidth = 20;
      const numSpikes = this.width / spikeWidth;
      const startX = -this.width / 2;
      const startY = this.height / 2;
      
      for(let i=0; i<numSpikes; i++) {
          ctx.beginPath();
          ctx.moveTo(startX + i*spikeWidth, startY);
          ctx.lineTo(startX + i*spikeWidth + spikeWidth/2, startY - this.height);
          ctx.lineTo(startX + (i+1)*spikeWidth, startY);
          ctx.fill();
      }
  }
}
