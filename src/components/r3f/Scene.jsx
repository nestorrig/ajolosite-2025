import {
  CameraControls,
  Float,
  PerspectiveCamera,
  RoundedBox,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import { MathUtils } from "three";
import Caustics from "./caustics/Caustics";
import { CameraRig } from "./components/CameraRig";
import { Floor } from "./components/Floor";
import { Lights } from "./components/Lights";
import { useControls } from "leva";
import { Cubes } from "./components/Cubes";
import { Axolote } from "./components/Axolote";
import { Aws } from "./components/Aws";

function Thing() {
  const size = 100;
  const model = useGLTF("/ajolote_de_minecraft_unico/scene.gltf");
  console.log(model);

  return (
    <>
      <Lights />

      <Caustics>
        {/* <Floor sizeX={size} sizeY={size} rotation-x={-Math.PI / 2} />
        <Floor sizeX={size} sizeY={size} position={[0, size / 2, -size / 2]} />
        <Floor
          sizeX={size}
          sizeY={size}
          position={[size / 2, size / 2, 0]}
          rotation-y={-Math.PI / 2}
        /> */}

        <Float floatIntensity={5} rotationIntensity={2}>
          <Axolote />
        </Float>

        {/* <Float floatIntensity={5} rotationIntensity={2}>
          <Aws position={[-0.5, 0.5, -1.5]} scale={[0.6, 0.6, 0.6]} />
        </Float> */}

        <Float floatIntensity={5} rotationIntensity={2}>
          <Cubes />
        </Float>
      </Caustics>
    </>
  );
}

export function Scene() {
  const fogRef = useRef();
  const colorRef = useRef();

  const { color, controls } = useControls("Scene", {
    color: {
      value: "#7600ad",
      label: "Background Color",
      onChange: (value) => {
        if (colorRef.current) {
          colorRef.current.set(value);
        }
        if (fogRef.current) {
          fogRef.current.color.set(value);
        }
      },
    },
    controls: {
      value: false,
      label: "Enable Camera Controls",
      // onChange: (value) => {
      //   if (value) {
      //     CameraControls.addEventListener("change", () => {});
      //   } else {
      //     CameraControls.removeEventListener("change", () => {});
      //   }
      // },
    },
  });
  return (
    <>
      <fog attach="fog" args={["#7600ad", 0.1, 25]} ref={fogRef} />
      <color attach="background" args={["#7600ad"]} ref={colorRef} />

      <PerspectiveCamera fov={40} position={[-6, 8, 8]} makeDefault />
      {/* <CameraRig /> */}
      {/* <CameraControls /> */}
      {controls ? <CameraControls /> : <CameraRig />}

      <Suspense>
        <Thing />
      </Suspense>
    </>
  );
}
