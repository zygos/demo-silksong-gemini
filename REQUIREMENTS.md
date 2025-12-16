# Project Progress & Requirements

## Platform & Tech
- [x] **Target:** Chrome/Firefox/Safari (Desktop).
- [x] **Performance:** 60 FPS.
- [x] **Engine:** Excalibur.js (Lightweight 2D engine).
- [x] **Language:** TypeScript.
- [x] **Size:** Total download < 25 MB.

## Scope
- [ ] **Content:** 30–60 minutes of gameplay.
- [ ] **Map:** One small interconnected map (8–12 rooms).
- [ ] **Structure:**
    - [ ] One checkpoint hub.
    - [ ] One gated path.
    - [ ] One traversal/combat ability.
    - [ ] One boss.
- [ ] **Persistence:** Save progress via `localStorage` (checkpoint location + ability flag).

## Player Mechanics
- [x] **Movement:**
    - [x] Run acceleration/deceleration.
    - [x] Variable jump height.
    - [x] Coyote time (jump just after leaving platform).
    - [x] Jump buffer (input just before landing).
    - [x] Wall cling & wall jump.
    - [x] Air control.
    - [x] Short dash (cooldown based).
- [x] **Combat:**
    - [x] Directional melee attack (Side, Up, Down - pogo).
    - [x] Air attacks allowed.
    - [x] Brief invulnerability (iframes) on damage.
    - [x] Knockback on damage.
- [x] **Configuration:** Central config file for easy tuning of movement and combat values.

## Combat & Enemies
- [x] **Enemies:**
    - [x] **Melee:** Basic ground enemy.
    - [x] **Ranged:** Basic projectile enemy.
    - [x] **Elite:** Tougher version with more health/damage.
- [x] **Boss:**
    - [x] 3–4 telegraphed attacks.
    - [x] Faster second phase (enraged state).
- [x] **AI:** Simple state machines (Idle, Patrol, Chase, Attack).

## World & Systems
- [ ] **Level Design:** Tilemap-based (Tiled format).
- [x] **Physics:**
    - [x] Solid tiles.
    - [x] One-way platforms.
    - [x] Hazards (spikes, pits).
- [ ] **Room System:**
    - [ ] Doors/Gateways.
    - [ ] Camera bounds per room.
    - [ ] Smooth room transitions.
- [x] **Camera:** Smooth follow.
    - [ ] Screen shake.
- [ ] **Optimization:** Object pooling for projectiles and particles.

## Presentation
- [ ] **UI/HUD:**
    - [x] Health (Masks/Hearts).
    - [x] Ability cooldown/energy.
    - [x] Currency counter.
- [x] **Menus:** Pause menu, End screen.
- [ ] **Juice:**
    - [ ] Hit flash (white sprite).
    - [ ] Light hitstop (freeze frames on impact).
    - [ ] Particles (blood, sparks).
    - [x] Dash trails.
    - [ ] Screen shake.
- [ ] **Audio:** One exploration track, one boss track, core SFX (jump, hit, dash).

## Out of Scope
- Inventory systems.
- NPC quests.
- Multiple biomes/bosses.
- Procedural generation.
