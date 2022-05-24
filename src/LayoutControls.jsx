import { useEffect, useCallback, useState, useRef } from "react";
import { TransformControls, OrbitControls, Select } from "@react-three/drei";
import { Vector3 } from "three";

function useRefWithCallback(onMount, onUnmount) {
  const nodeRef = useRef(null);

  const setNodeRef = useCallback(
    node => {
      if (nodeRef.current) {
        onUnmount(nodeRef.current);
      }

      nodeRef.current = node;

      if (nodeRef.current) {
        onMount(nodeRef.current);
      }
    },
    [onMount, onUnmount]
  );

  return [nodeRef, setNodeRef];
}

export const LayoutControls = ({
  auto = false,
  children,
  copyFormat = "props", // "props" || "arrays" || "vectors"
  cycleKey = "t",
  enabled = true,
  layers = 100,
  model,
  orbit,
  scene,
  snap = 0,
  ...props
}) => {
  const transforms = useRef({
    name: null,
    props: null,
    position: new Vector3(),
    rotation: new Vector3(),
    scale: new Vector3(),
    values: null,
  });

  const modes = ["translate", "rotate", "scale"];
  const mode = useRef(0);

  const [selectedModel, setSelectedModel] = useState(null);
  const [lookAtTarget, setLookAtTarget] = useState(null);

  const [transformControlsRef, setTransformControlsRef] = useRefWithCallback(
    node => node.addEventListener("objectChange", updateTransforms),
    node => node.removeEventListener("objectChange", updateTransforms)
  );

  const copyTransforms = e => {
    e.preventDefault();
    const { values, props, position, rotation, scale } = transforms.current;

    switch (copyFormat) {
      case "props":
        e.clipboardData.setData("text/plain", props);
        break;
      case "json":
        e.clipboardData.setData("text/plain", JSON.stringify(values));
        break;
      case "vectors":
        e.clipboardData.setData(
          "text/plain",
          JSON.stringify({
            position,
            rotation,
            scale,
          })
        );
        break;
      default:
    }

    console.log(transforms.current);
  };

  const updateTransforms = o => {
    const { position, rotation, scale } = transforms.current;
    const object = o?.target?.object || o?.current || o || null;

    if (object) {
      position.copy(object.position);
      rotation.copy(object.rotation);
      scale.copy(object.scale);
      transforms.current.name = object.name;
      transforms.current.values = {
        position: position.toArray(),
        rotation: rotation.toArray(),
        scale: scale.toArray(),
      };
      transforms.current.props = `position={[${position.toArray()}]} rotation={[${rotation.toArray()}]} scale={[${scale.toArray()}]}`;
    }
  };

  const cycleModes = () => {
    mode.current = (mode.current + 1) % modes.length;
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(modes[mode.current]);
    }
  };

  const onKeyPressHandler = e => {
    if (enabled && e?.key.toLowerCase() === cycleKey) {
      cycleModes();
    }
  };

  const onSelectHandler = objects => {
    if (objects?.length > 0) {
      setSelectedModel(objects[0]);
    }
  };

  // Update the transforms object when the selected model changes
  useEffect(() => {
    updateTransforms(selectedModel);
  }, [selectedModel]);

  // Set transform object from prop
  useEffect(() => {
    if (model) {
      const modelObject3D = model?.current || scene?.getObjectByName(model) || null;
      modelObject3D && setSelectedModel(model?.current || model);
    }
  }, [model, scene]);

  // Reset if selected object if children change
  useEffect(() => {
    console.log("loaded");
    setSelectedModel(null);
  }, [children]);

  // Set look at target from prop
  useEffect(() => {
    if (orbit) {
      setLookAtTarget(orbit?.current?.position || orbit?.position || null);
    }
  }, [orbit]);

  // Copy command
  useEffect(() => {
    document.addEventListener("copy", copyTransforms);
    document.addEventListener("keypress", onKeyPressHandler);

    return () => {
      document.removeEventListener("copy", copyTransforms);
      document.removeEventListener("keypress", onKeyPressHandler);
    };
  }, []);

  return (
    <>
      <Select
        onChange={e => enabled && onSelectHandler(e)}
        onDoubleClick={e => enabled && cycleModes()}
        onPointerOver={null}
        onPointerOut={null}
        onPointerMissed={() => {
          setSelectedModel(null);
        }}
        filter={meshes => {
          const mesh = meshes[0];
          let selected = auto || mesh?.controllable ? mesh : null;

          if (!mesh?.controllable) {
            let parent = mesh?.parent;

            for (let layer = 0; layer < layers; layer++) {
              if (parent?.controllable) {
                selected = parent;
                break;
              } else {
                parent = parent?.parent;
              }
            }
          }
          return [selected];
        }}
      >
        {children}
      </Select>

      <TransformControls
        ref={setTransformControlsRef}
        enabled={enabled}
        showX={enabled}
        showY={enabled}
        showZ={enabled}
        object={typeof selectedModel === "string" && scene ? scene.getObjectByName(selectedModel) : selectedModel}
        translationSnap={snap}
        rotationSnap={snap}
        scaleSnap={snap}
        {...props}
      />

      {enabled && (orbit || lookAtTarget) && <OrbitControls target={lookAtTarget} makeDefault />}
    </>
  );
};

export default LayoutControls;
