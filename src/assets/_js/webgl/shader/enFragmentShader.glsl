uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uAspect;
uniform bool uEnable;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  vec2 aspect = vec2(uAspect, 1.0);
  float radius = 0.19;
  float dist = distance(uMouse * aspect, vUv * aspect);
  float d = 1.0 - smoothstep(radius, radius + 0.005, dist);

  if(uEnable) {
    tex.a = mix(tex.a, 0.0, d);
  }

  gl_FragColor = tex;
}