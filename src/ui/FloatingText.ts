import { Actor, Color, Engine, Font, FontUnit, Label, Vector } from 'excalibur';

export class FloatingText extends Actor {
  constructor(pos: Vector, text: string, color: Color = Color.White) {
    super({
      pos: pos,
      width: 1,
      height: 1,
      collisionType: 'PreventCollision' as any,
      z: 100 // Ensure it's on top
    });

    const label = new Label({
      text: text,
      pos: Vector.Zero,
      font: new Font({
        family: 'Sans-Serif',
        size: 20,
        unit: FontUnit.Px,
        color: color,
        bold: true
      })
    });
    this.addChild(label);
  }

  onInitialize(_engine: Engine) {
    this.vel = new Vector(0, -50); // Float up
    this.actions.fade(0, 500).die(); // Fade out and die
  }
}
