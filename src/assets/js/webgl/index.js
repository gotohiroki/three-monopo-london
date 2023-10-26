import {
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  DoubleSide,
  MeshBasicMaterial,
  Clock,
  Vector4,
  SphereGeometry,
  Vector2,
  OrthographicCamera,
  CircleGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { lerp } from "three/src/math/MathUtils.js";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import GUI from "lil-gui";

export default class webGL {
  // コンストラクタ
  constructor(containerSelector) {
    // canvasタグが配置されるコンテナを取得
    this.container = document.querySelector(containerSelector);

    this.renderParam = {
      clearColor: 0xffffff,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.cameraParam = {
      fov: 45,
      aspect: window.innerWidth / window.innerHeight,
      near: -10,
      far: 10,
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      fovRad: null,
      dist: null,
      lookAt: new Vector3(0, 0, 0),
      x: 0,
      y: 0,
      z: 0,
    };

    this.mouse = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.loader = null;
    this.texture = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.uniforms = null;
    this.clock = new Clock();
    this.image = "./assets/img/lense.png";
  }

  init() {
    this._setScene();
    this._setRender();
    this._setCamera();
    this._setGui();
    this._setStats();
    this._setContorols();
    this._setTexture();
    this._createMesh();
    this._createMesh1();

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  _setScene() {
    this.scene = new Scene();
  }

  _setRender() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      transparent: true,
    });
    this.renderer.setClearColor(new Color(this.renderParam.clearColor));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.renderParam.width, this.renderParam.height);

    this.container.appendChild(this.renderer.domElement);
  }

  _setCamera() {
    this.camera = new OrthographicCamera(
      this.cameraParam.left,
      this.cameraParam.right,
      this.cameraParam.top,
      this.cameraParam.bottom,
      this.cameraParam.near,
      this.cameraParam.far
    );
    this.camera.position.set(
      this.cameraParam.x,
      this.cameraParam.y,
      this.cameraParam.z
    );
  }

  _setGui() {
    let that = this;
    this.settings = {
      progress: 0,
      uColor1: new Color(0.89, 0.34, 0.11),
      uColor2: new Color(0.56, 0.64, 0.64),
      uColor3: new Color(0.16, 0.26, 0.47),
      uUvScale: 1.5,
      uMouseLine: 0.3,
      uLengthLine: 0.5,
      uNoiseAmount: 0.9
    }
    this.gui = new GUI();

    const bgFolder = this.gui.addFolder('BackGround');
    bgFolder.addColor(this.settings, 'uColor1').name('First Color').onChange(() => {
      this.material.uniforms.uColor1.value = this.settings.uColor1;
    });
    bgFolder.addColor(this.settings, 'uColor2').name('Second Color').onChange(() => {
      this.material.uniforms.uColor2.value = this.settings.uColor2;
    });
    bgFolder.addColor(this.settings, 'uColor3').name('Third Color').onChange(() => {
      this.material.uniforms.uColor3.value = this.settings.uColor3;
    });
    bgFolder.add(this.settings, 'uUvScale', 0.01, 3, 0.01).name('uv scale').onChange(() => {
      this.material.uniforms.uUvScale.value = this.settings.uUvScale;
    });
    bgFolder.add(this.settings, 'uMouseLine', 0.01, 1, 0.01).name('mouse line').onChange(() => {
      this.material.uniforms.uMouseLine.value = this.settings.uMouseLine;
    });
    bgFolder.add(this.settings, 'uLengthLine', 0.01, 1, 0.01).name('length line').onChange(() => {
      this.material.uniforms.uLengthLine.value = this.settings.uLengthLine;
    });
    bgFolder.add(this.settings, 'uNoiseAmount', 0.01, 1.2, 0.01).name('Noise amount').onChange(() => {
      this.material.uniforms.uNoiseAmount.value = this.settings.uNoiseAmount;
    });
  }

  _setStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  _setContorols() {
    this.contorols = new OrbitControls(this.camera, this.renderer.domElement);
  }

  _setTexture() {
    this.texture = new TextureLoader().load(this.image);
  }

  _createMesh() {
    this.geometry = new PlaneGeometry(2, 2, 32, 32);
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2() },
        uBlack: { value: new Color(0.0, 0.0, 0.0) },
        uColor1: { value: new Color(0.89, 0.34, 0.11) },
        uColor2: { value: new Color(0.56, 0.64, 0.64) },
        uColor3: { value: new Color(0.16, 0.26, 0.47) },
        uUvScale: { value: 1.5 },
        uMouseLine: { value: 0.3 },
        uLengthLine: { value: 0.5 },
        uNoiseAmount: { value: 0.9 },
        uZoom: { value: 0.5 },
        uTransformPosition: { value: 0.8 },
      },
      vertexShader,
      fragmentShader,
      // wireframe: true,
      side: DoubleSide,
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  _createMesh1() {
    this.geometry1 = new CircleGeometry(0.25, 50);
    this.material1 = new MeshBasicMaterial({
      map: this.texture,
      transparent: true
    })
    this.mesh1 = new Mesh(this.geometry1, this.material1);
    this.mesh1.position.z = 0.01;
    this.mesh1.scale.set( 1 / this.cameraParam.aspect, 1, 1 );
    this.scene.add(this.mesh1);
  }

  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  updateLenseMouse(mouse) {
    this.mouse = mouse;
    const target = new Vector3();
    const current = new Vector3();
    target.set(this.mouse.x, this.mouse.y, 0.01);
    current.set(this.mouse.lastX, this.mouse.lastY, 0.01);
    this.mesh1.position.lerp( target, 0.1);
  }

  updateBgMouse(mouse) {
    this.mouse = mouse;
    const targetV2 = new Vector2();

    // マウス座標を正規化
    const normalizedMouseX = (this.mouse.x + 1) * 0.5;
    const normalizedMouseY = (this.mouse.y + 1) * 0.5;
    targetV2.set(normalizedMouseX, normalizedMouseY);
    this.material.uniforms.uMouse.value.lerp(targetV2, 0.2);
  }


  // 毎フレーム呼び出す
  update() {
    const mouse1 = new Vector3(this.mouse.x, this.mouse.y, 0.01);
    this.updateLenseMouse(mouse1);

    const mouse2 = new Vector2(this.mouse.x, this.mouse.y);
    this.updateBgMouse(mouse2);

    this.stats.update();

    this.material.uniforms.uTime.value += 0.005;
    requestAnimationFrame(this.update.bind(this));
    this._render();
  }

  onResize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    this.camera.aspect = windowWidth / windowHeight;

    this.mesh1.scale.set( 1 / this.camera.aspect, 1, 1 );

    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(windowWidth, windowHeight);
    this._render();
  }
}
