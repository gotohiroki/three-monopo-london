import { Raycaster, Scene } from 'three';
import { lerp } from '../utils/lerp';

export class InteractiveScene extends Scene {
  constructor({ mouseMove, camera, gui }) {
    super();
    this.raycaster = new Raycaster();
    this.rendererBounds = { width: 100, height: 100 };
    this.pixelRatio = 1;
    this.mouse2D = {
      current: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
    };
    this.mouseStrength = {
      current: 0,
      target: 0
    };
    this.hoveredObject = null;
    this.canHoverObject = true;
    this.ease = 0.07 * 1.2;

    this.onMouseMove = (e) => {
      this.mouseStrength.target = e.target.strength;
      const mouseX = e.target.mouse.x;
      const mouseY = e.target.mouse.y;
      this.mouse2D.target.x = (mouseX / this.rendererBounds.width) * 2 - 1;
      this.mouse2D.target.y = - (mouseY / this.rendererBounds.height) * 2 + 1;
    };

    this.camera = camera;
    this.mouseMove = mouseMove;
    this.gui = gui;
    this.addListeners();
  }

  addListeners() {
    this.mouseMove.addEventListener('mousemove', this.onMouseMove);
  }

  removeListeners() {
    this.mouseMove.removeEventListener('mousemove', this.onMouseMove);
  }

  setRendererBounds(bounds) {
    this.rendererBounds = bounds;
  }

  update(updateInfo) {
    this.mouseStrength.current = lerp(
      this.mouseStrength.current,
      this.mouseStrength.target,
      this.ease * updateInfo.slowDownFactor
    );

    this.mouse2D.current.x = lerp(
      this.mouse2D.current.x,
      this.mouse2D.target.x,
      this.ease * updateInfo.slowDownFactor
    );

    this.mouse2D.current.y = lerp(
      this.mouse2D.current.y,
      this.mouse2D.target.y,
      this.ease * updateInfo.slowDownFactor
    );
  }

  setPixelRatio(ratio) {
    this.pixelRatio = ratio;
  }

  destroy() {
    this.removeListeners();
  }

}