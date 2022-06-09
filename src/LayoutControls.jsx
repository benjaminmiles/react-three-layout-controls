import { useEffect, useCallback, useState, useRef } from "react";
import { TransformControls, OrbitControls, Select } from "@react-three/drei";
import { Vector3 } from "three";

function useTransformControls(onMount, onUnmount) {
  const nodeRef = useRef(null);

  const setNodeRef = useCallback(
    (node) => {
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
  autoSelect = true,
  children,
  copyFormat = "props", // "props" || "arrays" || "vectors"
  copyPoints = 3,
  cycleKey = "t",
  enabled = true,
  layers = 100,
  selectedModel: model,
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
  const selectRef = useRef();

  const [selectedModel, setSelectedModel] = useState(null);
  const [lookAtTarget, setLookAtTarget] = useState(null);

  const [transformControlsRef, setTransformControlsRef] = useTransformControls(
    (node) => node.addEventListener("objectChange", updateTransforms),
    (node) => node.removeEventListener("objectChange", updateTransforms)
  );

  const searchForObjectByName = useCallback(
    (name) => {
      if (typeof name !== "string") {
        return null;
      } else if (scene?.current) {
        return scene.current.getObjectByName(name);
      } else if (selectRef?.current) {
        return selectRef.current.getObjectByName(name);
      }

      return null;
    },
    [selectedModel]
  );

  const toFixedNumber = function (float = 0.0, decimals = 3, base = 10) {
    let power = Math.pow(base || 10, decimals);
    return Math.round(parseFloat(float) * power) / power;
  };

  const copyTransforms = (e) => {
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

  const updateTransforms = useCallback(
    (o) => {
      const { position, rotation, scale } = transforms.current;
      const object = o?.target?.object || o?.current || o || null;

      if (object) {
        position.copy(object.position);
        rotation.copy(object.rotation);
        scale.copy(object.scale);

        position.set(toFixedNumber(position.x, copyPoints), toFixedNumber(position.y, copyPoints), toFixedNumber(position.z, copyPoints));
        rotation.set(toFixedNumber(rotation.x, copyPoints), toFixedNumber(rotation.y, copyPoints), toFixedNumber(rotation.z, copyPoints));
        scale.set(toFixedNumber(scale.x, copyPoints), toFixedNumber(scale.y, copyPoints), toFixedNumber(scale.z, copyPoints));

        transforms.current.name = object.name;
        transforms.current.values = {
          position: position.toArray(),
          rotation: rotation.toArray(),
          scale: scale.toArray(),
        };
        transforms.current.props = `position={[${position.toArray()}]} rotation={[${rotation.toArray()}]} scale={[${scale.toArray()}]}`;
      }
    },
    [copyPoints]
  );

  const cycleModes = () => {
    mode.current = (mode.current + 1) % modes.length;
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(modes[mode.current]);
    }
  };

  const onKeyPressHandler = (e) => {
    if (enabled && e?.key.toLowerCase() === cycleKey) {
      cycleModes();
    }
  };

  const onSelectHandler = (objects) => {
    if (objects?.length > 0) {
      setSelectedModel(objects[0]);
    }
  };

  // Update the transforms object when the selected model changes
  useEffect(() => {
    if (selectedModel) {
      updateTransforms(selectedModel);
    } else {
      if (transformControlsRef.current) {
        transformControlsRef.current.detach();
      }
    }
  }, [selectedModel]);

  // Set transform object from prop
  useEffect(() => {
    if (enabled && model) {
      const modelObject3D = model?.current || searchForObjectByName(model) || undefined;
      modelObject3D && setSelectedModel(modelObject3D);
    } else {
      setSelectedModel(undefined);
    }

    if (orbit) {
      setLookAtTarget(orbit?.current?.position || orbit?.position || undefined);
    }
  }, [children, enabled, model, scene, orbit]);

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
      {enabled ? (
        <>
          <TransformControls
            ref={setTransformControlsRef}
            enabled={enabled}
            showX={enabled}
            showY={enabled}
            showZ={enabled}
            object={searchForObjectByName(selectedModel) || selectedModel}
            translationSnap={snap}
            rotationSnap={snap}
            scaleSnap={snap}
            {...props}
          />
          <Select
            onChange={(e) => enabled && onSelectHandler(e)}
            onDoubleClick={(e) => enabled && cycleModes()}
            onPointerOver={null}
            onPointerOut={null}
            onPointerMissed={() => {
              setSelectedModel(null);
            }}
            filter={(meshes) => {
              const mesh = meshes[0];
              let selected = autoSelect || mesh?.controllable ? mesh : null;

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
            <group ref={selectRef}>{children}</group>
          </Select>
          {(orbit || lookAtTarget) && <OrbitControls target={lookAtTarget} makeDefault />}
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default LayoutControls;
