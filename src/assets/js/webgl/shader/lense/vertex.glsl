varying vec2 vUv;

uniform vec2 uPlaneRes;
uniform vec2 uCanvasRes;
uniform vec2 uMouse2D;

void main() {
  vUv = uv;
  vec3 pos = position;

  // マウスの2D座標に応じて、頂点の位置を変更します。これにより、マウスの位置に応じて頂点が移動します。
  pos.x += uMouse2D.x * uCanvasRes.x / uPlaneRes.x * 0.5;
  pos.y += uMouse2D.y * uCanvasRes.y / uPlaneRes.y * 0.5;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}