import { Random } from "./random";
import { Star, StarFactory } from "./star";

export interface GalaxySettings {
    numberOfStars: number;
    coreDistanceX: number;
    coreDistanceY: number;
    thickness: number;
}

export class Galaxy {
    private _stars: Star[];
  
    constructor(private settings: GalaxySettings) {
      this._stars = this.generateStars();
    }
  
    private generateStars(): Star[] {
      const xDistProps = {mean: 0, stdev: this.settings.coreDistanceX};
      const yDistProps = {mean: 0, stdev: this.settings.coreDistanceY};
      const zDistProps = {mean: 0, stdev: this.settings.thickness};
      const stars: Star[] = [];
      for (let i = 0; i < this.settings.numberOfStars; i++) {
  
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