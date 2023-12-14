import * as THREE from 'three';

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function spiral(position: THREE.Vector3, offset: number, stdev: number, spiral: number): THREE.Vector3 {
    let { x, y, z } = position;
    let r = Math.sqrt(x**2 + y**2);
    let theta = offset;
    theta += x > 0 ? Math.atan(y/x) : Math.atan(y/x) + Math.PI;
    theta += (r / stdev) * spiral;
    return new THREE.Vector3(r*Math.cos(theta), r*Math.sin(theta), z);
}