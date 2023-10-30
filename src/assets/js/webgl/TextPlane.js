import Drawer from "./Drawer";

export default class TextPlane {
  constructor(text, vertexShader, fragmentShader) {
    this.drawer = new Drawer(text[0], text[1]);
    this.drawer.draw();
  }
}