# React Three Layout Controls

_An composition helper that combines `TransformControls`, `Select`, and `OrbitCamera` from [Drei](https://github.com/pmndrs/drei)._

### Installation

```
npm install
```

### Scripts

```
npm run dev
npm run build
npm run preview
npm run sandbox
```

## Basic Use

The simplest way to use `LayoutControls` is to parent your scene and add the `auto` prop. This will enable layout controls for any mesh found within the children of the component.

```jsx
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  return (
    <LayoutControls auto>
      <Box position={[-1.5, 0, 0]}>
        <meshNormalMaterial />
      </Box>

      <Box position={[0, 0, 0]}>
        <meshNormalMaterial />
      </Box>

      <Box position={[1.5, 0, 0]}>
        <meshNormalMaterial />
      </Box>
    </LayoutControls>
  );
};
```

## Hot Keys

- Cycle through transform control modes with the `t` hotkey.
- Use your copy command to add the current transform props to your clipboard.

## Advanced Use

If you want more control, just omit `auto` and add the `controllable` prop to your mesh.

```jsx
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  return (
    <LayoutControls>
      <Box position={[-1.5, 0, 0]} controllable>
        <meshNormalMaterial />
      </Box>

      <Box position={[0, 0, 0]}>
        <meshNormalMaterial />
      </Box>

      <Box position={[1.5, 0, 0]} controllable>
        <meshNormalMaterial />
      </Box>
    </LayoutControls>
  );
};
```

`LayoutControls` uses the `Select` component from Drei, which uses raycasting to return a selection during the `onPointerDown` event. Since raycasting requires geometry, groups and other objects without geometry won't work. To fix that, just add the `controllable` prop to your group. This will then allow you to transform your desired object. This works by bubbling up the object tree from where the mesh geometry intersected. This will work with or without the `auto` prop, and allow you to intentionally transform multiple meshes at once. The component will stop at the first controllable parent it finds. You can change the parent bubbling limit by overriding the `layers` prop.

```jsx
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  return (
    <LayoutControls auto>
      <group controllable>
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
  );
};
```

## Props:

```jsx
import LayoutControls from "./LayoutControls";

const Scene = () => {
  const sceneRef = React.useRef();

  return (
    <LayoutControls
      auto // Automatically interact with all meshes
      copyFormat={"props"} // What format to copy to the clipboard  "props" || "arrays" || "vectors"
      cycleKey={"t"} // Hot key for cycling transform modes,
      enabled // Turn LayoutControls on/off
      layers={100} // Parent bubbling limit for the controllable prop
      orbit={objectRef} // Adds an orbit camera with this ref as the look-at target
      snap={0} // Default unit movement
      // any other TransformControl props
    />
  );
};
```
