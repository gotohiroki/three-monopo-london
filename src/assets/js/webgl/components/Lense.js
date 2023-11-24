import { breakpoints } from "../utils/media";
import { MediaPlane } from "./MediaPlane";

export class Lense extends MediaPlane {
  constructor({ gui, fragmentShader, geometry, vertexShader }) {
    super({ fragmentShader, geometry, vertexShader });
    this.gui = gui;
    this.setGui();
  }

  setGui() {};

  update(updateInfo) {
    super.update(updateInfo);
  }

  setRendererBounds(bounds) {
    super.setRendererBounds(bounds);
    if(this.rendererBounds.width >= breakpoints.tablet) {
      this.setSize({ width: Lense.tabletSize, height: Lense.tabletSize });
    } else {
      this.setSize({ width: Lense.mobileSize, height: Lense.mobileSize });
    }
  }

  destroy() {
    super.destroy();
  }
}

Lense.tabletSize = 250;
Lense.mobileSize = 130;