import { Vector, Color } from 'excalibur';
import { Enemy } from './Enemy';

export class EliteEnemy extends Enemy {
  constructor(pos: Vector) {
    super(pos, 48, 48);
    this.name = 'EliteEnemy';
    this.color = Color.Violet;
    this.hp = 10;
    this.speed = 80;
    this.damage = 2;
  }
}
