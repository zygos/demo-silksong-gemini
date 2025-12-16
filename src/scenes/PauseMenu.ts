import { Scene, Color, Label, Font, FontUnit, Vector, Engine, TextAlign } from 'excalibur';

export class PauseMenu extends Scene {
  public returnScene: string = 'level1';

  onInitialize(_engine: Engine) {
    const label = new Label({
      text: 'PAUSED',
      pos: new Vector(400, 100),
      font: new Font({
        family: 'Arial',
        size: 40,
        unit: FontUnit.Px,
        color: Color.White,
        textAlign: TextAlign.Center
      })
    });
    this.add(label);

    const controls = new Label({
      text: 'Controls:\nWASD / Arrows: Move\nSpace / W / Up: Jump\nShift: Dash\nZ: Attack\n\nPress ESC to Resume',
      pos: new Vector(400, 250),
      font: new Font({
        family: 'Arial',
        size: 24,
        unit: FontUnit.Px,
        color: Color.White,
        textAlign: TextAlign.Center
      })
    });
    this.add(controls);
  }

  onActivate(_context: any) {
      if (_context.data && _context.data.returnScene) {
          this.returnScene = _context.data.returnScene;
      }
  }
}
