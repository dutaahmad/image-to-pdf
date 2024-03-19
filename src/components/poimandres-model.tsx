/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Model(props: any) {
    const group = useRef();
    const { nodes, materials } = useGLTF("/Poimandres.gltf");
    return (
        <group ref={group} {...props} dispose={null} scale={0.4}>
            <mesh
                castShadow
                receiveShadow
                // @ts-ignore
                geometry={nodes.Curve007_1.geometry}
                material={materials["Material.001"]}
            />
            <mesh
                castShadow
                receiveShadow
                // @ts-ignore
                geometry={nodes.Curve007_2.geometry}
                material={materials["Material.002"]}
            />
        </group>
    );
}

useGLTF.preload("/Poimandres.gltf");

export default Model;
