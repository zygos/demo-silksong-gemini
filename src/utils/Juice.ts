import { Actor, Color, Engine, Scene, ParticleEmitter, EmitterType, Vector } from 'excalibur';
import { FloatingText } from '../ui/FloatingText';

export class Juice {
  static flash(actor: Actor, color: Color = Color.White, duration: number = 100) {
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

  static spawnParticles(scene: Scene, pos: Vector, color: Color) {
      const emitter = new ParticleEmitter({
        pos: pos.clone(),
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
            maxAngle: 6.28,
            opacity: 1,
            fade: true,
            maxSize: 5,
            minSize: 1,
            startSize: 5,
            endSize: 0,
            beginColor: color,
            endColor: color
        }
      });
      scene.add(emitter);
      setTimeout(() => {
          emitter.isEmitting = false;
          // Let particles die naturally before killing emitter
          setTimeout(() => {
              emitter.kill();
          }, 600); 
      }, 100);
  }

  static spawnDamageText(scene: Scene, pos: Vector, damage: number) {
      const text = new FloatingText(pos, damage.toString(), Color.White);
      scene.add(text);
  }
}
