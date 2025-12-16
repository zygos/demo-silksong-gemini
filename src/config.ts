export const Config = {
  Player: {
    Width: 32,
    Height: 64,
    Color: '#E6E6FA', // Lavender
    RunSpeed: 300,
    Acceleration: 800,
    Deceleration: 1200,
    JumpForce: -500,
    Gravity: 1200,
    CoyoteTime: 100, // ms
    JumpBuffer: 100, // ms
    WallSlideSpeed: 100,
    WallJumpForce: { x: 400, y: -450 },
    DashSpeed: 800,
    DashDuration: 150, // ms
    DashCooldown: 800, // ms
    AttackDuration: 150, // ms
    AttackCooldown: 300, // ms
    AttackSize: { x: 40, y: 40 },
    AttackOffset: 30,
    PogoForce: -600,
  }
};
