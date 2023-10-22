fragment: "#version 300 es  precision highp float;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform float colorSize;
uniform float colorSpacing;
uniform float colorRotation;
uniform float colorSpread;
uniform float displacement;
uniform float zoom;
uniform float spacing;
uniform float seed;
uniform vec2 viewportSize;
uniform vec2 colorOffset;
uniform vec2 transformPosition;
uniform float noiseSize;
uniform float noiseIntensity;
in vec2 vPosition;
out vec4 fragColor;    ".concat(Ut(), "    float hash(vec2 p)  {    p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));    return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));  }    float computeNoise(in vec2 p)  {    vec2 i = floor(p);    vec2 f = fract(p);      vec2 u = f * f * (3.0 - 2.0 * f);      return mix(mix(hash(i + vec2(0.0, 0.0)),        hash(i + vec2(1.0, 0.0)), u.x),      mix(hash(i + vec2(0.0, 1.0)),        hash(i + vec2(1.0, 1.0)), u.x), u.y);  }    vec2 rotate(vec2 v, float a) {    float s = sin(a);    float c = cos(a);    mat2 m = mat2(c, -s, s, c);    return m * v;  }


void main() {
  vec2 position = vPosition;
  position.x *= min(1., viewportSize.x / viewportSize.y);
  position.y *= min(1., viewportSize.y / viewportSize.x);
  position /= zoom;
  position += transformPosition;

  vec2 noiseLocalPosition = position * .5 + .5;
  vec3 displacementNoise = gradientDerivativesNoise3D(vec3(noiseLocalPosition, seed)).xyz;

  float noise = computeNoise(vPosition * viewportSize / noiseSize);
  position += displacementNoise.xz * displacement;

  vec2 offsetedPosition = position;
  offsetedPosition -= colorOffset;
  offsetedPosition = mod(offsetedPosition - spacing, vec2(spacing * 2.)) - spacing;
  offsetedPosition = rotate(offsetedPosition, -colorRotation);
  offsetedPosition /= vec2(colorSize, colorSize);
  offsetedPosition *= vec2(1. / colorSpread, 1.);

  vec3 color = vec3(0.);
  color = mix(color1, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., colorSpacing * 1.5))));
  color = mix(color2, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., colorSpacing * .5))));
  color = mix(color3, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., -colorSpacing * .5))));
  color = mix(color4, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., -colorSpacing * 1.5))));
  color += noise * noiseIntensity;
  color = clamp(color, 0., 1.);
  fragColor = vec4(color, 1.);
}