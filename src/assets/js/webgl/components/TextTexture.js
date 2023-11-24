import { EventDispatcher, Texture } from 'three';
import gsap from 'gsap';
import { breakpoints } from '../utils/media';

export class TextTexture extends EventDispatcher {
  constructor({ text, offsetArray, isAnimatedIn }) {
    super();
    this.rendererBounds = { width: 1, height: 1 };
    this.show = 0;
    this.showTween = null;
    this.text1 = text[0];
    this.text2 = text[1];
    this.text3 = text[2];
    this.offsetArray = offsetArray;
    if(isAnimatedIn) { this.show = 1 };
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.texture = new Texture(this.canvas);
  }

  setSize() {
    if(this.canvas && this.ctx) {
      const w = this.rendererBounds.width;
      const h = this.rendererBounds.height;
      const ratio = Math.min(window.devicePixelRatio, 2);
      
      // キャンバスの物理的なピクセルサイズを設定
      this.canvas.width = w * ratio;
      this.canvas.height = h * ratio;

       // キャンバスの表示サイズ（CSSピクセル）を設定
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;

      // コンテキストの変換行列を設定して、レンダリングがデバイスピクセル比を考慮して行われるようにする
      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  animateShow(destination) {
    if(this.showTween) {
      this.showTween.kill();
    }

    this.showTimeline = gsap.timeline({
      onUpdate: () => {
        this.texture.needsUpdate = true;
      },
    });
    
    this.showTimeline.to(this, {
      duration: 1.6,
      // progress: destination,
      show: destination,
      ease: 'power3.inOut',
    });
    
    // this.showTimeline.progress(destination);
    this.showTimeline.play();
  }

  animateIn() {
    this.animateShow(1);
  }

  setRedererBounds(bounds) {
    this.rendererBounds = bounds;
    this.setSize();
    this.texture.needsUpdate = true;
  }

  update(updateInfo) {
    if(!this.ctx) return;
    this.ctx.clearRect(0, 0, this.rendererBounds.width, this.rendererBounds.height);
    let fontSize = this.rendererBounds.width * 0.1;
    if(this.rendererBounds.width >= breakpoints.tablet) {
      fontSize = 80;
    }
    this.ctx.font = `${fontSize}px 'opensans'`;
    this.ctx.fillStyle = '#fff';
    this.ctx.textBaseline = 'top';

    const text1Size = this.ctx.measureText(this.text1);
    const offset1 = this.offsetArray[0];
    const text1Height = text1Size.actualBoundingBoxAscent + text1Size.actualBoundingBoxDescent;
    const text2Size = this.ctx.measureText(this.text2);
    const offset2 = this.offsetArray[1];
    const text3Size = this.ctx.measureText(this.text3);
    const offset3 = this.offsetArray[2];
    const lineHeightOffset = 0.32 * fontSize;
    const signatureHeight = lineHeightOffset * 2 + text1Height * 3;
    const verticalOffset = this.rendererBounds.height / 2 - signatureHeight / 2;

    const animateX = (1 - this.show) * this.rendererBounds.width * 0.11;

    this.ctx.fillText(this.text1, this.rendererBounds.width / 2 - text1Size.width / 2 + text1Size.width * offset1 - animateX, verticalOffset + text1Height * this.offsetArray[3]);
    this.ctx.fillText(this.text2, this.rendererBounds.width / 2 - text2Size.width / 2 + text2Size.width * offset2 + animateX, verticalOffset + text1Height + lineHeightOffset + text1Height * this.offsetArray[4]);
    this.ctx.fillText(this.text3, this.rendererBounds.width / 2 - text3Size.width / 2 + text3Size.width * offset3 - animateX, verticalOffset + text1Height * 2 + lineHeightOffset * 2 + text1Height * this.offsetArray[5]);
  }

  destroy() {
    if(this.showTween) {
      this.showTween.stop();
    }
    this.texture.dispose();
  }
}