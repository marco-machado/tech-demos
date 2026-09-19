export const WIDTH = 720;
export const HEIGHT = 960;
export const TARGETS = [
  {
    x: 172,
    y: 245,
    radius: 74,
    width: 168,
    height: 168,
    texture: "bumper-red",
    color: 0xf24d31,
  },
  {
    x: 488,
    y: 250,
    radius: 77,
    width: 178,
    height: 152,
    texture: "bumper-blue",
    color: 0x1759d5,
  },
  {
    x: 340,
    y: 437,
    radius: 72,
    width: 174,
    height: 148,
    texture: "bumper-teal",
    color: 0x236c70,
  },
  {
    x: 162,
    y: 605,
    radius: 68,
    width: 182,
    height: 143,
    texture: "bumper-cream",
    color: 0xd4c9af,
  },
  {
    x: 510,
    y: 600,
    radius: 66,
    width: 160,
    height: 160,
    texture: "bumper-orange",
    color: 0xf2a31d,
  },
] as const;
type Point = { x: number; y: number };
type Ball = Point & { vx: number; vy: number };
const WALLS = [
  [35, 800, 30, 80],
  [30, 80, 85, 30],
  [85, 30, 645, 30],
  [645, 30, 694, 80],
  [694, 80, 694, 950],
  [658, 295, 658, 935],
  [42, 685, 200, 832],
  [650, 690, 525, 835],
] as const;

export class PinballSimulation {
  ball: Ball = { x: 680, y: 880, vx: 0, vy: 0 };
  active = false;
  paused = false;
  left = false;
  right = false;
  leftAngle = 0.38;
  rightAngle = Math.PI - 0.38;
  elapsed = 0;
  hits = 0;
  launches = 0;
  scaleX = 1;
  private accumulator = 0;
  private launching = false;
  private cooldown = TARGETS.map(() => 0);
  onHit: (index: number) => void = () => {};
  onDrain: () => void = () => {};

  resize(scaleX: number) {
    this.ball.x *= scaleX / this.scaleX;
    this.scaleX = scaleX;
  }

  launch() {
    if (this.paused || this.active) return false;
    this.ball = { x: 680 * this.scaleX, y: 880, vx: 0, vy: -1600 };
    this.active = true;
    this.launching = true;
    this.launches++;
    return true;
  }
  reset() {
    this.active = false;
    this.launching = false;
    this.ball = { x: 680 * this.scaleX, y: 880, vx: 0, vy: 0 };
    this.left = this.right = false;
    this.accumulator = 0;
  }
  update(delta: number) {
    if (this.paused) return;
    // Fixed 240 Hz steps prevent a fast ball passing through thin flippers.
    this.accumulator += Math.min(delta, 0.05);
    while (this.accumulator >= 1 / 240) {
      this.step(1 / 240);
      this.accumulator -= 1 / 240;
    }
  }
  private step(dt: number) {
    this.elapsed += dt;
    const oldLeft = this.leftAngle;
    const oldRight = this.rightAngle;
    this.leftAngle +=
      ((this.left ? -0.48 : 0.38) - this.leftAngle) * Math.min(1, dt * 36);
    this.rightAngle +=
      ((this.right ? Math.PI + 0.48 : Math.PI - 0.38) - this.rightAngle) *
      Math.min(1, dt * 36);
    if (!this.active) return;
    const b = this.ball;
    b.vy += 760 * dt;
    b.vx *= 1 - 0.06 * dt;
    b.vy *= 1 - 0.02 * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (this.launching && b.y < 80) {
      this.launching = false;
      b.x = 637 * this.scaleX;
      b.vx = -590 * this.scaleX;
      b.vy = -120;
    }
    for (const [x1, y1, x2, y2] of WALLS)
      this.segment(
        { x: x1 * this.scaleX, y: y1 },
        { x: x2 * this.scaleX, y: y2 },
        14,
        0.78,
      );
    TARGETS.forEach((target, index) => {
      const dx = b.x - target.x * this.scaleX,
        dy = b.y - target.y;
      const distance = Math.hypot(dx, dy);
      const radius = target.radius * Math.sqrt(this.scaleX) + 13;
      if (distance >= radius || distance === 0) return;
      const nx = dx / distance,
        ny = dy / distance;
      b.x = target.x * this.scaleX + nx * radius;
      b.y = target.y + ny * radius;
      const approach = b.vx * nx + b.vy * ny;
      if (approach < 0) {
        b.vx -= 2 * approach * nx;
        b.vy -= 2 * approach * ny;
        b.vx += nx * 200;
        b.vy += ny * 200;
        if (this.elapsed > this.cooldown[index]) {
          this.cooldown[index] = this.elapsed + 0.18;
          this.hits++;
          this.onHit(index);
        }
      }
    });
    this.flipper(
      200 * this.scaleX,
      842,
      this.leftAngle,
      (this.leftAngle - oldLeft) / dt,
      this.left,
    );
    this.flipper(
      520 * this.scaleX,
      842,
      this.rightAngle,
      (this.rightAngle - oldRight) / dt,
      this.right,
    );
    const speed = Math.hypot(b.vx, b.vy);
    if (!this.launching && speed > 1250) {
      b.vx *= 1250 / speed;
      b.vy *= 1250 / speed;
    }
    if (b.y > 990 || !Number.isFinite(b.x + b.y)) {
      this.reset();
      this.onDrain();
    }
  }
  private segment(a: Point, end: Point, radius: number, restitution: number) {
    const b = this.ball;
    const dx = end.x - a.x,
      dy = end.y - a.y;
    const t = Math.max(
      0,
      Math.min(1, ((b.x - a.x) * dx + (b.y - a.y) * dy) / (dx * dx + dy * dy)),
    );
    const px = a.x + t * dx,
      py = a.y + t * dy;
    const distance = Math.hypot(b.x - px, b.y - py);
    if (distance >= radius || distance < 0.001) return false;
    const nx = (b.x - px) / distance,
      ny = (b.y - py) / distance;
    b.x = px + nx * radius;
    b.y = py + ny * radius;
    const approach = b.vx * nx + b.vy * ny;
    if (approach < 0) {
      b.vx -= (1 + restitution) * approach * nx;
      b.vy -= (1 + restitution) * approach * ny;
    }
    return true;
  }
  private flipper(
    x: number,
    y: number,
    angle: number,
    velocity: number,
    held: boolean,
  ) {
    const end = {
      x: x + Math.cos(angle) * 145 * this.scaleX,
      y: y + Math.sin(angle) * 145 * this.scaleX,
    };
    if (this.segment({ x, y }, end, 29, 0.85) && held && this.ball.y < y + 25) {
      const strength = Math.min(1000, 660 + Math.abs(velocity) * 30);
      this.ball.vy = -strength;
      this.ball.vx += x < 360 * this.scaleX ? 175 : -175;
    }
  }
}
