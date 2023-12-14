import { Random } from "./random";
import { Star, StarFactory } from "./star";
import { spiral } from "./utils";

export interface GalaxySettings {
    numberOfStars: number;
    coreDistanceX: number;
    coreDistanceY: number;
    thickness: number;
    ratioOfStarsInArms: number;
    numberOfArms: number;
    armDistanceX: number;
    armDistanceY: number;
    armMeanX: number;
    armMeanY: number;
    spiral: number;
    swirlRadiusMin: number;
}

export class Galaxy {
    private _stars: Star[];
  
    constructor(private settings: GalaxySettings) {
      this._stars = this.generateStars();
    }

    private generateStars(): Star[] {
      let stars = this.generateCoreStars();
      stars = stars.concat(this.generateArmStars());
      return stars;
    }

    private generateArmStars(): Star[] {
      const xDistProps = {mean: this.settings.armMeanX, stdev: this.settings.armDistanceX};
      const yDistProps = {mean: this.settings.armMeanY, stdev: this.settings.armDistanceY};
      const zDistProps = {mean: 0, stdev: this.settings.thickness};
      const stars: Star[] = [];
      if (this.settings.numberOfArms > 0) {
        const numberOfStarsInArms = this.settings.numberOfStars * (this.settings.ratioOfStarsInArms / 100);
        for (let arm = 0; arm < this.settings.numberOfArms; arm++) {
          for (let i = 0; i < numberOfStarsInArms; i++) {
            const pos = spiral(Random.Gaussian3d(xDistProps, yDistProps, zDistProps), i * 2 * Math.PI / this.settings.numberOfArms, this.settings.armDistanceX, this.settings.spiral);
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