import webGL from "./webgl";
import "../scss/app.scss";

const app = new webGL("#webgl");

window.addEventListener("DOMContentLoaded", () => {
  app.init();
  app.update();
});

window.addEventListener("resize", () => {
  app.onResize();
});
