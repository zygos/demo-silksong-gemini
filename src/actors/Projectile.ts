import { Actor, Color, CollisionType, Vector, Engine } from 'excalibur';
import { Player } from './Player';

export class Projectile extends Actor {
  private speed = 400;
  private dir: Vector;

  constructor(pos: Vector, dir: Vector) {
    super({
      pos: pos,
      width: 10,
      height: 10,
      color: Color.Orange,
      collisionType: CollisionType.Passive
    });
    this.dir = dir.normalize();
  }

  onInitialize(engine: Engine) {
      this.vel = this.dir.scale(this.speed);
      
      // Destroy after 2 seconds if no hit
      engine.clock.schedule(() => {
          if (!this.isKilled()) this.kill();
      }, 2000);
  }

  onPostCollision(evt: any) {
      if (evt.other instanceof Player) {
          evt.other.takeDamage(1, this.pos);
          this.kill();
      } else if (evt.other.collisionType === CollisionType.Fixed) {
          this.kill();
      }
  }
}
