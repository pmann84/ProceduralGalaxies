import { IWindowDimensions } from "./window";
import * as THREE from 'three';

export class Camera {
    private camera: THREE.PerspectiveCamera;
  
    constructor(aspect: number, fov: number = 70, near = 0.01, far = 10000){
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.x = 70;
      this.camera.position.y = 70;
      this.camera.position.z = 30;
      this.camera.up = new THREE.Vector3(0,0,1);
      this.camera.lookAt(0,0,0);
      this.camera.updateProjectionMatrix();
    }
  
    public onResize(windowDimesions: IWindowDimensions) {
      this.camera.aspect = windowDimesions.aspect;
      this.camera.updateProjectionMatrix();
    }
  
    public toObject(): THREE.PerspectiveCamera {
      return this.camera;
    }
}