import { Actor, CollisionType, Color, Engine, Vector } from 'excalibur';
import { Config } from '../config';
import { Enemy } from './Enemy';

export class MeleeAttack extends Actor {
  constructor(pos: Vector, size: Vector) {
    super({
      pos: pos,
      width: size.x,
      height: size.y,
      color: Color.Red, // Visual debug
      collisionType: CollisionType.Passive // Detects collision but doesn't resolve physics
    });
  }

  onInitialize(engine: Engine) {
    // Destroy self after duration
    engine.clock.schedule(() => {
      this.kill();
    }, Config.Player.AttackDuration);
  }

  onPostCollision(evt: any) {
      if (evt.other instanceof Enemy) {
          evt.other.takeDamage(1);
          // Screen Shake
          this.scene?.camera.shake(5, 5, 200);
          // Hitstop (Sleep the engine? No, just time scale)
          // Excalibur doesn't have built-in hitstop easily accessible without pausing update
          // We can simulate it by setting timeScale to 0 then back to 1
          if (this.scene && this.scene.engine) {
              const engine = this.scene.engine;
              engine.timescale = 0.1;
              setTimeout(() => {
                  engine.timescale = 1;
              }, 50); // 50ms hitstop
          }
      }
  }
}
