import { PlaneGeometry } from 'three';
import { InteractiveScene } from './InteractiveScene';
import { Background } from '../components/background';
import { Lense } from '../components/Lense';
import vertexLense from '../shader/lense/vertex.glsl';
import fragmentLense from '../shader/lense/fragment.glsl';
import { TextPlane } from '../components/TextPlane';
import fragmentTextJp  from '../shader/text/fragmentJp.glsl';
import fragmentTextEn from '../shader/text/fragmentEn.glsl';

export class ExperienceScene extends InteractiveScene {
  constructor({ gui, controls, camera, mouseMove }) {
    super({ camera, mouseMove, gui });
    this.loadedAssets = null;
    this.planeGeometry = new PlaneGeometry(1, 1, 32, 32);
    this.controls = controls;

    this.textPlaneEn = new TextPlane({
      geometry: this.planeGeometry,
      gui,
      fragmentShader: fragmentTextEn,
      text: ['We are a brand', 'of collective', 'creativity'],
      // offsetsArray: [-0.18, 0.28, -0.08, 0, 0, 0],
      offsetsArray: [-0.07, 0.27, -0.08, 0, 0, 0],
    });
    this.add(this.textPlaneEn);

    this.textPlaneJp = new TextPlane({
      geometry: this.planeGeometry,
      gui,
      fragmentShader: fragmentTextJp,
      text: ['私たちは', '創造性を結集した', 'ブランド'],
      // offsetsArray: [-0.28, 0.255, 0.05, 0, -0.05, 0.12],
      offsetsArray: [-0.17, 0.245, 0.05, 0, -0.05, 0.12],
    });
    this.add(this.textPlaneJp);

    this.lense = new Lense({
      gui,
      geometry: this.planeGeometry,
      fragmentShader: fragmentLense,
      vertexShader: vertexLense,
    });
    this.add(this.lense);

    this.background = new Background({ gui });
    this.add(this.background);
  }

  animateIn() {}

  update(updateInfo) {
    super.update(updateInfo);

    this.background.setMouse2D(this.mouse2D);
    this.background.update(updateInfo);

    this.lense.setMouse2D(this.mouse2D);
    this.lense.update(updateInfo);

    this.textPlaneEn.setMouse2D(this.mouse2D);
    this.textPlaneEn.update(updateInfo);

    this.textPlaneJp.setMouse2D(this.mouse2D);
    this.textPlaneJp.update(updateInfo);
  }

  setLoadedAssets(assets) {
    this.loadedAssets = assets;
    this.lense.setAsset(this.loadedAssets['lense']);
  }

  setRendererBounds(bounds) {
    super.setRendererBounds(bounds);
    
    this.background.setSize({
      width: this.rendererBounds.width * 1.001,
      height: this.rendererBounds.height * 1.001
    });

    this.lense.setRendererBounds(bounds);
    
    this.textPlaneEn.setRendererBounds(bounds);
    this.textPlaneEn.setSize(bounds);
    
    this.textPlaneJp.setRendererBounds(bounds);
    this.textPlaneJp.setSize(bounds);
  }

  destroy() {
    super.destroy();

    this.background.destroy();
    this.remove(this.background);
    
    this.lense.destroy();
    this.remove(this.lense);

    this.textPlaneEn.destroy();
    this.remove(this.textPlaneEn);

    this.textPlaneJp.destroy();
    this.remove(this.textPlaneJp);

    this.planeGeometry.dispose();
  }

}