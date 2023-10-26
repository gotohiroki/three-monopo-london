uniform float uTime;
varying vec2 vUv;
varying vec2 vPosition;

float PI = 3.1415926535897932384626433832795;

void main() {
  vUv = uv;

  vec3 pos = position;
  vec2 vPosition = pos.xy;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}