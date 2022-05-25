import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  const ref = useRef();
  return (
    <>
      <ambientLight />
      <LayoutControls orbit selectedModel={"boxGroup"}>
        <Box position={[-1.5, 0, 0]}>
          <meshNormalMaterial />
        </Box>

        <group name='boxGroup' controllable>
          <Box args={[0.3, 0.3, 0.3]} position={[-0.3, 0, 0]}>
            <meshNormalMaterial />
          </Box>
          <Box args={[0.3, 0.3, 0.3]} position={[0, 0.3, 0]}>
            <meshNormalMaterial />
          </Box>
          <Box args={[0.3, 0.3, 0.3]} position={[0, -0.3, 0]}>
            <meshNormalMaterial />
          </Box>
          <Box args={[0.3, 0.3, 0.3]} position={[0.3, 0, 0]}>
            <meshNormalMaterial />
          </Box>
        </group>

        <Box position={[1.5, 0, 0]}>
          <meshNormalMaterial />
        </Box>
      </LayoutControls>
    </>
  );
};

const App = () => {
  return (
    <Canvas camera={{ fov: 70, position: [0, 0, 3] }}>
      <Scene />
    </Canvas>
  );
};

export default App;
