import { Actor, Color, CollisionType, Vector, Engine } from 'excalibur';
import { Player } from './Player';
import { Juice } from '../utils/Juice';

enum BossState {
  Idle,
  Chase,
  TelegraphDash,
  DashAttack,
  TelegraphJump,
  JumpAttack,
  LandRecovery,
  TelegraphProjectile,
  ProjectileAttack,
  Cooldown
}

export class Boss extends Actor {
  private hp = 30;
  private maxHp = 30;
  private state = BossState.Idle;
  private stateTimer = 0;
  private target: Player | null = null;
  private facingRight = false;
  private isEnraged = false;
  
  public get currentHp() { return this.hp; }
  public get maxHealth() { return this.maxHp; }

  // Config
  private speed = 100;
  private dashSpeed = 400;
  private jumpForce = -600;
  private cooldownTime = 1500;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: 64,
      height: 96,
      color: Color.Violet,
      collisionType: CollisionType.Active,
      name: 'Boss'
    });
  }

  onInitialize(_engine: Engine) {
      this.target = this.scene?.actors.find(a => a instanceof Player) as Player;
  }

  onPostCollision(evt: any) {
      if (evt.other instanceof Player) {
          evt.other.takeDamage(1, this.pos);
      }
  }

  public takeDamage(amount: number) {
      this.hp -= amount;
      
      // Juice
      Juice.flash(this, Color.White, 50);
      Juice.hitStop(this.scene!.engine, 20);

      if (this.hp <= this.maxHp / 2 && !this.isEnraged) {
          this.enterEnragedMode();
          Juice.screenShake(this.scene!, 5, 500); // Shake on enrage
      }

      if (this.hp <= 0) {
          Juice.screenShake(this.scene!, 10, 1000); // Big shake on death
          this.kill();
          console.log("BOSS DEFEATED");
      }
  }

  private enterEnragedMode() {
      this.isEnraged = true;
      this.color = Color.Red; // Visual indicator
      this.speed *= 1.5;
      this.dashSpeed *= 1.3;
      this.cooldownTime /= 2;
      console.log("BOSS ENRAGED!");
  }

  onPreUpdate(_engine: Engine, delta: number) {
      if (!this.target) return;

      this.stateTimer -= delta;

      // Face Player (only when not attacking)
      if (this.state === BossState.Idle || this.state === BossState.Chase || this.state === BossState.Cooldown) {
          this.facingRight = this.target.pos.x > this.pos.x;
      }

      switch (this.state) {
          case BossState.Idle:
              this.vel.x = 0;
              if (this.stateTimer <= 0) {
                  this.changeState(BossState.Chase);
              }
              break;
          
          case BossState.Chase:
              const dir = this.facingRight ? 1 : -1;
              this.vel.x = dir * this.speed;
              
              const dist = Math.abs(this.target.pos.x - this.pos.x);
              if (dist < 300 && this.stateTimer <= 0) {
                  this.chooseAttack();
              }
              break;

          case BossState.TelegraphDash:
              this.vel.x = 0;
              // Flash warning
              if (Math.floor(Date.now() / 100) % 2 === 0) {
                  this.color = Color.Yellow;
              } else {
                  this.color = this.isEnraged ? Color.Red : Color.Violet;
              }

              if (this.stateTimer <= 0) {
                  this.color = this.isEnraged ? Color.Red : Color.Violet;
                  this.changeState(BossState.DashAttack);
              }
              break;

          case BossState.DashAttack:
              // Dash logic set in changeState
              if (this.stateTimer <= 0) {
                  this.vel.x = 0;
                  this.changeState(BossState.Cooldown);
              }
              break;

          case BossState.TelegraphJump:
              this.vel.x = 0;
              // Squish effect?
              if (this.stateTimer <= 0) {
                  this.changeState(BossState.JumpAttack);
              }
              break;

          case BossState.JumpAttack:
               // Wait until grounded
               if (this.onGround && this.vel.y >= 0) {
                   // Slam effect
                   this.scene?.camera.shake(10, 10, 300);
                   this.changeState(BossState.LandRecovery);
               }
               break;
            
          case BossState.LandRecovery:
              this.vel.x = 0;
              if (this.stateTimer <= 0) {
                  this.changeState(BossState.Cooldown);
              }
              break;

          case BossState.Cooldown:
              this.vel.x = 0;
              if (this.stateTimer <= 0) {
                  this.changeState(BossState.Idle);
              }
              break;
      }
  }

  private chooseAttack() {
      const rand = Math.random();
      if (rand < 0.5) {
          this.changeState(BossState.TelegraphDash);
      } else {
          this.changeState(BossState.TelegraphJump);
      }
  }

  private changeState(newState: BossState) {
      this.state = newState;
      
      switch (newState) {
          case BossState.Idle:
              this.stateTimer = 500;
              break;
          case BossState.Chase:
              this.stateTimer = 2000; // Max chase time
              break;
          case BossState.TelegraphDash:
              this.stateTimer = this.isEnraged ? 300 : 600;
              break;
          case BossState.DashAttack:
              this.stateTimer = 500;
              const dashDir = this.facingRight ? 1 : -1;
              this.vel.x = dashDir * this.dashSpeed;
              break;
          case BossState.TelegraphJump:
              this.stateTimer = this.isEnraged ? 200 : 400;
              break;
          case BossState.JumpAttack:
              this.vel.y = this.jumpForce;
              // Track player slightly during jump
              const jumpDir = this.target!.pos.x > this.pos.x ? 1 : -1;
              this.vel.x = jumpDir * (this.speed * 1.5);
              break;
          case BossState.LandRecovery:
              this.stateTimer = 500;
              break;
          case BossState.Cooldown:
              this.stateTimer = this.cooldownTime;
              break;
      }
  }
  
  // Helper for ground check
  private get onGround(): boolean {
      return Math.abs(this.vel.y) < 1;
  }
}
