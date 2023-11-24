import { EventDispatcher } from 'three';
export class MouseMove extends EventDispatcher {
  static getInstance() {
    if (!MouseMove.instance) {
      MouseMove.canCreate = true;
      MouseMove.instance = new MouseMove();
      MouseMove.canCreate = false;
    }
    return MouseMove.instance;
  }

  // 各種プロパティの初期化と、イベントハンドラの登録、_addEventsメソッドの呼び出しを行います。
  constructor() {
    super();
    this.mouseLast = { x: 0, y: 0 };
    this.isTouching = false;
    this.clickStart = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.strength = 0;
    this.isInit = false;

    this.onTouchDown = (event) => {
      this.isInit = true;
      this.isTouching = true;
      this.mouseLast.x = 'touches' in event ? event.touches[0].clientX : event.clientX;
      this.mouseLast.y = 'touches' in event ? event.touches[0].clientY : event.clientY;

      this.mouse.x = this.mouseLast.x;
      this.mouse.y = this.mouseLast.y;

      this.clickStart.x = this.mouse.x;
      this.clickStart.y = this.mouse.y;

      this.dispatchEvent({ type: 'down' });
    }


    this.onTouchMove = (event) => {
      this.isInit = true;

      const touchX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const touchY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      const deltaX = touchX - this.mouseLast.x;
      const deltaY = touchY - this.mouseLast.y;
      this.strength = deltaX * deltaY + deltaY * deltaY;

      this.mouseLast.x = touchX;
      this.mouseLast.y = touchY;

      this.mouse.x += deltaX;
      this.mouse.y += deltaY;
    }

    this.onTouchUp = () => {
      this.isTouching = false;
      this.dispatchEvent({ type: 'up' });
    }

    this.onMouseLeave = () => {
      this.dispatchEvent({ type: 'left' });
    }

    this.onClick = () => {
      this.isInit = true;
      const clickBounds = 10;
      const xDiff = Math.abs(this.clickStart.x - this.mouse.x);
      const yDiff = Math.abs(this.clickStart.y - this.mouse.y);
      if(xDiff <= clickBounds && yDiff <= clickBounds) {
        this.dispatchEvent({ type: 'click' });
      }
    };

    if( MouseMove.instance || !MouseMove.canCreate ) {
      throw new Error('Use MouseMove.getInstance()');
    };
    this.addEvents();
    MouseMove.instance = this;
  }

  addEvents() {
    window.addEventListener('mousedown', this.onTouchDown);
    window.addEventListener('mousemove', this.onTouchMove, { passive: true });
    window.addEventListener('mouseup', this.onTouchUp);
    window.addEventListener('click', this.onClick);
    window.addEventListener('touchstart', this.onTouchDown);
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchUp);
    window.addEventListener('mouseout', this.onMouseLeave);
  }

  update() {
    if(this.isInit) {
      this.dispatchEvent({ type: 'mousemove' });
    }

    const { mouse, mouseLast } = this;
    mouseLast.x = mouse.x;
    mouseLast.y = mouse.y;
  }
}

MouseMove.canCreate = false;