import { Actor, Color, CollisionType, Vector, Engine, ParticleEmitter, EmitterType } from 'excalibur';
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
      Juice.flash(this, Color.White, 50);
      Juice.hitStop(this.scene!.engine, 20);

      // Particles
      const emitter = new ParticleEmitter({
        pos: this.pos.clone(),
        width: 5,
        height: 5,
        emitterType: EmitterType.Circle,
        radius: 5,
        isEmitting: true,
        emitRate: 300,
        particle: {
            life: 500,
            minSpeed: 100,
            maxSpeed: 200,
            minAngle: 0,
            maxAngle: 6.2,
            opacity: 1,
            fade: true,
            maxSize: 5,
            minSize: 1,
            startSize: 5,
            endSize: 0,
            beginColor: Color.Red,
            endColor: Color.Orange
        }
      });
      this.scene?.add(emitter);
      setTimeout(() => {
          emitter.isEmitting = false;
          emitter.kill(); 
      }, 100);


      if (this.hp <= 0) {
          Juice.screenShake(this.scene!, 2, 100); // Small shake on death
          this.kill();
      }
  }
}
