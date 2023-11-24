import { AssetType } from '../utils/sharedTypes';
import { breakpoints } from '../utils/media';
import { MediaPlane } from './MediaPlane';
import { TextTexture } from './TextTexture';
import { Lense } from './Lense';

export class TextPlane extends MediaPlane {
  constructor({ gui, fragmentShader, vertexShader, geometry, text, offsetsArray }) {
    super({ geometry, fragmentShader, vertexShader });
    this.textTexture = null;
    this.isTTAnimatedIn = false;
    this.text = text;
    this.offsetsArray = offsetsArray;
    this.gui = gui;
    this.setGui();
  }

  setGui() {};

  setRendererBounds(bounds) {
    super.setRendererBounds(bounds);
    this._createTextTexture(this.rendererBounds);
    if(this.rendererBounds.width >= breakpoints.tablet) {
      this.mesh.material.uniforms.uLenseSize.value = Lense.tabletSize;
    } else {
      this.mesh.material.uniforms.uLenseSize.value = Lense.mobileSize;
    }
  }
  
  _createTextTexture(bounds) {
    if(this.textTextur) {
      this.textTexture.destroy();
    }

    this.textTexture = null;
    this.textTexture = new TextTexture({
      text: this.text,
      offsetArray: this.offsetsArray,
      isAnimatedIn: this.isTTAnimatedIn,
    });
    this.isTTAnimatedIn = true;
    this.textTexture.setRedererBounds(bounds);
    const asset = {
      asset: this.textTexture.texture,
      naturalWidth: this.textTexture.rendererBounds.width,
      naturelHeight: this.textTexture.rendererBounds.height,
      type: AssetType.IMAGE
    };
    this.setAsset(asset);
    this.textTexture.animateIn();
  }

  update(updateInfo) {
    super.update(updateInfo);
    if(this.textTexture) {
      this.textTexture.update(updateInfo);
    }
  }

  destroy() {
    super.destroy();
    if(this.textTextur) {
      this.textTexture.destroy();
    }
  }
}
