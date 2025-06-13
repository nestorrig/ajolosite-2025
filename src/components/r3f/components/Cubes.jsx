import { Instances, Instance, Float, RoundedBox } from "@react-three/drei";
import { useControls } from "leva";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

// extender para usar RoundedBoxGeometry
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
extend({ RoundedBoxGeometry });

const cubePositionsAndColorKeys = [
  // Grupo original
  { position: [-2, 0, 0], colorKey: "colorA" },
  { position: [-1, 0, -1], colorKey: "colorA" },
  { position: [-1, 2, 1], colorKey: "colorA" },
  { position: [-3, 0, 1], colorKey: "colorA" },
  { position: [-2, 1, 1], colorKey: "colorB" },
  { position: [-1, 1, 0], colorKey: "colorB" },
  // Grupo desplazado 1
  { position: [-2 + 2, 0 + 2, 0 - 3], colorKey: "colorA" }, // [0, 2, -3]
  { position: [-3 + 2, 0 + 2, -1 - 3], colorKey: "colorA" }, // [1, 2, -3]
  { position: [-1 + 2, 2 + 2, -1 - 3], colorKey: "colorA" }, // [1, 4, -2]
  { position: [-1 + 2, 0 + 2, 1 - 3], colorKey: "colorA" }, // [-1, 2, -2]
  { position: [-1 + 2, 1 + 2, 0 - 3], colorKey: "colorB" }, // [0, 3, -2]
  { position: [-2 + 2, 1 + 2, -1 - 3], colorKey: "colorB" }, // [1, 3, -3]
  // Grupo desplazado 2
  { position: [-2 + 5, 0 + 3, 0 + 3], colorKey: "colorA" }, // [3, 1, 3]
  { position: [-1 + 5, 0 + 3, -1 + 3], colorKey: "colorA" }, // [4, 1, 3]
  { position: [-1 + 5, 2 + 3, 1 + 3], colorKey: "colorA" }, // [4, 3, 4]
  { position: [-3 + 5, 0 + 3, 1 + 3], colorKey: "colorA" }, // [2, 1, 4]
  { position: [-2 + 5, 1 + 3, 1 + 3], colorKey: "colorB" }, // [3, 2, 4]
  { position: [-1 + 5, 1 + 3, 0 + 3], colorKey: "colorB" }, // [4, 2, 3]
  // Duplicados del grupo desplazado 2 (según el código original)
  { position: [-3 - 2, 0 + 1, 1 - 6], colorKey: "colorA" }, // [2, 1, 4]
  { position: [-2 - 2, 1 + 1, 1 - 6], colorKey: "colorB" }, // [3, 2, 4]
  { position: [-1 - 2, 1 + 1, 0 - 6], colorKey: "colorB" }, // [4, 2, 3]
  // Grupo desplazado 3
  { position: [-3 - 4, 0 + 1, 1 + 3], colorKey: "colorA" }, // [-7, 1, 4]
  { position: [-2 - 4, 1 + 1, 1 + 3], colorKey: "colorB" }, // [-6, 2, 4]
  { position: [-1 - 4, 1 + 1, 0 + 3], colorKey: "colorB" }, // [-5, 2, 3]
];

export const Cubes = () => {
  const colors = useControls("Cubes", {
    colorA: {
      value: "#fd8205",
      label: "Color A",
    },
    colorB: {
      value: "#5f7686",
      label: "Color B",
    },
  });

  return (
    <>
      <group position={[4, -1.5, -5]} rotation-y={Math.PI / 3}>
        {cubePositionsAndColorKeys.map((data, i) => {
          const materialRef = useRef();
          const roundedBoxRef = useRef();
          const [isHovered, setIsHovered] = useState(false);

          // Almacena el color original como un objeto THREE.Color
          const originalColor = useMemo(
            () => new THREE.Color(colors[data.colorKey]).multiplyScalar(2),
            [colors, data.colorKey]
          );

          // Define el color objetivo para el estado hover
          const hoverMultiplier = 8; // Factor de multiplicación para el hover, ajústalo a tu gusto
          const hoverColor = useMemo(() => {
            return new THREE.Color(colors[data.colorKey]).multiplyScalar(
              hoverMultiplier
            );
          }, [colors, data.colorKey, hoverMultiplier]);

          useFrame((state, delta) => {
            if (materialRef.current) {
              const targetColor = isHovered ? hoverColor : originalColor;
              // Interpolar suavemente hacia el color objetivo
              materialRef.current.color.lerp(targetColor, delta * 10); // Ajusta el '10' para la velocidad de la animación
            }
            if (roundedBoxRef.current) {
              // Aplicar escala al RoundedBox cuando está en hover
              if (isHovered) {
                roundedBoxRef.current.scale.set(
                  THREE.MathUtils.lerp(
                    roundedBoxRef.current.scale.x,
                    1.2, // Tamaño aumentado al hacer hover
                    delta * 10 // Ajusta la velocidad de la animación
                  ),
                  THREE.MathUtils.lerp(
                    roundedBoxRef.current.scale.y,
                    1.2, // Tamaño aumentado al hacer hover
                    delta * 10 // Ajusta la velocidad de la animación
                  ),
                  THREE.MathUtils.lerp(
                    roundedBoxRef.current.scale.z,
                    1.2, // Tamaño aumentado al hacer hover
                    delta * 10 // Ajusta la velocidad de la animación
                  )
                );
              } else {
                roundedBoxRef.current.scale.set(
                  THREE.MathUtils.lerp(
                    roundedBoxRef.current.scale.x,
                    1, // Tamaño original al salir del hover
                    delta * 10 // Ajusta la velocidad de la animación
                  ),
                  THREE.MathUtils.lerp(
                    roundedBoxRef.current.scale.y,
                    1, // Tamaño original al salir del hover
                    delta * 10 // Ajusta la velocidad de la animación
                  ),
                  THREE.MathUtils.lerp(
                    roundedBoxRef.current.scale.z,
                    1, // Tamaño original al salir del hover
                    delta * 10 // Ajusta la velocidad de la animación
                  )
                );
              }
            }
          });

          const handleHoverEnter = (event) => {
            event.stopPropagation(); // Buena práctica para evitar que el evento se propague
            setIsHovered(true);
            document.body.style.cursor = "pointer";
          };

          const handleHoverLeave = (event) => {
            setIsHovered(false);
            document.body.style.cursor = "default";
          };

          return (
            <Float key={i} floatIntensity={1} rotationIntensity={0.2}>
              <RoundedBox
                position={[...data.position]}
                args={[1, 1, 1]}
                radius={0.05}
                smoothness={4}
                onPointerEnter={handleHoverEnter}
                onPointerLeave={handleHoverLeave}
                ref={roundedBoxRef}
              >
                <meshPhysicalMaterial
                  ref={materialRef}
                  roughness={0.1}
                  color={colors[data.colorKey]}
                />
              </RoundedBox>
            </Float>
          );
        })}
      </group>
    </>
  );
};
//! instances coustics don't work with instances
// export const Cubes = () => {
//   const colors = useControls("Cubes", {
//     colorA: {
//       value: "#fd8205",
//       label: "Color A",
//     },
//     colorB: {
//       value: "#5f7686",
//       label: "Color B",
//     },
//   });

//   return (
//     <>
//       <group position={[5, -1.5, -6]} rotation-y={Math.PI / 4}>
//         <Instances
//           limit={cubePositionsAndColorKeys.length}
//           castShadow
//           receiveShadow
//         >
//           {/* <RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4}> */}
//           {/* <boxGeometry args={[1, 1, 1]} /> */}
//           <roundedBoxGeometry args={[1, 1, 1]} radius={0.05} smoothness={4} />
//           <meshPhysicalMaterial roughness={0.1} />

//           {/* </RoundedBox> */}
//           {cubePositionsAndColorKeys.map((data, i) => {
//             console.log(data);

//             return (
//               <Float key={i} floatIntensity={1} rotationIntensity={0.2}>
//                 <Instance
//                   receiveShadow
//                   castShadow
//                   color={colors[data.colorKey]}
//                   position={data.position}
//                 />
//               </Float>
//             );
//           })}
//         </Instances>
//       </group>
//     </>
//   );
// };
