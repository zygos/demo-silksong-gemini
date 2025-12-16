import { Scene, Actor, Color, vec, CollisionType } from 'excalibur';
import { Player } from '../actors/Player';
import { Door } from '../actors/Door';
import { Boss } from '../actors/Boss';
import { BossHealthBar } from '../ui/BossHealthBar';

export class Level2 extends Scene {
  private player!: Player;

  onInitialize() {
    // Create Player
    this.player = new Player(vec(100, 300));
    this.add(this.player);

    // Create Boss
    const boss = new Boss(vec(600, 450));
    this.add(boss);
    
    // UI
    const bossBar = new BossHealthBar(boss);
    this.add(bossBar);

    // Create Floor
    const floor = new Actor({
      pos: vec(400, 550),
      width: 800,
      height: 40,
      color: Color.fromHex('#5D4037'), // Brownish
      collisionType: CollisionType.Fixed
    });
    this.add(floor);

    // Back Door
    const door = new Door(vec(100, 490), 'level1', vec(700, 490));
    this.add(door);

    // Camera follow
    this.camera.strategy.lockToActor(this.player);
    this.camera.zoom = 1.2;

    // Camera bounds
    this.camera.strategy.limitCameraBounds(new Actor({
        pos: vec(400, 300),
        width: 800,
        height: 600
    }).collider.bounds);
  }

  onActivate(context: any) {
      if (context.data && context.data.spawnPos) {
          this.player.pos = context.data.spawnPos;
          this.player.vel = vec(0, 0);
      }
  }
}
