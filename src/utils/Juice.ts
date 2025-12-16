import { Actor, Color, Engine, Scene } from 'excalibur';

export class Juice {
  static flash(actor: Actor, color: Color = Color.White, duration: number = 50) {
    const originalColor = actor.color.clone();
    actor.color = color;
    setTimeout(() => {
      actor.color = originalColor;
    }, duration);
  }

  static screenShake(scene: Scene, magnitude: number = 5, duration: number = 200) {
    scene.camera.shake(magnitude, magnitude, duration);
  }

  static hitStop(engine: Engine, duration: number = 50) {
    const originalTimescale = engine.timescale;
    engine.timescale = 0.1; // Slow down significantly instead of full stop to keep some feel
    setTimeout(() => {
      engine.timescale = originalTimescale;
    }, duration);
  }
}
