import { Random } from "./random";

export enum StarType {
    O, B, A, F, G, K, M
}

export interface StellarClassification {
    classification: StarType;
    tEffMin: number;
    tEffMax: number;
    colour: number;
    massMin: number;
    massMax: number;
    radiusMin: number;
    radiusMax: number;
    rarity: number;
}

export const StellarClassifications: StellarClassification[] = [
    { 
        classification: StarType.O,
        tEffMin: 30000,
        tEffMax: 50000,
        colour: 0x9bb0ff,
        massMin: 16,
        massMax: 30,
        radiusMin: 6.6,
        radiusMax: 10,
        rarity: 0.00003
    },
    { 
        classification: StarType.B,
        tEffMin: 10000,
        tEffMax: 30000,
        colour: 0xaabfff,
        massMin: 2.1,
        massMax: 16,
        radiusMin: 1.8,
        radiusMax: 6.6,
        rarity: 0.12
    },
    { 
        classification: StarType.A,
        tEffMin: 7500,
        tEffMax: 10000,
        colour: 0xcad7ff,
        massMin: 1.4,
        massMax: 2.1,
        radiusMin: 1.4,
        radiusMax: 1.8,
        rarity: 0.61
    },
    { 
        classification: StarType.F,
        tEffMin: 6000,
        tEffMax: 7500,
        colour: 0xf8f7ff,
        massMin: 1.04,
        massMax: 1.4,
        radiusMin: 1.15,
        radiusMax: 1.4,
        rarity: 3.0
    },
    { 
        classification: StarType.G,
        tEffMin: 5200,
        tEffMax: 6000,
        colour: 0xfff4ea,
        massMin: 0.8,
        massMax: 1.04,
        radiusMin: 0.96,
        radiusMax: 1.15,
        rarity: 7.6
    },
    { 
        classification: StarType.K,
        tEffMin: 3700,
        tEffMax: 5200,
        colour: 0xffd2a1,
        massMin: 0.45,
        massMax: 0.8,
        radiusMin: 0.7,
        radiusMax: 0.96,
        rarity: 12.0
    },
    { 
        classification: StarType.M,
        tEffMin: 2400,
        tEffMax: 3700,
        colour: 0xffcc6f,
        massMin: 0.08,
        massMax: 0.45,
        radiusMin: 0.3,
        radiusMax: 0.7,
        rarity: 76.0
    }
]

export interface StellarTypeInfo {
    classification: StarType;
    tEff: number;
    colour: number;
    mass: number;
    radius: number;
}

export class StarFactory {
    public static generate(): StellarTypeInfo {
        // Pick a random type based on the rarity
        const seed = Math.random() * 100;
        const selectedClassifications = StellarClassifications.filter(classification => {
            if (classification.rarity <= seed) {
                return classification;
            }
        })
        const selectedClassification = selectedClassifications[selectedClassifications.length - 1];
        // console.log(seed, selectedClassifications, selectedClassification);
        // Select random properties for the rest
        const tEff = Random.InRange(selectedClassification.tEffMin, selectedClassification.tEffMax);
        const mass = Random.InRange(selectedClassification.massMin, selectedClassification.massMax);
        const radius = Random.InRange(selectedClassification.radiusMin, selectedClassification.radiusMax);
        return {
            classification: selectedClassification.classification,
            tEff: tEff,
            colour: selectedClassification.colour,
            mass: mass, 
            radius: radius
        }
    }
}


export class Star {
    constructor(public readonly x: number, public readonly y: number, public readonly z: number, public readonly info: StellarTypeInfo) {
    }
}