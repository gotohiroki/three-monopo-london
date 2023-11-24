import { Color, FrontSide, Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
import { breakpoints } from '../utils/media';
import vertexShader from '../shader/background/vertex.glsl';
import fragmentShader from '../shader/background/fragment.glsl';
import { InteractiveObject } from './InteractiveObject';

export class Background extends InteractiveObject {
  constructor({ gui }) {
    super();
    this.mesh = null;
    this.geometry = null;
    this.material = null;
    this.background = {
      // color1: new Color( 0xa0d5d9 ),
      // color2: new Color( 0x37a0a0 ),
      // color3: new Color( 0x0813af ),
      // color1: new Color( 0x5986b1 ),
      color1: [163 / 255, 189 / 255, 230 / 255],
      // color1: new Color( "rgb(89, 134, 177)" ),
      color2: [54 / 255, 211 / 255, 211 / 255],
      // color2: new Color( "rgb(54, 211, 211)" ),
      color3: [0 / 255, 1 / 255, 109 / 255],
      // color3: new Color( "rgb(0, 1, 109)" ),
      colorAccent: new Color(0.0, 0.0, 0.0),
      uLinesBlur: 0.25,
      uNoise: 0.075,
      uOffsetX: 0.34,
      uOffsetY: 0.0,
      uLinesAmount: 5.0,
    };
    // this.mouse2D = new Vector2(0.0, 0.0);
    this.mouse2D = [0, 0];
    this.planeBounds = { width: 100, height: 100 };
    this.gui = gui;

    this.setGui();
    this.setBackgroundObject();
  }

  setBackgroundObject() {
    this.geometry = new PlaneGeometry(1, 1, 32, 32);
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: FrontSide,
      wireframe: false,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: this.background.color1 },
        uColor2: { value: this.background.color2 },
        uColor3: { value: this.background.color3 },
        uColorAccent: { value: this.background.colorAccent },
        uLinesBlur: { value: this.background.uLinesBlur },
        uNoise: { value: this.background.uNoise },
        uOffsetX: { value: this.background.uOffsetX },
        uOffsetY: { value: this.background.uOffsetY },
        uLinesAmount: { value: this._setLinesAmount(this.background.uLinesAmount) },
        uPlaneRes: { value: new Vector2(1.0, 1.0) },
        uMouse2D: { value: new Vector2(1.0, 1.0) },
        uBackgroundScale: { value: 1.0 },
      }
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.renderOrder = -1;
    this.add(this.mesh);
  }

  setGui() {
    const background = this.gui.addFolder('Background');
    background.close();
    background.addColor(this.background, 'color1', 1).name('Color 1');
    background.addColor(this.background, 'color2', 1).name('Color 2');
    background.addColor(this.background, 'color3', 1).name('Color 3');
    background.add(this.background, 'uLinesBlur', 0.01, 1, 0.01).name('LinesBlur').onChange((value) => {
      if(!this.mesh) return;
      this.mesh.material.uniforms.uLinesBlur.value = value;
    });
    background.add(this.background, 'uNoise', 0.01, 1, 0.01).name('Noise').onChange((value) => {
      if(!this.mesh) return;
      this.mesh.material.uniforms.uNoise.value = value;
    });
    background.add(this.background, 'uOffsetX', -5, 5, 0.01).name('Offset X').onChange((value) => {
      if(!this.mesh) return;
      this.mesh.material.uniforms.uOffsetX.value = value;
    });
    background.add(this.background, 'uOffsetY', -5, 5, 0.01).name('Offset Y').onChange((value) => {
      if(!this.mesh) return;
      this.mesh.material.uniforms.uOffsetY.value = value;
    });
    background.add(this.background, 'uLinesAmount', 0, 15, 0.01).name('Lines amount').onChange((value) => {
      if(!this.mesh) return;
      this._setLinesAmount(value);
    });
  }

  _setLinesAmount(value) {
    if(this.mesh) {
      if(this.planeBounds.width >= breakpoints.tablet) {
        this.mesh.material.uniforms.uLinesAmount.value = value;
      } else {
        this.mesh.material.uniforms.uLinesAmount.value = value * 3.8;
      }
    }
  }


  setSize(bounds) {
    this.planeBounds = bounds;

    if(this.mesh) {
      this._setLinesAmount(this.background.uLinesAmount);
      this.mesh.scale.x = this.planeBounds.width;
      this.mesh.scale.y = this.planeBounds.height;

      this.mesh.material.uniforms.uPlaneRes.value = new Vector2(this.mesh.scale.x, this.mesh.scale.y);
      if(this.planeBounds.width < breakpoints.tablet) {
        this.mesh.material.uniforms.uBackgroundScale.value = this.planeBounds.width * 0.001 * 1.45;
      } else {
        this.mesh.material.uniforms.uBackgroundScale.value = 1.0;
      }

    }
  }


  setMouse2D(mouse) {
    if(this.mesh) {
      this.mesh.material.uniforms.uMouse2D.value = new Vector2(mouse.current.x, mouse.current.y);
    }
  }

  update(updateInfo) {
    super.update(updateInfo);
    if(this.mesh) {
      this.mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
    }
  }

  destroy() {
    super.destroy();
    this.geometry?.dispose();
    this.material?.dispose();
    if(this.mesh) {
      this.remove(this.mesh);
    }
  }

}