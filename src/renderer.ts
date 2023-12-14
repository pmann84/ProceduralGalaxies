import { EffectComposer, OutputPass, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { IWindowDimensions } from './window';
import * as THREE from 'three';
import { Camera } from './camera';

export interface IBloomSettings {
    enable: boolean;
    threshold: number;
    strength: number;
    radius: number;
}
export const DefaultBloomSettings: IBloomSettings = {
    enable: true,
    threshold: 0,
    strength: 0.5,
    radius: 1.0
}
  
export type RenderLoopFuncT = (time: number) => void;

export class Renderer {
    private renderer: THREE.WebGLRenderer;
    private composer?: EffectComposer;
    private bloomPass?: UnrealBloomPass;
  
    constructor(private windowDimesions: IWindowDimensions, ) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(this.windowDimesions.devicePixelRatio);
      this.renderer.setSize(this.windowDimesions.width, this.windowDimesions.height);
    }
  
    public onResize(windowDimesions: IWindowDimensions) {
      this.renderer.setSize(windowDimesions.width, windowDimesions.height);
      if (this.composer) {
        this.composer.setSize(windowDimesions.width, windowDimesions.height);
      }
    }
  
    public setRenderLoop(loopFunc: RenderLoopFuncT) {
      this.renderer.setAnimationLoop(loopFunc);
    }
  
    public addBloom(bloomSettings: IBloomSettings, scene: THREE.Scene, camera: Camera) {
        const renderScene = new RenderPass(scene, camera.toObject());
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.windowDimesions.width, this.windowDimesions.height), bloomSettings.strength, bloomSettings.radius, bloomSettings.threshold);
        const outputPass = new OutputPass();
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(outputPass);
    }

    public updateBloom(bloomSettings: Partial<IBloomSettings>) {
        if (this.bloomPass) {
            if (bloomSettings.threshold) this.bloomPass.threshold = bloomSettings.threshold;
            if (bloomSettings.strength) this.bloomPass.strength = bloomSettings.strength;
            if (bloomSettings.radius) this.bloomPass.radius = bloomSettings.radius;
        }
    }
  
    public get domElement() { return this.renderer.domElement; }
  
    public render(time: number, scene: THREE.Scene, camera: Camera) {
      if (this.composer) {
        this.composer.render(time);
      } else {
        this.renderer.render(scene, camera.toObject());
      }
    }
  }