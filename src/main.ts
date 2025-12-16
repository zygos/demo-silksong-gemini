import { Engine, DisplayMode, Color, vec, Keys } from 'excalibur';
import { Level1 } from './scenes/Level1';
import { Level2 } from './scenes/Level2';
import { PauseMenu } from './scenes/PauseMenu';
import { SaveSystem } from './utils/SaveSystem';
import { loader } from './resources';

const game = new Engine({
  width: 800,
  height: 600,
  displayMode: DisplayMode.FitScreen,
  backgroundColor: Color.fromHex('#2c3e50'),
  pixelArt: true, // Optimizes for pixel art
  physics: {
    enabled: true,
    gravity: vec(0, 1200) // Standard gravity
  }
});

game.add('level1', new Level1());
game.add('level2', new Level2());
game.add('pause', new PauseMenu());

game.input.keyboard.on('press', (evt) => {
    if (evt.key === Keys.Esc) {
        if (game.currentScene instanceof PauseMenu) {
            game.goToScene(game.currentScene.returnScene);
        } else {
            // Go to pause
            // We need to know the current scene name. 
            // Excalibur doesn't expose currentSceneName easily on the public API in all versions?
            // Let's iterate to find it or just pass the scene object if possible?
            // PauseMenu expects a string.
            
            // Hack: find key by value
            let currentSceneName = 'level1';
            for (const [key, value] of Object.entries(game.scenes)) {
                if (value === game.currentScene) {
                    currentSceneName = key;
                    break;
                }
            }
            
            game.goToScene('pause', { sceneActivationData: { returnScene: currentSceneName } });
        }
    }
});

game.start(loader).then(() => {
  const save = SaveSystem.load();
  if (save && save.scene) {
      game.goToScene(save.scene);
  } else {
      game.goToScene('level1');
  }
  console.log('Game started!');
});
