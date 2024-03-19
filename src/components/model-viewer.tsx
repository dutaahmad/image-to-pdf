"use client";
import { useRef, useState } from "react";

import { Vector3, Color, Mesh } from "three";

import { useFBX, useGLTF } from "@react-three/drei";

class ModelViewerInterface {
    modelPath: string = "";
    scale: number = 1;
    position: Vector3 | [number, number, number] = [0, 0, 0];
    color?: Color | string;
    withModelControl: boolean = true;
    rotation?: Vector3 = new Vector3(0, 0, 0); // Use Vector3 for rotation
    materialPath?: string;
}

const ModelViewer = ({
    modelPath,
    scale,
    position,
    color,
    withModelControl,
    rotation,
    materialPath = "",
}: ModelViewerInterface) => {
    const [hovered, setHover] = useState(false);
    const mesh = useRef<Mesh>(null!);

    const GLTF_MODEL = useGLTF(modelPath);
    const SCALE = hovered ? scale * 1.001 : scale;

    if (withModelControl === true && rotation) {
        // Use the rotation values provided as props
        GLTF_MODEL.scene.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    return (
        <primitive
            ref={mesh}
            object={GLTF_MODEL.scene}
            scale={SCALE}
            position={position}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        />
    );
};

export default ModelViewer;
