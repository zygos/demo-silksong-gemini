import { Actor, Color, CollisionType, Vector } from 'excalibur';
import { Player } from './Player';

export class OneWayPlatform extends Actor {
  constructor(pos: Vector, width: number) {
    super({
      pos: pos,
      width: width,
      height: 10,
      color: Color.fromHex('#7f8c8d'),
      collisionType: CollisionType.Passive // We handle collision manually
    });
  }

  onPreCollision(evt: any) {
      if (evt.other instanceof Player) {
          const player = evt.other;
          
          // Only collide if player is falling and above the platform
          // We add a small buffer to allow smooth walking
          if (player.vel.y >= 0 && player.pos.y + player.height/2 <= this.pos.y - this.height/2 + 10) {
              // Snap to top
              player.pos.y = this.pos.y - this.height/2 - player.height/2;
              player.vel.y = 0;
              player.onGround = true;
          }
      }
  }
}
