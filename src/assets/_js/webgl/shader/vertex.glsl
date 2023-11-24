varying vec2 vUv;
varying vec2 vPosition;

float PI = 3.1415926535897932384626433832795;

void main() {
  vUv = uv;

  vec2 vPosition = position.xy;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}