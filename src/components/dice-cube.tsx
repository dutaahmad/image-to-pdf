"use client";
import { Suspense } from "react";

import { Canvas, extend } from "@react-three/fiber";
import { Mesh, BoxGeometry, MeshStandardMaterial } from "three";

extend({ Mesh, BoxGeometry, MeshStandardMaterial });

import ModelViewer from "./model-viewer";
import CanvasLoading from "./canvas-loader";
import {
    Environment,
    OrbitControls,
    PerspectiveCamera,
    useGLTF,
} from "@react-three/drei";
import CubeModel from "./dice-model";

const DiceCube = ({
    modelURL,
    ...restProps
}: {
    modelURL: string;
    restProps?: any;
}) => {
    const credit = `This work is based on "Dice" (https://sketchfab.com/3d-models/dice-d796ac8f56db4dc78ed18be534939225) by TheBoss009SS (https://sketchfab.com/TheBoss009SS) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)`;
    return (
        <div className="w-[40%] h-full">
            <Canvas>
                <Suspense fallback={<CanvasLoading />}>
                    {/* <ambientLight intensity={10} />
                <spotLight position={[10, 10, 10]} intensity={10} />
                <ModelViewer
                    modelPath={modelURL}
                    scale={0.03}
                    position={[0, 0, 0]}
                    withModelControl
                />
                <axesHelper args={[5]} />
                <gridHelper /> */}
                    <spotLight position={[10, 10, 10]} intensity={10} />
                    <CubeModel scale={1.3} />
                    <OrbitControls />
                    <Environment preset="sunset" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default DiceCube;
