import { FrontSide, Mesh, ShaderMaterial, Vector2 } from 'three';
import { InteractiveObject } from './InteractiveObject';
import vertexShaderDefault from '../shader/mediaPlane/vertex.glsl';
import fragmentShaderDefault from '../shader/mediaPlane/fragment.glsl';

export class MediaPlane extends InteractiveObject {
  constructor({ fragmentShader, geometry, vertexShader }) {
    super();

    this.mouse2D = new Vector2(0, 0);
    this.rendererBounds = { width: 1, height: 1 };
    this.loadedAsset = null;

    this.fragmentShader = fragmentShader || fragmentShaderDefault;
    this.vertexShader = vertexShader || vertexShaderDefault;
    this.geometry = geometry;
    this.material = new ShaderMaterial({
      side: FrontSide,
      transparent: true,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        tMap: { value: null },
        uCanvasRes: { value: new Vector2(0, 0) },
        uPlaneRes: { value: new Vector2(1.0, 1.0) },
        uImageRes: { value: new Vector2(1.0, 1.0) },
        uMouse2D: { value: new Vector2(1.0, 1.0) },
        uLenseSize: { value: 1 },
      }
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.add(this.mesh);
  }

  setMouse2D(mouse) {
    this.mesh.material.uniforms.uMouse2D.value = new Vector2(mouse.current.x, mouse.current.y);
  }

  setSize(bounds) {
    this.mesh.scale.x = bounds.width;
    this.mesh.scale.y = bounds.height;
    this.mesh.material.uniforms.uPlaneRes.value = new Vector2(this.mesh.scale.x, this.mesh.scale.y);
  }

  setRendererBounds(bounds) {
    this.rendererBounds = bounds;
    this.mesh.material.uniforms.uCanvasRes.value = new Vector2(this.rendererBounds.width, this.rendererBounds.height);
  }

  setAsset(asset) {
    this.loadedAsset = asset;
    this.mesh.material.uniforms.tMap.value = this.loadedAsset.asset;
    this.mesh.material.uniforms.uImageRes.value = new Vector2(this.loadedAsset.naturalWidth, this.loadedAsset.naturalHeight);
  }

  update(updateInfo) {
    super.update(updateInfo);
    this.mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
  }

  destroy() {
    super.destroy();
    this.material.dispose();
    this.remove(this.mesh);
  }
}