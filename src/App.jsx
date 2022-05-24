import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  const sceneRef = useRef();

  return (
    <>
      <ambientLight />
      <LayoutControls auto orbit={sceneRef}>
        <group ref={sceneRef}>
          <Box position={[-1.5, 0, 0]}>
            <meshNormalMaterial />
          </Box>

          <Box position={[0, 0, 0]}>
            <meshNormalMaterial />
          </Box>

          <Box position={[1.5, 0, 0]}>
            <meshNormalMaterial />
          </Box>
        </group>
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
