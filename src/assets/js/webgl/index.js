import gsap from 'gsap';
import { EventDispatcher, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from 'lil-gui';

import { MouseMove } from './utils/MouseMove';
import { Preloader } from './utils/Preloader';
import { ExperienceScene } from './scenes/ExperienceScene';

export class WebGL extends EventDispatcher {
  constructor({ rendererEl, setShouldReveal, setProgressValue }) {
    super();
    this.rafId = null;
    this.isResumed = true;
    this.mouseMove = MouseMove.getInstance();
    this.preloader = new Preloader();
    this.gui = new GUI();
    this.pixelRatio = 1;

    this.rendererEl = rendererEl;
    this.canvas = document.createElement('canvas');
    this.rendererEl.appendChild(this.canvas);
    this.camera = new PerspectiveCamera();
    this.setShouldReveal = setShouldReveal;
    this.setProgressValue = setProgressValue;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'default'
    });

    this.orbitControls = new OrbitControls(this.camera, this.rendererEl);
    this.orbitControls.enableDamping = true;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableRotate = false;
    this.orbitControls.enableZoom = false;
    this.orbitControls.update();
    this.gui.title('Scene aettings');

    this.experienceScene = new ExperienceScene({
      camera: this.camera,
      mouseMove: this.mouseMove,
      controls: this.orbitControls,
      gui: this.gui
    });

    this.onVisibilityChange = () => {
      if(document.hidden) {
        this.stopAppFrame();
      } else {
        this.resumeAppFrame();
      }
    };

    this.onAssetLoaded = () => {
      this.experienceScene.setLoadedAssets(this.preloader.loadedAssets);
    }

    this.onPreloaderProgress = (e) => {

    }

    this.renderOnFrame = (time) => {
      this.rafId = window.requestAnimationFrame(this.renderOnFrame);
      if(this.isResumed || !this.lastFrameTime) {
        this.lastFrameTime = window.performance.now();
        this.isResumed = false;
        return;
      }
      const delta = time - this.lastFrameTime;
      let slowDownFactor = delta / (1000 / 60);
      const slowDownFactorRounded = Math.round(slowDownFactor);
      if(slowDownFactor >= 1) {
        slowDownFactor = slowDownFactorRounded;
      }
      this.lastFrameTime = time;
      // マウスを動かす
      this.mouseMove.update();
      this.experienceScene.update({ delta, slowDownFactor, time });
      this.renderer.render(this.experienceScene, this.camera);
    };

    this.onResize();
    this.addListeners();
    this.resumeAppFrame();
    this.lenseSrc = './assets/img/lense.png';
    this.preloader.setAssetsToPreload([{ src: this.lenseSrc, type: 'image', targetName: 'lense' }]);
  }

  onResize() {
    const rendererBounds = this.rendererEl.getBoundingClientRect();
    const aspectRatio = rendererBounds.width / rendererBounds.height;
    this.camera.aspect = aspectRatio;
    this.camera.position.z = 1000;
    this.camera.fov = 2 * Math.atan(rendererBounds.height / 2 / this.camera.position.z) * (180 / Math.PI);
    this.renderer.setSize(rendererBounds.width, rendererBounds.height);
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.camera.updateProjectionMatrix();
    this.experienceScene.setPixelRatio(this.pixelRatio);
    this.experienceScene.setRendererBounds(rendererBounds);
  }

  addListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('visibilitychange', this.onVisibilityChange);
    this.preloader.addEventListener('loaded', this.onAssetLoaded);
    this.preloader.addEventListener('progress', this.onPreloaderProgress);
  }

  removeListeners() {
    window.removeEventListener('resize', this.onResize.bind(this));
    window.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.preloader.removeEventListener('loaded', this.onAssetLoaded);
    this.preloader.removeEventListener('progress', this.onPreloaderProgress);
  }

  resumeAppFrame() {
    this.isResumed = true;
    if(!this.rafId) {
      this.rafId = window.requestAnimationFrame(this.renderOnFrame);
    }
  }

  stopAppFrame() {
    if(this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy() {
    if(this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.stopAppFrame();
    this.removeListeners();
    this.experienceScene.destroy();
    this.preloader.destroy();
    this.gui.destroy();
  }
}