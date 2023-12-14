import * as THREE from 'three';

export interface GaussianProps {
    mean: number;
    stdev: number;
}

export const DefaultGaussianProps: GaussianProps = { mean: 0, stdev: 1};

export class Random {
    public static Gaussian({ mean, stdev }: GaussianProps = DefaultGaussianProps): number {
        const u = 1.0 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdev + mean;
    }

    public static Gaussian3d(
        xProps: GaussianProps = DefaultGaussianProps, 
        yProps: GaussianProps = DefaultGaussianProps, 
        zProps: GaussianProps = DefaultGaussianProps
    ): THREE.Vector3 {
        return new THREE.Vector3(
            Random.Gaussian(xProps),
            Random.Gaussian(yProps),
            Random.Gaussian(zProps)
        )
    }

    public static InRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}