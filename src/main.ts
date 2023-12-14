import * as THREE from 'three';
import { addElementsToBody, getWindowSize } from './window';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Camera } from './camera';
import { DefaultBloomSettings, Renderer } from './Renderer';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { Galaxy, GalaxySettings } from './galaxy';
import { Star, StarType, StellarClassification, StellarClassifications } from './star';

// TODO: Sort out the bloom
// TODO: Adjust scale depending on camera position
// TODO: Add colour variation to stars
// TODO: Add spiral arms
// TODO: Add dust clouds

const generateMaterialMap = () => {
  const spriteTexture = loadTexture('./circle120.png');
  return StellarClassifications.reduce(
    (map: Map<StarType, THREE.SpriteMaterial>, classification: StellarClassification) => map.set(classification.classification, new THREE.SpriteMaterial({ map: spriteTexture, color: classification.colour })),
    new Map<StarType, THREE.SpriteMaterial>());
}

const materialMap: Map<StarType, THREE.SpriteMaterial> = generateMaterialMap();

class StarSprite {
  private _sprite: THREE.Sprite;
  constructor(private star: Star, material: THREE.SpriteMaterial) {
    this._sprite = this.generateSprite(material);
  }

  private generateSprite(material: THREE.SpriteMaterial): THREE.Sprite {
    const sprite = new THREE.Sprite(material);
    // TODO: make sure this is correct
    const size = this.star.info.radius / 5;
    sprite.scale.set(size, size, size);
    sprite.position.set(this.star.x, this.star.y, this.star.z);
    return sprite;
  }

  public updateScale(camera: THREE.PerspectiveCamera) {
    const dist = this._sprite.position.distanceTo(camera.position) / 250;
    let starSize = dist * this.star.info.radius; // This 1 will be replaced by a value 
    starSize = Math.min(Math.max(1, starSize), 10);
    this._sprite.scale.copy(new THREE.Vector3(starSize, starSize, starSize))
  }

  public get sprite(): THREE.Sprite {
    return this._sprite;
  }
}

class GalaxyRenderer {
  private starSprites: StarSprite[] = [];

  constructor(private galaxy: Galaxy) {
  }

  public updateScales(camera: THREE.PerspectiveCamera) {
    this.starSprites.forEach(sprite => {
      sprite.updateScale(camera);
    })
  }

  public addToScene(scene: THREE.Scene, material: THREE.SpriteMaterial): void {
    scene.clear();
    this.galaxy.stars.forEach(star => {
      const starSprite = new StarSprite(star, materialMap.get(star.info.classification)!);
      this.starSprites.push(starSprite);
      scene.add(starSprite.sprite);
    })
  }
}

// Helpers
function loadTexture(path: string): THREE.Texture {
  const texture = new THREE.TextureLoader().load(path, undefined, undefined, (error) => console.error(error));
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Entry Point
const windowDims = getWindowSize();
console.log(JSON.stringify(windowDims));

const scene = new THREE.Scene();
const camera = new Camera(windowDims.aspect);
const renderer = new Renderer(windowDims);
renderer.addBloom(DefaultBloomSettings, scene, camera);
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);
const controls = new OrbitControls(camera.toObject(), renderer.domElement);
const stats = new Stats();
const ui = new GUI();
addElementsToBody([renderer.domElement, stats.dom]);
const spriteTexture = loadTexture('./circle120.png');
const material = new THREE.SpriteMaterial({ map: spriteTexture });

window.addEventListener("resize", () => {
  const windowDims = getWindowSize();
  camera.onResize(windowDims);
  renderer.onResize(windowDims);
})

// Setup
const galaxySettings: GalaxySettings = {
  numberOfStars: 10000,
  coreDistanceX: 20,
  coreDistanceY: 20,
  thickness: 5
}

const galaxy = new Galaxy(galaxySettings);
const galaxyRenderer = new GalaxyRenderer(galaxy);
galaxyRenderer.addToScene(scene, material);

// UI
const renderSettingsFolder = ui.addFolder("Render Settings");
renderSettingsFolder.add(DefaultBloomSettings, "threshold", 0, 1).onChange((value) => {
  renderer.updateBloom({ threshold: value });
});
renderSettingsFolder.add(DefaultBloomSettings, "strength", 0, 1).onChange((value) => {
  renderer.updateBloom({ strength: value });
});
renderSettingsFolder.add(DefaultBloomSettings, "radius", 0, 1).onChange((value) => {
  renderer.updateBloom({ radius: value });
});
const galaxyGenerationSettingsFolder = ui.addFolder("Galaxy Settings");
galaxyGenerationSettingsFolder.add(galaxySettings, "numberOfStars", 1, 10000).onChange((value) => {
  galaxy.regenerate();
  galaxyRenderer.addToScene(scene, material);
});
galaxyGenerationSettingsFolder.add(galaxySettings, "coreDistanceX", 1, 100).onChange((value) => {
  galaxy.regenerate();
  galaxyRenderer.addToScene(scene, material);
});
galaxyGenerationSettingsFolder.add(galaxySettings, "coreDistanceY", 1, 100).onChange((value) => {
  galaxy.regenerate();
  galaxyRenderer.addToScene(scene, material);
});
galaxyGenerationSettingsFolder.add(galaxySettings, "thickness", 1, 100).onChange((value) => {
  galaxy.regenerate();
  galaxyRenderer.addToScene(scene, material);
});

// Render loop
function renderLoop(time: number) {
  controls.update();
  stats.update();
  // galaxyRenderer.updateScales(camera.toObject());
  renderer.render(time, scene, camera);
}
renderer.setRenderLoop(renderLoop);

