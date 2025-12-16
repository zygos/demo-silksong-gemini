import { Actor, CollisionType, Color, Engine, Vector } from 'excalibur';
import { Config } from '../config';
import { Enemy } from './Enemy';
import { Juice } from '../utils/Juice';

export class MeleeAttack extends Actor {
  constructor(pos: Vector, size: Vector) {
    super({
      pos: pos,
      width: size.x,
      height: size.y,
      color: Color.Transparent, // Invisible hitbox (debug with Red if needed)
      collisionType: CollisionType.Passive
    });
  }

  onInitialize(engine: Engine) {
    // Destroy self after duration
    engine.clock.schedule(() => {
      this.kill();
    }, Config.Player.AttackDuration);

    this.on('collisionstart', (evt) => {
        if (evt.other instanceof Enemy) {
            evt.other.takeDamage(1);
            
            // Juice
            Juice.screenShake(this.scene!, 2, 100);
            Juice.hitStop(this.scene!.engine, 50);
        }
    });
  }
}
