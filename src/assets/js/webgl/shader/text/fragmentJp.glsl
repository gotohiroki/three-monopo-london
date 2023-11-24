uniform vec2 uPlaneRes;
uniform vec2 uImageRes;
uniform sampler2D tMap;
uniform float uTime;
uniform vec2 uMouse2D;
uniform vec2 uCanvasRes;
uniform float uLenseSize;

varying vec2 vUv;

#define S(a,t) smoothstep(a*0.975, a, t);

vec3 hueShift(vec3 color, float hue) {
  const vec3 k = vec3(0.57735, 0.57735, 0.57735);
  float cosAngle = cos(hue);
  return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {
  vec2 mouse2D = uMouse2D;
  mouse2D.x = (mouse2D.x + 1.0) * 0.5;
  mouse2D.y = 1.0 - (mouse2D.y - 1.0) * -0.5;

  vec2 aspect = vec2(uCanvasRes.x / uCanvasRes.y, 1.0);

  float radius = 0.5 * uLenseSize / uPlaneRes.y;
  float dist = distance(mouse2D * aspect, vUv * aspect);

  float refractionOffset = 0.036;
  float refractionPower = 0.007;

  float d1 = S(radius, dist);
  float d2 = S(radius * (1.0 - refractionOffset), dist) - d1;

  vec2 sub = mouse2D - vUv;
  sub *= aspect;

  vec2 uv = vUv - sub * pow(dist * 0.7, 0.7) + d2 * refractionPower;
  vec4 tex_r = texture2D(tMap, uv - sub * 0.01);
  vec4 tex_g = texture2D(tMap, uv + sub * 0.02);
  vec4 tex_b = texture2D(tMap, uv + sub * 0.02);
  float a = max(max(tex_r.a, tex_g.a), tex_b.a);
  vec4 tex = vec4(tex_r.r, tex_g.g, tex_b.b, a);

  tex.a = mix(tex.a, 0.0, d1);

  tex.rgb = hueShift(tex.rgb, 3.292);

  gl_FragColor = tex;
}