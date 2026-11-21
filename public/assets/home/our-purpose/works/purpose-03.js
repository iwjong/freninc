(() => {
  const DURATION = 1830;
  const RADIUS = 58.67;
  // Measured 30 ms poses retain the reference's quick transfer and settling bounce.
  const POSITION = [108, 107.6, 106.5, 104.3, 101, 96.4, 90, 81.5, 70.3, 55.5,
    35.7, 9.75, -22.17, -54.86, -81.46, -100.3, -112.9, -121, -126, -128.6,
    -129.4, -129, -127.9, -125.6, -122.2, -117.9, -113.9, -111, -109.2, -108.2, -108];
  const RETURN_POSITION = POSITION.map((value, i) => i === 14 ? -76.55 : i === 15 ? -95.38 : value);
  const OUTER = [RADIUS, 58.55, 58.55, 58.35, 58.15, 57.75, 57.25, 56.55, 55.35, 53.35,
    47.55, 41.84, 39.8, 38.68, 37.92, 37.41, 37.2, 36.9, 36.8, 36.67];
  const RETURN_OUTER = [RADIUS, 58.45, 57.95, 56.95, 55.35, 53.15, 49.95, 45.55, 39.15, 36.67];
  const HOLE = [36.67, 36.6, 36.3, 35.8, 34.9, 33.7, 32, 29.6, 26, 20.1, 9, 0];
  const BIRTH = [0, 16.72, 34.44, 43.45, 48.95, 52.65, 55.15, 56.75, 57.85, 58.45, RADIUS];

  function sample(values, frame) {
    const position = Math.max(0, Math.min(frame, values.length - 1));
    const index = Math.floor(position);
    return values[index] + (values[Math.min(index + 1, values.length - 1)] - values[index]) * (position - index);
  }

  function axis(frame) {
    const returning = frame >= 30;
    const local = Math.min(frame, 60) - (returning ? 30 : 0);
    return {
      position: sample(returning ? RETURN_POSITION : POSITION, local),
      outer: sample(returning ? RETURN_OUTER : OUTER, local),
      hole: sample(HOLE, local),
      birth: sample(BIRTH, local - 13),
      direction: returning ? -1 : 1,
    };
  }

  const work = {
    size: [800, 600],
    frame(time) {
      const frame = (((time % DURATION) + DURATION) % DURATION) / 30;
      const h = axis(frame);
      const v = axis((frame + 44) % 61);
      return {
        hPosition: h.position, hOuter: h.outer, hHole: h.hole, hBirth: h.birth, hDirection: h.direction,
        vPosition: v.position, vOuter: v.outer, vHole: v.hole, vBirth: v.birth, vDirection: v.direction,
      };
    },
    scene: `
uniform float hPosition, hOuter, hHole, hBirth, hDirection;
uniform float vPosition, vOuter, vHole, vBirth, vDirection;

float exclusive(float a, float b) {
  return max(min(a, b), -max(a, b));
}

float pair(vec2 p, float position, float outer, float hole, float birth) {
  float target = length(p - vec2(min(-108.0, position), 0.0)) - 58.67;
  float carrier = length(p - vec2(position, 0.0)) - outer;
  if (hole > 0.0) carrier = max(carrier, hole - length(p - vec2(position, 0.0)));
  float shape = exclusive(target, carrier);
  if (birth > 0.0) shape = exclusive(shape, length(p - vec2(108.0, 0.0)) - birth);
  return shape;
}

float scene(vec2 p) {
  float horizontal = pair(vec2(p.x * hDirection, p.y), hPosition, hOuter, hHole, hBirth);
  float vertical = pair(vec2(p.y * vDirection, p.x), vPosition, vOuter, vHole, vBirth);
  return min(horizontal, vertical);
}
`,
  };

  document.querySelectorAll('[data-purpose="03"]').forEach(canvas => Purpose.mount(canvas, work));
})();
