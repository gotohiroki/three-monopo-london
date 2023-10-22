uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uBlack;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;

#include './_inc/classic2d.glsl';

float random(vec2 p) {
  vec2 k1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );
  return fract(
    cos(dot(p, k1)) * 12345.6789
  );
}

void main() {
  vec2 seed = vUv * 1.5 * ( uMouse + 0.3 * (length(uMouse) + 0.5));
  float n = cnoise2(seed) + length(uMouse) * 0.9;

  float ml = pow(length(uMouse), 2.5) * 0.15;

  float n1 = smoothstep( 0.0, 0.0 + 0.2, n );
  vec3 color = mix( uBlack, uColor1, n1 );

  float n2 = smoothstep(0.1 + ml, 0.1 + ml + 0.2, n);
  color = mix(color, uColor2, n2);

  float n3 = smoothstep(0.2 + ml, 0.2 + ml + 0.2, n);
  color = mix(color, uColor3, n3);

  float n4 = smoothstep(0.3 + ml, 0.3 + ml + 0.2, n);
  color = mix(color, uBlack, n4);

  vec2 uvrandom = vUv;
  uvrandom.y *= random( vec2( uvrandom.y, 0.4 ) );
  color.rgb += random(uvrandom) * 0.05;

  gl_FragColor = vec4(color, 1.0);
}