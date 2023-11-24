import { Object3D } from 'three';

export class InteractiveObject extends Object3D {
  constructor() {
    super();
    this.colliderName = null;
    this._isHoverd = false;
  }

  setColliderName(name) {
    this.colliderName = name;
  }

  onMouseEnter() {
    this._isHoverd = true;
    this.dispatchEvent({ type: 'mouseenter' });
  }

  onMouseLeave() {
    this._isHoverd = false;
    this.dispatchEvent({ type: 'mouseleave' });
  }

  onClick() {
    this.dispatchEvent({ type: 'click' });
  }

  update(updateinfo) {

  }

  destroy() {
    
  }

}