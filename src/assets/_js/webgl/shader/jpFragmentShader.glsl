uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uAspect;
uniform bool uEnable;

varying vec2 vUv;

void main() {
  vec2 aspect = vec2(uAspect, 1.0);
  float radius = 0.19;
  float dist = distance(uMouse * aspect, vUv * aspect);
  float d = smoothstep(radius, radius + 0.005, dist);

  vec2 sub = uMouse - vUv;
  sub *= aspect;

  vec2 uv = vUv - sub * pow(dist * 0.7, 0.7);
  vec4 tex_r = texture2D(uTexture, uv);
  vec4 tex_g = texture2D(uTexture, uv + sub * 0.03);
  vec4 tex_b = texture2D(uTexture, uv + sub * 0.01);
  float a = max(max(tex_r.a, tex_g.a), tex_b.a);
  vec4 tex = vec4(tex_r.r, tex_g.g, tex_b.b, a);

  tex.a = mix(tex.a, 0.0, d);

  if(!uEnable) {
    tex.a = 0.0;
  }

  gl_FragColor = tex;
}