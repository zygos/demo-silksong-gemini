import { Loader, Sound } from 'excalibur';

// Base64 placeholder for a beep sound
// const beepSound = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'; // Truncated for brevity, actually need a real one or just use empty

export const Resources = {
  // Sounds
  Jump: new Sound('./jump.wav'), // We will need to create these dummy files
  Hit: new Sound('./hit.wav'),
  Dash: new Sound('./dash.wav')
}

export const loader = new Loader();
loader.addResource(Resources.Jump);
loader.addResource(Resources.Hit);
loader.addResource(Resources.Dash);
