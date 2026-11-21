(() => {
  const DURATION = 2800;
  // Measured from the reference's 20 ms frames; interpolation keeps high-refresh playback smooth.
  const TURN = [
    0, 0, 0, .012, .026, .052, .111, .18, .292, .43,
    .619, .858, 1.145, 1.514, 1.952, 2.468, 3.092, 3.8, 4.62, 5.568,
    6.645, 7.834, 9.223, 10.763, 12.559, 14.45, 16.488, 18.796, 21.312, 24.089,
    27.184, 30.364, 33.737, 37.416, 41.695, 46.332, 50.775, 54.738, 58.158, 61.467,
    64.587, 67.462, 70.133, 72.502, 74.574, 76.672, 78.561, 80.136, 81.591, 82.816,
    83.972, 84.976, 85.851, 86.619, 87.259, 87.835, 88.305, 88.698, 89.03, 89.284,
    89.494, 89.663, 89.775, 89.872, 89.91, 89.973, 89.988, 89.996, 90, 90, 90,
  ];

  function getMotion(time) {
    const cycle = ((time % DURATION) + DURATION) % DURATION;
    const frame = (cycle % (DURATION / 2)) / 20;
    const index = Math.floor(frame);
    const angle = (TURN[index] + (TURN[index + 1] - TURN[index]) * (frame - index)) * Math.PI / 180;
    return { angle, secondHalf: cycle >= DURATION / 2 };
  }


  const work = {
    size: [800, 600],
    frame: getMotion,
    scene: `
  uniform float angle;
  uniform bool secondHalf;
  float square(vec2 p) {
    vec2 q = abs(p) - 80.0;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  }

  float scene(vec2 p) {
    vec2 grid = rotate(p, secondHalf ? angle : -angle);
    float shape = 1000.0;
    for (int i = 0; i < 4; i++) {
      float a = -PI * 0.75 + float(i) * PI * 0.5;
      vec2 center = vec2(cos(a), sin(a)) * 113.137085;
      vec2 local = grid - center;
      float disk = length(local) - 70.0;
      if (!secondHalf) {
        vec2 mouth = rotate(local, -(a + PI - 4.0 * angle));
        float wedge = (abs(mouth.y) - mouth.x) * 0.70710678;
        disk = max(disk, -wedge);
      }
      shape = min(shape, disk);
    }
    if (secondHalf) shape = max(shape, -square(rotate(p, -angle)));
    return shape;
  }

  `,
  };
  document.querySelectorAll('[data-purpose="01"]').forEach(canvas => Purpose.mount(canvas, work));
})();
