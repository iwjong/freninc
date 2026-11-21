// For animation previews only: requires three iframes inside .purpose-images, not the JPG homepage.
(() => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const frames = [...document.querySelectorAll('.purpose-images iframe')];
  assert(frames.length === 3, 'Expected three purpose animations');
  const colors = gl => {
    const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const result = new Set();
    for (let i = 0; i < pixels.length; i += 4) result.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`);
    assert(gl.getError() === gl.NO_ERROR, 'WebGL readback failed');
    return result;
  };
  for (const frame of frames) {
    const doc = frame.contentDocument;
    const canvas = doc.querySelector('canvas');
    assert(canvas && !doc.querySelector('.purpose-status').textContent, `${frame.src}: failed to load`);
    const gl = canvas.getContext('webgl');
    assert(gl && !gl.isEnabled(gl.DITHER), 'Hardware dithering must not alter the palette');
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    assert(colors(gl).size >= 7, `${frame.src}: missing rendered tones`);
  }
  const doc = frames[0].contentDocument;
  const host = doc.createElement('div');
  host.style.cssText = 'position:fixed;inset:0;width:320px;height:240px;visibility:hidden';
  host.innerHTML = '<canvas></canvas><p class=purpose-status></p>';
  doc.body.append(host);
  const canvas = host.querySelector('canvas');
  const render = distance => {
    const dispose = frames[0].contentWindow.Purpose.mount(canvas, {
      size: [800, 600], frame: () => ({}), scene: `float scene(vec2 p) { return ${distance}; }`,
    });
    try {
      const gl = canvas.getContext('webgl');
      const band = y => {
        const pixels = new Uint8Array(gl.drawingBufferWidth * 4);
        gl.readPixels(0, y, gl.drawingBufferWidth, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        let sum = 0;
        for (let i = 1; i < pixels.length; i += 4) sum += pixels[i];
        return sum / gl.drawingBufferWidth;
      };
      return { colors: colors(gl), top: band(gl.drawingBufferHeight - 1), bottom: band(0) };
    } finally { dispose(); }
  };
  try {
    const object = render('-10000.0');
    const ink = object.colors;
    assert(ink.size === 7, `Expected exactly 7 object tones (steps 4–10), got ${ink.size}`);
    assert(ink.has('0,0,0') && ink.has('177,170,159'), 'Missing darkest or lightest allowed tone');
    for (const color of ink) {
      const [r, g, b] = color.split(',').map(Number);
      assert(r >= g && g >= b, `Cool tone: ${color}`);
      assert(r <= 177, `Object highlight is too light: ${color}`);
    }
    const paper = render('10000.0');
    assert(paper.colors.size > 100, 'Expected a finely dithered paper gradient');
    assert(paper.top - paper.bottom > 150, 'Paper must fade from light to dark');
    assert(object.bottom - object.top > 130, 'Objects must fade in the opposite direction');
    for (const color of paper.colors) {
      const [r, g, b] = color.split(',').map(Number);
      assert(r >= g && g >= b, `Cool paper tone: ${color}`);
    }
    return { animations: frames.length, objectTones: ink.size, paperTones: paper.colors.size,
      paperGradient: [paper.top, paper.bottom], objectGradient: [object.top, object.bottom] };
  } finally { host.remove(); }
})();
