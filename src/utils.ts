import * as THREE from 'three';

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function rotate(position: THREE.Vector3, semiMajorAxisX: number, semiMajorAxisY: number, angle: number) {
    let { x, y, z } = position;
    let theta = angle;
    theta += x > 0 ? Math.atan(y/x) : Math.atan(y/x) + Math.PI;
    // const sinTh = Math.sin(theta);
    // const cosTh = Math.cos(theta);
    let r = Math.sqrt(x**2 + y**2);//(semiMajorAxisX * semiMajorAxisY) / Math.sqrt(semiMajorAxisX*semiMajorAxisX*sinTh*sinTh + semiMajorAxisY*semiMajorAxisY*cosTh*cosTh);
    return new THREE.Vector3(r*Math.cos(theta), r*Math.sin(theta), z);
}

export function spiral(position: THREE.Vector3, spiral: number, deviation: number) {
    let { x, y, z } = position;
    let r = Math.sqrt(x**2 + y**2);
    let theta = x > 0 ? Math.atan(y/x) : Math.atan(y/x) + Math.PI;
    theta += (r / deviation) * spiral;
    return new THREE.Vector3(r*Math.cos(theta), r*Math.sin(theta), z);
}