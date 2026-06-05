const DEFAULT_AREAS = [
  { x: 0.2, y: 0.26, radiusX: 210, radiusY: 170, angle: 15, bias: 18 },
  { x: 0.58, y: 0.32, radiusX: 260, radiusY: 190, angle: 190, bias: 12 },
  { x: 0.76, y: 0.5, radiusX: 230, radiusY: 230, angle: 285, bias: 8 },
  { x: 0.36, y: 0.62, radiusX: 280, radiusY: 180, angle: 35, bias: 15 },
  { x: 0.62, y: 0.77, radiusX: 240, radiusY: 160, angle: 225, bias: 20 },
];

const DEFAULT_EFFECT = {
  spread: 60,
  grain: 1.5,
  samples: 6,
  blur: 0,
  motion: 1,
};

function ensureStyles() {
  if (document.getElementById("grunge-effect-styles")) return;

  const style = document.createElement("style");
  style.id = "grunge-effect-styles";
  style.textContent = `
    :where(.grunge-canvas) {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;
  document.head.append(style);
}

const VS = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FS = `#version 300 es
precision highp float;

uniform sampler2D uSource;
uniform vec2 uResolution;
uniform int uStampCount;
uniform vec4 uStampPosRad[64];
uniform vec4 uStampParams[64];
uniform vec4 uStampExtra[64];

out vec4 fragColor;

const vec2 DISC[9] = vec2[9](
  vec2( 0.0, 0.0),
  vec2( 1.0, 0.0), vec2(-1.0,  0.0), vec2(0.0,  1.0), vec2( 0.0, -1.0),
  vec2( 0.707, 0.707), vec2(-0.707, 0.707),
  vec2( 0.707,-0.707), vec2(-0.707,-0.707)
);
const float DISC_W[9] = float[9](1.0, 0.7, 0.7, 0.7, 0.7, 0.5, 0.5, 0.5, 0.5);

vec3 h3(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yzx + 33.33);
  return p;
}

vec2 hash22(vec2 p) {
  vec3 o = h3(vec3(p.xyx));
  return fract(vec2((o.x + o.y) * o.z, (o.x + o.z) * o.y)) * 2.0 - 1.0;
}

vec2 valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash22(i), hash22(i + vec2(1, 0)), u.x),
    mix(hash22(i + vec2(0, 1)), hash22(i + vec2(1, 1)), u.x),
    u.y
  );
}

void main() {
  vec2 pixel = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 uv = pixel / uResolution;

  vec2 totalDisp = vec2(0.0);
  float maxStr = 0.0;
  float bestSamples = 6.0;
  float bestBlur = 0.0;
  float bestMotion = 1.0;

  for (int i = 0; i < 64; i++) {
    if (i >= uStampCount) break;
    vec2 center = uStampPosRad[i].xy;
    vec2 radius = uStampPosRad[i].zw;
    float spread = uStampParams[i].x;
    float grain  = uStampParams[i].y;
    float angle  = uStampParams[i].z;
    float bias   = uStampParams[i].w;

    vec2 norm = (pixel - center) / radius;
    float eDist = dot(norm, norm);
    if (eDist >= 1.0) continue;

    float str = pow(1.0 - sqrt(eDist), 2.0);

    float biasAmt = bias / 100.0;
    float biasRad = angle * 3.14159265 / 180.0;
    vec2 biasDir = vec2(cos(biasRad), sin(biasRad)) * biasAmt;

    vec2 nc = pixel / grain;
    vec2 nA = valueNoise(nc);
    vec2 nB = valueNoise(nc + 73.156);

    totalDisp += (nA * 0.7 + nB * 0.3 + biasDir) * spread * str;
    if (str > maxStr) {
      maxStr = str;
      bestSamples = uStampExtra[i].x;
      bestBlur = uStampExtra[i].y;
      bestMotion = uStampExtra[i].z;
    }
  }

  vec4 color;
  if (maxStr > 0.0) {
    color = vec4(0.0);
    float tw = 0.0;
    int samples = int(bestSamples);
    float invSm1 = (samples > 1 ? 1.0 / float(samples - 1) : 1.0) * bestMotion;
    float blurR = bestBlur * maxStr;
    int blurTaps = blurR > 0.5 ? 9 : 1;

    for (int s = 0; s < 12; s++) {
      if (s >= samples) break;
      float t = float(s) * invSm1;
      vec2 sp = pixel + totalDisp * t;
      float w = 1.0 - t * 0.6;

      for (int b = 0; b < 9; b++) {
        if (b >= blurTaps) break;
        vec2 bsp = sp + DISC[b] * blurR;
        vec2 bUV = clamp(bsp / uResolution, vec2(0), vec2(1));
        float bw = w * DISC_W[b];
        color += texture(uSource, bUV) * bw;
        tw += bw;
      }
    }
    color /= tw;
  } else {
    color = texture(uSource, uv);
  }

  fragColor = color;
}
`;

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Grunge shader compile error:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createRenderer() {
  const offscreen = new OffscreenCanvas(300, 150);
  const gl = offscreen.getContext("webgl2", { preserveDrawingBuffer: true });
  if (!gl) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Grunge program link error:", gl.getProgramInfoLog(prog));
  }

  const loc = {};
  for (const name of [
    "uSource",
    "uResolution",
    "uStampCount",
    "uStampPosRad",
    "uStampParams",
    "uStampExtra",
  ]) {
    loc[name] = gl.getUniformLocation(prog, name);
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return { offscreen, gl, prog, loc, vao, tex };
}

function wrapElement(element) {
  if (element.closest("canvas.grunge-canvas")) return element.closest("canvas");

  const targetStyle = getComputedStyle(element);
  const grungeWidth = targetStyle.getPropertyValue("--grunge-width").trim();
  const grungeHeight = targetStyle.getPropertyValue("--grunge-height").trim();
  const canvas = document.createElement("canvas");
  canvas.className = "grunge-canvas";
  canvas.setAttribute("layoutsubtree", "");
  if (grungeWidth) canvas.style.width = grungeWidth;
  if (grungeHeight) canvas.style.height = grungeHeight;
  element.before(canvas);
  canvas.append(element);
  return canvas;
}

export function applyGrunge(element, options = {}) {
  ensureStyles();

  const canvas = wrapElement(element);
  if (canvas.__grungeEffect) return canvas.__grungeEffect;

  const ctx = canvas.getContext("2d");
  const renderer = createRenderer();
  if (!ctx || !renderer) return null;

  const areas = options.areas ?? DEFAULT_AREAS;
  const defaults = { ...DEFAULT_EFFECT, ...options.effect };
  const posRadBuf = new Float32Array(256);
  const paramsBuf = new Float32Array(256);
  const extraBuf = new Float32Array(256);

  function effectEntry(area, w, h) {
    const dpr = devicePixelRatio;
    const effect = { ...defaults, ...area };
    return {
      posRad: [
        effect.x * w,
        effect.y * h,
        effect.radiusX * dpr,
        effect.radiusY * dpr,
      ],
      params: [effect.spread * dpr, effect.grain, effect.angle, effect.bias],
      extra: [effect.samples, effect.blur * dpr, effect.motion, 0],
    };
  }

  function renderGL(w, h) {
    const { offscreen, gl, prog, loc, vao, tex } = renderer;
    if (offscreen.width !== w || offscreen.height !== h) {
      offscreen.width = w;
      offscreen.height = h;
    }

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

    gl.viewport(0, 0, w, h);
    gl.useProgram(prog);
    gl.bindVertexArray(vao);

    gl.uniform1i(loc.uSource, 0);
    gl.uniform2f(loc.uResolution, w, h);

    const count = Math.min(areas.length, 64);
    for (let i = 0; i < count; i++) {
      const effect = effectEntry(areas[i], w, h);
      posRadBuf.set(effect.posRad, i * 4);
      paramsBuf.set(effect.params, i * 4);
      extraBuf.set(effect.extra, i * 4);
    }

    gl.uniform4fv(loc.uStampPosRad, posRadBuf);
    gl.uniform4fv(loc.uStampParams, paramsBuf);
    gl.uniform4fv(loc.uStampExtra, extraBuf);
    gl.uniform1i(loc.uStampCount, count);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function paint() {
    const dpr = devicePixelRatio;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (!w || !h) return;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.reset();
    ctx.clearRect(0, 0, w, h);

    try {
      const transform = ctx.drawElementImage(element, 0, 0, w, h);
      element.style.transform = transform.toString();
    } catch {
      return;
    }

    renderGL(w, h);
    ctx.drawImage(renderer.offscreen, 0, 0);
  }

  function requestPaint() {
    canvas.requestPaint();
  }

  canvas.onpaint = paint;
  requestAnimationFrame(requestPaint);
  window.addEventListener("load", requestPaint);
  document.fonts?.ready.then(requestPaint);
  element.closest("article")?.addEventListener("slideenter", () => {
    requestAnimationFrame(requestPaint);
  });

  canvas.__grungeEffect = { canvas, element, paint: requestPaint };
  return canvas.__grungeEffect;
}

export function initGrunge(selector = ".grunge", options = {}) {
  return [...document.querySelectorAll(selector)].map((element) =>
    applyGrunge(element, options),
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initGrunge());
} else {
  initGrunge();
}
