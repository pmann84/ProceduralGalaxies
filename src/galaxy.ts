import { Vector3 } from "three";
import { Random } from "./random";
import { Star, StarFactory } from "./star";
import { rotate, spiral } from "./utils";

export interface GalaxySettings {
    numberOfStars: number;
    coreDistanceX: number;
    coreDistanceY: number;
    thickness: number;
    ratioOfStarsInArms: number;
    numberOfArms: number;
    armWidth: number;
    armLength: number;
    spiral: number;
}

export class Galaxy {
    private _stars: Star[];
  
    constructor(private settings: GalaxySettings) {
      this._stars = this.generateStars();
    }

    private generateStars(): Star[] {
      let stars: Star[] = this.generateCoreStars();
      stars = stars.concat(this.generateArmStars());
      return stars;
    }

    private generateArmStars(): Star[] {
      // Calculate the arm stars
      const xDistProps = {mean: 0, stdev: this.settings.armLength};
      const yDistProps = {mean: 0, stdev: this.settings.armWidth};
      const zDistProps = {mean: 0, stdev: this.settings.thickness};
      const stars: Star[] = [];
      if (this.settings.numberOfArms > 0) {
        const numberOfStarsInArms = this.settings.numberOfStars * (this.settings.ratioOfStarsInArms / 100);
        const numberOfStarsPerArm = numberOfStarsInArms / this.settings.numberOfArms;
        const armHeight = 0;
        for (let arm = 0; arm < this.settings.numberOfArms; arm++) {
          const armAngularOffset = arm * 2 * Math.PI / this.settings.numberOfArms
          const startPoint = new Vector3(
            0 + Random.Gaussian({ mean: this.settings.coreDistanceX, stdev: 1}),
            0,
            armHeight
          );
          for (let i = 0; i < numberOfStarsPerArm; i++) {
            // Calculate a stretch in x and y
            const initialPos = new Vector3(startPoint.x + Random.HalfGaussian(xDistProps), startPoint.y + Random.Gaussian(yDistProps), startPoint.z + Random.Gaussian(zDistProps)); 
            // Rotate this to the required position depending on how many arms there are
            const rotatedPos = rotate(initialPos, this.settings.coreDistanceX, this.settings.coreDistanceY, armAngularOffset);
            // Now add a spiral factor
            const pos = this.settings.spiral > 0 ? spiral(rotatedPos, this.settings.spiral, this.settings.armLength) : rotatedPos;
            // const pos = spiral(Random.Gaussian3d(xDistProps, yDistProps, zDistProps), i * 2 * Math.PI / this.settings.numberOfArms, this.settings.armDistanceX, this.settings.spiral);
            const star = new Star(pos.x, pos.y, pos.z, StarFactory.generate());
            stars.push(star);
          }
        }
      }
      return stars;
    }
  
    private generateCoreStars(): Star[] {
      const xDistProps = {mean: 0, stdev: this.settings.coreDistanceX};
      const yDistProps = {mean: 0, stdev: this.settings.coreDistanceY};
      const zDistProps = {mean: 0, stdev: this.settings.thickness};
      const stars: Star[] = [];
      let numCoreStars = this.settings.numberOfStars;
      if (this.settings.numberOfArms > 0) {
        numCoreStars *= ((100.0 - this.settings.ratioOfStarsInArms) / 100);
      }
      for (let i = 0; i < numCoreStars; i++) {
  
        const pos = Random.Gaussian3d(xDistProps, yDistProps, zDistProps);
        const star = new Star(pos.x, pos.y, pos.z, StarFactory.generate());
        stars.push(star);
      }
  
      return stars;
    }

    public regenerate() {
        this._stars = this.generateStars();
    }
  
    public get stars(): Star[] {
      return this._stars;
    }
}