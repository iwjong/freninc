window.Purpose = window.Purpose || {};
Purpose.vertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;
Purpose.fragment = scene => `
precision highp float;
uniform vec2 resolution;
uniform vec2 viewport;
uniform vec2 designSize;
const float PI = 3.14159265359;
vec2 rotate(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c*p.x - s*p.y, s*p.x + c*p.y);
}
${scene}
float grain(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
float paperNoise(vec2 p) {
  vec2 cell = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(grain(cell), grain(cell + vec2(1.0, 0.0)), f.x),
             mix(grain(cell + vec2(0.0, 1.0)), grain(cell + 1.0), f.x), f.y);
}
vec3 warmGray(float tone) {
  return vec3(tone) + vec3(0.03, 0.0, -0.05) * (4.0 * tone * (1.0 - tone));
}

void main() {
  float scale = 1.15 * min(viewport.x / designSize.x, viewport.y / designSize.y);
  vec2 screen = (gl_FragCoord.xy / resolution - 0.5) * viewport / scale;
  screen.y = -screen.y;
  float edge = 0.5 * viewport.x / resolution.x / scale;
  float coverage = 1.0 - smoothstep(-edge, edge, scene(screen));
  // All texture is spatial: the print stays still while the silhouettes move.
  vec2 pixel = gl_FragCoord.xy;
  vec2 uv = vec2(gl_FragCoord.x / resolution.x, 1.0 - gl_FragCoord.y / resolution.y);
  vec2 printPosition = uv * viewport;
  float fibers = paperNoise(printPosition / vec2(2.3, 3.1)) - 0.5;
  float mottling = paperNoise(printPosition / 42.0) - 0.5;
  float fine = grain(pixel) - grain(pixel + vec2(1.0, 0.0));
  float texture = fine * 0.045 + fibers * 0.012 + mottling * 0.018;

  // Opposing gradients reveal the shapes through ink density, like a printed poster.
  float paperFade = smoothstep(0.12, 0.88, uv.y + (uv.x - 0.5) * 0.08);
  float paperTone = clamp(mix(0.985, 0.24, paperFade) + texture, 0.0, 1.0);
  vec3 paper = warmGray(floor(paperTone * 255.0 + grain(pixel + 43.1)) / 255.0);
  float inkFade = smoothstep(-150.0, 150.0, screen.y + screen.x * 0.12);
  float tone = clamp(mix(0.035, 2.0 / 3.0, inkFade) + texture, 0.0, 2.0 / 3.0);
  // Use steps 4–10 of the white-to-black scale so highlights stay visible on paper.
  tone = floor(tone * 9.0 + grain(pixel + 71.7)) / 9.0;
  vec3 ink = warmGray(tone);
  gl_FragColor = vec4(mix(paper, ink, coverage), 1.0);
}
`;
