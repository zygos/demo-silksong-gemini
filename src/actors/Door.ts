import { Actor, Color, CollisionType, Engine, Vector, Label, Font, FontUnit, Keys, TextAlign, vec } from 'excalibur';
import { SaveSystem } from '../utils/SaveSystem';
import { Player } from './Player';

export class Door extends Actor {
  public targetScene: string;
  public targetPos: Vector;
  private isPlayerInRange = false;
  private promptLabel: Label;

  constructor(pos: Vector, targetScene: string, targetPos: Vector) {
    super({
      pos: pos,
      width: 40,
      height: 80,
      color: Color.fromHex('#5D4037'), // Darker wood color
      collisionType: CollisionType.Passive
    });
    this.targetScene = targetScene;
    this.targetPos = targetPos;

    // Add a frame (visual only)
    const frame = new Actor({
        pos: vec(0, 0),
        width: 50,
        height: 90,
        color: Color.fromHex('#3E2723'),
        z: -1, // Behind door
        collisionType: CollisionType.PreventCollision
    });
    this.addChild(frame);

    this.promptLabel = new Label({
        text: 'PRESS UP',
        pos: new Vector(0, -60),
        font: new Font({
            family: 'Sans-Serif',
            size: 20,
            unit: FontUnit.Px,
            color: Color.Yellow,
            textAlign: TextAlign.Center,
            bold: true,
            shadow: { blur: 2, offset: vec(2, 2), color: Color.Black }
        })
    });
    this.promptLabel.z = 99; // Ensure label is on top
    this.promptLabel.graphics.visible = false;
    this.addChild(this.promptLabel);
  }

  onInitialize(_engine: Engine) {
      this.on('collisionstart', (evt) => {
          // In Excalibur 0.31, evt.other is Actor. 
          // But if TS says Collider, maybe the types are weird.
          // Let's try to be safe.
          const actor = (evt.other instanceof Actor) ? evt.other : (evt.other as any).owner;
          
          if (actor instanceof Player || actor.name === 'Player') {
              console.log('Player entered door range');
              this.isPlayerInRange = true;
              this.promptLabel.graphics.visible = true;
          }
      });

      this.on('collisionend', (evt) => {
          const actor = (evt.other instanceof Actor) ? evt.other : (evt.other as any).owner;
          if (actor instanceof Player || actor.name === 'Player') {
              console.log('Player exited door range');
              this.isPlayerInRange = false;
              this.promptLabel.graphics.visible = false;
          }
      });
  }

  onPreUpdate(engine: Engine, _delta: number) {
      if (this.isPlayerInRange) {
          if (engine.input.keyboard.wasPressed(Keys.Up) || engine.input.keyboard.wasPressed(Keys.W)) {
              this.transition(engine);
          }
      }
  }

  private transition(engine: Engine) {
      // Save Progress
      SaveSystem.save({ scene: this.targetScene });
      
      // Transition
      console.log('Transitioning to ' + this.targetScene);
      engine.goToScene(this.targetScene, { sceneActivationData: { spawnPos: this.targetPos } });
  }
}
