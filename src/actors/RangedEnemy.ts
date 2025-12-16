import { Color, Vector, Engine } from 'excalibur';
import { Player } from './Player';
import { Projectile } from './Projectile';
import { Enemy } from './Enemy'; // Inherit from Enemy for shared logic like takeDamage

export class RangedEnemy extends Enemy {
  private attackRange = 400;
  private attackCooldown = 2000;
  private attackTimer = 0;
  private target: Player | null = null;

  constructor(pos: Vector) {
    super(pos);
    this.color = Color.Green; // Distinguish from melee
    this.name = 'RangedEnemy';
  }

  onInitialize(_engine: Engine) {
      this.target = this.scene?.actors.find(a => a instanceof Player) as Player;
  }

  onPreUpdate(_engine: Engine, delta: number) {
      if (!this.target) return;

      this.attackTimer -= delta;

      const dist = this.pos.distance(this.target.pos);
      
      // Face player
      if (this.target.pos.x > this.pos.x) {
          // this.graphics.flipHorizontal = false; // If using sprites
      } else {
          // this.graphics.flipHorizontal = true;
      }

      if (dist < this.attackRange && this.attackTimer <= 0) {
          this.shoot();
          this.attackTimer = this.attackCooldown;
      }
      
      // Simple patrol or stay still? 
      // Let's make it stationary turret for now, or very slow patrol
      // Overriding Enemy.onPreUpdate so it won't patrol like the base class unless we call super.onPreUpdate
      // But we want it to be different.
  }

  private shoot() {
      if (!this.target) return;
      
      const dir = this.target.pos.sub(this.pos);
      const projectile = new Projectile(this.pos.clone(), dir);
      this.scene?.add(projectile);
  }
}
