import { Actor, Color, CollisionType, Engine, Vector } from 'excalibur';
import { SaveSystem } from '../utils/SaveSystem';

export class Door extends Actor {
  public targetScene: string;
  public targetPos: Vector;

  constructor(pos: Vector, targetScene: string, targetPos: Vector) {
    super({
      pos: pos,
      width: 40,
      height: 80,
      color: Color.Yellow,
      collisionType: CollisionType.Passive
    });
    this.targetScene = targetScene;
    this.targetPos = targetPos;
  }

  onInitialize(engine: Engine) {
      this.on('collisionstart', (evt) => {
          if (evt.other.constructor.name === 'Player') {
              // Save Progress
              SaveSystem.save({ scene: this.targetScene });
              
              // Transition
              console.log('Transitioning to ' + this.targetScene);
              engine.goToScene(this.targetScene);
          }
      });
  }
}
