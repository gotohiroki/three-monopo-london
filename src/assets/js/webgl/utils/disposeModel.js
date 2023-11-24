import { BufferGeometry, Material, Mesh } from 'three';
export const disposeModel = (model) => {
  if(model.children) {
    model.children.forEach(nastedChild => disposeModel(nastedChild));
  }

  if(model instanceof Mesh) {
    if(model.geometry instanceof BufferGeometry) {
      model.geometry.dispose();
    }
    if(model.material instanceof Material) {
      model.material.dispose();
    }
  }
};