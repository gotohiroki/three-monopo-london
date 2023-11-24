import { CanvasTexture } from 'three';

export default class Drawer {
  constructor(text1, text2) {
    this._text1 = text1;
    this._text2 = text2;
    this.texture = null;
    this.aspect = null;
    this._ctx = null;
    this._margin = 130;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = canvas.width / 2.2;
    this._ctx = canvas.getContext('2d');
    this.aspect = canvas.width / canvas.height;
    this.texture = new CanvasTexture(canvas);
    this.texture.needsUpdate = true;
  }

  draw() {
    const ctx = this._ctx;
    const { width, height } = this._ctx.canvas;
    
    ctx.clearRect(0, 0, width, height);
    
    const fontSize = 85;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'hanging';

    ctx.font = `bold ${fontSize}px 'Poppins'`;
    ctx.fillStyle = '#fff';

    const text2Metrics = ctx.measureText(this._text2);

    ctx.fillText(this._text1, this._margin, this._margin);
    ctx.fillText(this._text2, width - text2Metrics.width - this._margin, height - (fontSize + this._margin));
  }
}