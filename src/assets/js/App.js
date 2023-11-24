import { WebGL } from "./webgl";
import "../scss/app.scss";

window.addEventListener("load", () => {
  const rendererEl = document.querySelector("#webgl");
  if(rendererEl) {
    new WebGL({rendererEl})
  }
});
