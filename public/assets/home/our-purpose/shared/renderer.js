Purpose.mount = (canvas, work) => {
  const status = canvas.parentElement.querySelector('.purpose-status');
  if (!work) {
    canvas.hidden = true;
    status.textContent = '애니메이션 준비 중입니다.';
    return;
  }

  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
  let program, buffer, uniforms;
  let width = 0, height = 0, elapsed = 0, previous = null, frameId = null;
  let visible = false, failed = false;

  function fail(error) {
    failed = true;
    cancelAnimationFrame(frameId);
    console.error(error);
    status.textContent = '애니메이션을 표시할 수 없습니다. 브라우저의 하드웨어 가속 설정을 확인해 주세요.';
  }

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function init() {
    // The shader owns dithering so the framebuffer preserves its palette.
    gl.disable(gl.DITHER);
    const shaders = [];
    try {
      shaders.push(compile(gl.VERTEX_SHADER, Purpose.vertex));
      shaders.push(compile(gl.FRAGMENT_SHADER, Purpose.fragment(work.scene)));
      program = gl.createProgram();
      shaders.forEach(shader => gl.attachShader(program, shader));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(
        ['resolution', 'viewport', 'designSize', ...Object.keys(work.frame(0))]
          .map(name => [name, gl.getUniformLocation(program, name)])
      );
      status.textContent = '';
      failed = false;
    } finally {
      shaders.forEach(shader => gl.deleteShader(shader));
    }
  }

  function draw() {
    if (failed || gl.isContextLost() || !width || !height) return;
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.viewport, width, height);
    gl.uniform2f(uniforms.designSize, ...work.size);
    for (const [name, value] of Object.entries(work.frame(elapsed))) {
      if (Array.isArray(value)) gl.uniform4fv(uniforms[name], value);
      else if (typeof value === 'boolean') gl.uniform1i(uniforms[name], value ? 1 : 0);
      else gl.uniform1f(uniforms[name], value);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function tick(time) {
    if (previous !== null) elapsed += time - previous;
    previous = time;
    draw();
    frameId = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    cancelAnimationFrame(frameId);
    previous = null;
    if (visible && width && height && !document.hidden && !failed && !gl.isContextLost()) {
      frameId = requestAnimationFrame(tick);
    }
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const density = Math.min(window.devicePixelRatio || 1, 2, 1600 / Math.max(width, height, 1));
    const w = Math.max(1, Math.round(width * density));
    const h = Math.max(1, Math.round(height * density));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    draw();
    syncPlayback();
  }

  function lost(event) {
    event.preventDefault();
    cancelAnimationFrame(frameId);
  }

  function restored() {
    try { init(); resize(); } catch (error) { fail(error); }
  }

  if (!gl) { fail(new Error('WebGL is unavailable.')); return; }
  try { init(); } catch (error) {
    fail(error);
    if (program) gl.deleteProgram(program);
    return;
  }

  const sizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  });
  sizeObserver.observe(canvas);
  visibilityObserver.observe(canvas);
  document.addEventListener('visibilitychange', syncPlayback);
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', restored);
  resize();

  return () => {
    cancelAnimationFrame(frameId);
    sizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', syncPlayback);
    canvas.removeEventListener('webglcontextlost', lost);
    canvas.removeEventListener('webglcontextrestored', restored);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
};
