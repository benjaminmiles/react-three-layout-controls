# React Three Layout Controls

_A composition component that combines `TransformControls`, `Select`, and `OrbitCamera` from [Drei](https://github.com/pmndrs/drei) into an easy-to-use layout helper._

![Preview](/public/preview.gif)

[Live Demo](https://codesandbox.io/p/github/benjaminmiles/react-three-layout-controls/main)

### Install

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

The simplest way to use `LayoutControls` is to parent your scene and add the `autoSelect` prop. This will enable layout controls for any mesh found within the children of the component.

```jsx
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  return (
    <LayoutControls>
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

## Transform Modes

Cycle through transform control modes by double-clicking an object or with the `t` hotkey.

## Copy To Clipboard

Use your keyboards's copy command to add the last selected transforms prop to your clipboard. By default it will copy the values as React props, but you can change that behavior by passing "props", "arrays", or "vectors" to the 'copyFormat' prop.

## Advanced Use

If you want full control of what is transformable, pass `autoSelect={false}` and add a `controllable` prop to your mesh or group components. There just needs to be at least one mesh geometry in a group for it to be selectable.

```jsx
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  return (
    <LayoutControls autoSelect={false}>
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

`LayoutControls` uses the `Select` component from Drei, which uses raycasting to return a selection during the `onPointerDown` event. Since raycasting requires geometry, groups and other objects without geometry won't work. To fix that, just add the `controllable` prop to your group. This will then allow you to transform your desired object. This works by bubbling up the object tree from where the mesh geometry intersected. This will work with or without the `autoSelect` prop, and allow you to intentionally transform multiple meshes at once. The component will stop at the first controllable parent it finds. You can change the parent bubbling limit by overriding the `layers` prop.

```jsx
import { Box } from "@react-three/drei";
import LayoutControls from "./LayoutControls";

const Scene = () => {
  return (
    <LayoutControls>
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
  return (
    <LayoutControls
      autoSelect={true} // autoSelectmatically interact with all children meshes
      copyFormat={"props"} // What format to copy to the clipboard  "props" || "arrays" || "vectors"
      copyPoints={3} // How many decimal places to fix the transforms to
      cycleKey={"t"} // Hot key for cycling transform modes,
      enabled={true} // Turn LayoutControls on/off
      layers={100} // Parent bubbling limit for the controllable prop
      selectedModel={ref || "name"} // Takes an object ref or an object name. If searching by name, make sure it's a child, or set the scene prop.
      orbit={true || ref} // Adds an orbit camera to the scene and sets it as the default camera. Pass an object ref to set a look-at target.
      snap={0} // Default unit movement
      scene={ref} // Pass a scene or object ref to search for object names outside of the children

      // include any valid TransformControl props
    />
  );
};
```
