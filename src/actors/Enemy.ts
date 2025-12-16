import { Actor, Color, CollisionType, Vector, Engine } from 'excalibur';
import { Player } from './Player';
import { Juice } from '../utils/Juice';

export class Enemy extends Actor {
  protected hp = 3;
  protected patrolRange = 100;
  protected startX: number;
  protected direction = 1;
  protected speed = 50;
  protected damage = 1;

  constructor(pos: Vector, width: number = 32, height: number = 32) {
    super({
      pos: pos,
      width: width,
      height: height,
      color: Color.Red,
      collisionType: CollisionType.Active,
      name: 'Enemy'
    });
    this.startX = pos.x;
  }

  onPostCollision(evt: any) {
      if (evt.other instanceof Player) {
          evt.other.takeDamage(this.damage, this.pos);
      }
  }

  onPreUpdate(_engine: Engine, _delta: number) {
      // Simple Patrol Logic
      this.vel.x = this.speed * this.direction;

      if (this.pos.x > this.startX + this.patrolRange) {
          this.direction = -1;
      } else if (this.pos.x < this.startX - this.patrolRange) {
          this.direction = 1;
      }
  }

  public takeDamage(amount: number) {
      this.hp -= amount;
      
      // Juice
      Juice.flash(this, Color.White, 100);
      Juice.hitStop(this.scene!.engine, 20);
      Juice.spawnParticles(this.scene!, this.pos, Color.Orange);
      Juice.spawnDamageText(this.scene!, this.pos.sub(new Vector(0, 20)), amount);

      if (this.hp <= 0) {
          Juice.screenShake(this.scene!, 2, 100); // Small shake on death
          this.kill();
      }
  }
}
