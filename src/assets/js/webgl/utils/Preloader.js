import { CubeTextureLoader, EventDispatcher, Texture, VideoTexture } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { disposeModel } from './disposeModel';
import { AssetType } from './sharedTypes';

export class Preloader extends EventDispatcher {
  constructor() {
    super();
    this.assetsLoadedCounter = 0;
    this.dracoLoader = new DRACOLoader();
    this.gltfLoader = new GLTFLoader();
    this.cubeTextureLoader = new CubeTextureLoader();
    this.assetsToPreload = [];
    this.loadedAssets = {};
    this.dracoLoader.setDecoderPath('/draco/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  _assignAsset(props) {
    const { asset, naturalHeight, naturalWidth, objPropertyName, type } = props;
    this.loadedAssets[objPropertyName] = {
      type,
      asset,
      naturalWidth,
      naturalHeight
    };
    this._onAssetLoaded();
  }

  _preloadTextures() {
    if(this.assetsToPreload.length === 0) {
      return this._onLoadingComplete();
    }

    const handleImageLoad = (item) => {
      const texture = new Texture();
      const image = new window.Image();
      image.crossOrigin = 'anonymous';
      image.src = item.src;

      const handleLoaded = () => {
        texture.image = image;
        texture.needsUpdate = true;

        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.IMAGE,
          asset: texture,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        });
      };

      if(image.complete) {
        return handleLoaded();
      }

      image.onload = () => {
        handleLoaded();
      }

      image.onerror = () => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.IMAGE,
          asset: texture,
          naturalWidth: 1,
          naturalHeight: 1
        })
        console.error(`Failed to load image at ${item.src}`);
      };
    };

    const handleVideoLoad = (item) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.loop = true;
      video.controls = true;
      video.playsInline = true;
      video.autoplay = true;
      video.src = item.src;
      void video.play();

      video.oncanplay = () => {
        const texture = new VideoTexture(video);
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.VIDEO,
          asset: texture,
          naturalWidth: video.videoWidth,
          naturalHeight: video.videoHeight
        });
      };

      video.onerror = () => {
        const texture = new VideoTexture(video);
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.VIDEO,
          asset: texture,
          naturalWidth: 1,
          naturalHeight: 1,
        });
        console.error(`Failed to load video at ${item.src}`);
      };
    };

    const handleModel3DLoad = (item) => {
      this.gltfLoader.load(item.src, (gltf) => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.MODEL3D,
          asset: gltf,
          naturalWidth: 1, 
          naturalHeight: 1
        });
      },
      
      progress => {},

      error => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.MODEL3D,
          asset: null,
          naturalWidth: 1,
          naturalHeight: 1,
        });
        console.error(`Failed to load 3D model at ${item.src} `, error);
      });
    };

    const handleCubeTextureLoad = (item) => {
      const onLoad = (texture) => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.CUBE_TEXTURE,
          asset: texture,
          naturalWidth: 1,
          naturalHeight: 1
        });
      };
      this.cubeTextureLoader.setPath(`cubeMaps/${item.src}/`);
      this.cubeTextureLoader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'], onLoad);
    };

    this.assetsToPreload.forEach(item => {
      switch(item.type) {
        case AssetType.IMAGE: {
          handleImageLoad(item);
          break;
        }
        case AssetType.VIDEO: {
          handleVideoLoad(item);
          break;
        }
        case AssetType.MODEL3D: {
          handleModel3DLoad(item);
          break;
        }
        case AssetType.CUBE_TEXTURE: {
          handleCubeTextureLoad(item);
          break;
        }
        default:
          break;
      }
    });
  }

  _onAssetLoaded() {
    this.assetsLoadedCounter += 1;
    const loadRatio = this.assetsLoadedCounter / this.assetsToPreload.length;
    this.dispatchEvent({ type: 'progress', progress: loadRatio });
    if(loadRatio === 1) {
      this._onLoadingComplete();
    }
  }

  _onLoadingComplete() {
    this.dispatchEvent({ type: 'loaded' });
  }

  setAssetsToPreload(items) {
    this.assetsToPreload = items;
    this._preloadTextures();
  }

  destroy() {
    Object.entries(this.loadedAssets).forEach(el => {
      switch(el[1].type) {
        case AssetType.IMAGE:
          el[1].asset.dispose();
          break;
        case AssetType.VIDEO:
          el[1].asset.dispose();
          break;
        case AssetType.MODEL3D:
          el[1].asset.scenes.forEach(scene => {
            disposeModel(scene);
          });
          break;
        case AssetType.CUBE_TEXTURE:
          el[1].asset.dispose();
          break;
        default:
          break;
      }
    });
  }

}