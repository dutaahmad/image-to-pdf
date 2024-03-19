"use client";

import { Html, useProgress } from '@react-three/drei';
import { Progress } from "@/components/ui/progress"

const CanvasLoading = () => {
    const { progress } = useProgress()
    return <Html center className='font-semibold italic text-sm'>{progress} % loading a model</Html>
}

export default CanvasLoading