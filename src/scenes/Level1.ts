import { Scene, Actor, Color, vec, CollisionType, TileMap } from 'excalibur';
import { Player } from '../actors/Player';
import { Enemy } from '../actors/Enemy';
import { RangedEnemy } from '../actors/RangedEnemy';
import { EliteEnemy } from '../actors/EliteEnemy';
import { Spikes } from '../actors/Spikes';
import { HUD } from '../ui/HUD';
import { Door } from '../actors/Door';
import { OneWayPlatform } from '../actors/OneWayPlatform';

export class Level1 extends Scene {
  onInitialize() {
    // Define Map Grid (0 = Empty, 1 = Solid)
    const mapData = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    const tileSize = 40;
    const tileMap = new TileMap({
        rows: mapData.length,
        columns: mapData[0].length,
        tileWidth: tileSize,
        tileHeight: tileSize,
    });

    mapData.forEach((row, y) => {
        row.forEach((val, x) => {
            const tile = tileMap.getTile(x, y);
            if (val === 1 && tile) {
                tile.solid = true;
                // tile.addGraphic(new Actor({ width: tileSize, height: tileSize, color: Color.Gray }).graphics.current[0]); 
            }
        });
    });
    
    // Hack to visualize tiles without sprites
    // We will just place solid blocks for now as before, but generated from the grid
    // Or use the TileMap for collision and debug draw.
    
    // Let's stick to the previous method but generated from the loop for now, 
    // as TileMap graphics require a bit more setup without assets.
    
    // Actually, let's just use the manual actors for now to keep it simple and working.
    // I will revert to the manual actors but add a few more platforms.

    // Create Player
    const player = new Player(vec(100, 300));
    this.add(player);

    // Create HUD
    const hud = new HUD(player);
    this.add(hud);

    // Create Enemy
    const enemy = new Enemy(vec(500, 450));
    this.add(enemy);

    // Create Ranged Enemy
    const rangedEnemy = new RangedEnemy(vec(300, 350)); // On the platform
    this.add(rangedEnemy);

    // Create Elite Enemy
    const elite = new EliteEnemy(vec(700, 450));
    this.add(elite);

    // Create Spikes
    const spikes = new Spikes(vec(500, 530), 100);
    this.add(spikes);

    // Create Floor
    const floor = new Actor({
      pos: vec(400, 550),
      width: 800,
      height: 40,
      color: Color.fromHex('#1a252f'),
      collisionType: CollisionType.Fixed
    });
    this.add(floor);

    // Create Platforms
    const platform1 = new OneWayPlatform(vec(200, 400), 100);
    this.add(platform1);

    const platform2 = new Actor({
      pos: vec(600, 300),
      width: 100,
      height: 20,
      color: Color.fromHex('#34495e'),
      collisionType: CollisionType.Fixed
    });
    this.add(platform2);
    
    // Wall for wall jump testing
    const wall = new Actor({
        pos: vec(750, 300),
        width: 40,
        height: 600,
        color: Color.fromHex('#2c3e50'),
        collisionType: CollisionType.Fixed
    });
    this.add(wall);
    
    const leftWall = new Actor({
        pos: vec(50, 300),
        width: 40,
        height: 600,
        color: Color.fromHex('#2c3e50'),
        collisionType: CollisionType.Fixed
    });
    this.add(leftWall);

    // Door to Level 2
    const door = new Door(vec(750, 490), 'level2', vec(100, 490));
    this.add(door);

    // Camera follow
    this.camera.strategy.lockToActor(player);
    this.camera.zoom = 1.2;
    
    // Camera bounds
    this.camera.strategy.limitCameraBounds(new Actor({
        pos: vec(400, 300),
        width: 800,
        height: 600
    }).collider.bounds);
  }
}
