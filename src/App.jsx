import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  // Set initially selected model by name
  const [selectedModel, setSelectedModel] = useState("boxGroup");
  const ref = useRef();

  // Change the model without interaction
  // useEffect(() => {
  //   setSelectedModel(ref);
  // }, []);

  return (
    <>
      <ambientLight />

      <LayoutControls orbit={"BoxOne"} selectedModel={selectedModel}>
        <Box name='BoxOne' position={[-1.5, 0, 0]}>
          <meshNormalMaterial />
        </Box>

        <group name='boxGroup' controllable>
          <Box args={[0.3, 0.3, 0.3]} position={[-0.3, 0, 0]}>
            <meshNormalMaterial />
          </Box>
          <Box args={[0.3, 0.3, 0.3]} position={[0, 0.3, 0]}>
            <meshNormalMaterial />
          </Box>
          <Box args={[0.3, 0.3, 0.3]} position={[0, -0.3, 0]} ref={ref}>
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
