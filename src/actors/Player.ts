import { 
  Actor, 
  Color, 
  CollisionType, 
  Engine, 
  Keys, 
  Vector,
  Side,
  vec
} from 'excalibur';
import { Config } from '../config';
import { MeleeAttack } from './MeleeAttack';
import { Juice } from '../utils/Juice';
import { Resources } from '../resources';

export class Player extends Actor {
  public onGround = false;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private isWallSliding = false;
  private wallSide: Side = Side.None;
  private isDashing = false;
  private dashTimer = 0;
  private dashCooldownTimer = 0;
  private attackCooldownTimer = 0;
  private facingRight = true;
  public maxHp = 5;
  public hp = 5;
  public currency = 0;
  private isInvulnerable = false;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.Player.Width,
      height: Config.Player.Height,
      color: Color.fromHex(Config.Player.Color),
      collisionType: CollisionType.Active
    });
  }

  public get dashReady(): boolean {
      return this.dashCooldownTimer <= 0;
  }

  public get dashCooldownRemaining(): number {
      return this.dashCooldownTimer;
  }

  onPreUpdate(engine: Engine, delta: number) {
    const keyboard = engine.input.keyboard;
    
    // Reset transient states
    this.onGround = false;
    this.isWallSliding = false;
    this.wallSide = Side.None;

    // Timers
    if (this.coyoteTimer > 0) this.coyoteTimer -= delta;
    if (this.jumpBufferTimer > 0) this.jumpBufferTimer -= delta;
    if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= delta;
    if (this.attackCooldownTimer > 0) this.attackCooldownTimer -= delta;

    // Attack Input
    if (keyboard.wasPressed(Keys.Z) && this.attackCooldownTimer <= 0) {
        this.performAttack(engine);
    }

    // Dash Logic
    if (this.isDashing) {
      this.dashTimer -= delta;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.vel.x = 0; 
      } else {
        this.vel.y = 0; // No gravity during dash
        this.vel.x = (this.facingRight ? 1 : -1) * Config.Player.DashSpeed;
        return; // Skip other movement logic
      }
    }

    // Dash Input
    if (keyboard.wasPressed(Keys.ShiftLeft) && this.dashCooldownTimer <= 0) {
      this.startDash();
      return;
    }

    // Horizontal Movement
    let xInput = 0;
    if (keyboard.isHeld(Keys.Left) || keyboard.isHeld(Keys.A)) xInput -= 1;
    if (keyboard.isHeld(Keys.Right) || keyboard.isHeld(Keys.D)) xInput += 1;

    if (xInput !== 0) {
      this.facingRight = xInput > 0;
      // Acceleration
      const targetSpeed = xInput * Config.Player.RunSpeed;
      const accel = Config.Player.Acceleration * (delta / 1000);
      
      // Smooth acceleration
      if (xInput > 0) {
          this.vel.x = Math.min(this.vel.x + accel, targetSpeed);
      } else {
          this.vel.x = Math.max(this.vel.x - accel, targetSpeed);
      }
    } else {
      // Deceleration
      const decel = Config.Player.Deceleration * (delta / 1000);
      if (this.vel.x > 0) {
        this.vel.x = Math.max(0, this.vel.x - decel);
      } else if (this.vel.x < 0) {
        this.vel.x = Math.min(0, this.vel.x + decel);
      }
    }

    // Jump Input
    if (keyboard.wasPressed(Keys.Space) || keyboard.wasPressed(Keys.Up) || keyboard.wasPressed(Keys.W)) {
      this.jumpBufferTimer = Config.Player.JumpBuffer;
    }

    // Variable Jump Height
    if ((keyboard.wasReleased(Keys.Space) || keyboard.wasReleased(Keys.Up) || keyboard.wasReleased(Keys.W)) && this.vel.y < 0) {
      this.vel.y *= 0.5;
    }
  }

  onPostUpdate() {
     // Fallback Ground Check (Velocity based)
     if (Math.abs(this.vel.y) < 1) {
         this.onGround = true;
     }

     // Coyote Time Logic
     if (this.onGround) {
         this.coyoteTimer = Config.Player.CoyoteTime;
     }

     // Wall Slide Logic
     if (!this.onGround && this.wallSide !== Side.None && this.vel.y > 0) {
         this.isWallSliding = true;
         this.vel.y = Config.Player.WallSlideSpeed;
     }

     // Jump Logic
     if (this.jumpBufferTimer > 0) {
         if (this.onGround || this.coyoteTimer > 0) {
             this.performJump();
         } else if (this.isWallSliding) {
             this.performWallJump();
         }
     }
  }

  onPostCollision(evt: any) {
    // Check if we hit the ground
    if (evt.side === Side.Bottom) {
      this.onGround = true;
    }
    
    // Check walls
    if (evt.side === Side.Left) {
        this.wallSide = Side.Left;
    } else if (evt.side === Side.Right) {
        this.wallSide = Side.Right;
    }
  }

  private startDash() {
    Resources.Dash.play();
    this.isDashing = true;
    this.dashTimer = Config.Player.DashDuration;
    this.dashCooldownTimer = Config.Player.DashCooldown;
    this.vel.y = 0;
    this.vel.x = (this.facingRight ? 1 : -1) * Config.Player.DashSpeed;
    
    // Spawn Dash Trail
    const ghostTimer = setInterval(() => {
        if (!this.isDashing) {
            clearInterval(ghostTimer);
            return;
        }
        this.spawnGhost();
    }, 30);
  }

  private spawnGhost() {
      const ghost = new Actor({
          pos: this.pos.clone(),
          width: this.width,
          height: this.height,
          color: Color.fromHex(Config.Player.Color).clone(),
          opacity: 0.5
      });
      ghost.graphics.opacity = 0.5; // Ensure graphics opacity is set
      
      // Fade out
      ghost.actions.fade(0, 200).die();
      
      this.scene?.add(ghost);
  }

  private performJump() {
    Resources.Jump.play();
    this.vel.y = Config.Player.JumpForce;
    this.onGround = false;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
  }

  private performWallJump() {
      this.vel.y = Config.Player.WallJumpForce.y;
      // Kick off away from wall
      if (this.wallSide === Side.Left) {
          this.vel.x = Config.Player.WallJumpForce.x;
      } else {
          this.vel.x = -Config.Player.WallJumpForce.x;
      }
      this.jumpBufferTimer = 0;
      this.isWallSliding = false;
  }

  public takeDamage(amount: number, sourcePos: Vector) {
      if (this.isInvulnerable) return;

      this.hp -= amount;
      this.isInvulnerable = true;
      
      // Knockback
      const dir = this.pos.x < sourcePos.x ? -1 : 1;
      this.vel.x = dir * 500;
      this.vel.y = -300;

      Resources.Hit.play();

      // Juice
      Juice.screenShake(this.scene!, 5, 300);
      Juice.hitStop(this.scene!.engine, 50);
      
      // Invulnerability Flash
      let flashCount = 0;
      const flashInterval = setInterval(() => {
          this.graphics.visible = !this.graphics.visible;
          flashCount++;
          if (flashCount > 10) {
              clearInterval(flashInterval);
              this.graphics.visible = true;
              this.isInvulnerable = false;
          }
      }, 100);
      
      if (this.hp <= 0) {
          this.kill();
          console.log("GAME OVER");
          // Reload scene or show game over
          // location.reload(); 
      }
  }

  private performAttack(engine: Engine) {
      this.attackCooldownTimer = Config.Player.AttackCooldown;
      const keyboard = engine.input.keyboard;
      
      let offset = vec(0, 0);
      let size = vec(Config.Player.AttackSize.x, Config.Player.AttackSize.y);

      // Determine direction
      if (keyboard.isHeld(Keys.Up) || keyboard.isHeld(Keys.W)) {
          // Up Attack
          offset = vec(0, -Config.Player.AttackOffset);
          size = vec(Config.Player.AttackSize.y, Config.Player.AttackSize.x); // Rotate hitbox
      } else if ((keyboard.isHeld(Keys.Down) || keyboard.isHeld(Keys.S)) && !this.onGround) {
          // Down Attack (Pogo)
          offset = vec(0, Config.Player.AttackOffset + Config.Player.Height/2);
          size = vec(Config.Player.AttackSize.y, Config.Player.AttackSize.x);
          
          // Pogo Logic: We need to check if we actually hit something to bounce
          // But for now, let's just spawn the hitbox. 
          // The hitbox itself should probably callback to the player if it hits something.
      } else {
          // Side Attack
          offset = vec(this.facingRight ? Config.Player.AttackOffset : -Config.Player.AttackOffset, 0);
      }

      const attackPos = this.pos.add(offset);
      const attack = new MeleeAttack(attackPos, size);
      
      // Pass a callback for pogo
      attack.on('postcollision', (evt: any) => {
          if ((keyboard.isHeld(Keys.Down) || keyboard.isHeld(Keys.S)) && !this.onGround) {
             // Check if we hit something solid or enemy
             if (evt.other.collisionType === CollisionType.Fixed || evt.other.name === 'Enemy') {
                 this.vel.y = Config.Player.PogoForce;
                 this.dashCooldownTimer = 0; // Reset dash on pogo? (Silksong mechanic?)
                 this.isDashing = false; // Cancel dash
             }
          }
      });

      engine.add(attack);
  }
}
