import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useState } from "react";
// si es mobile usar el giroscopio
export function CameraRig() {
  const { camera, pointer, viewport } = useThree();
  // si es mobile usar el giroscopio
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useFrame((state, delta) => {
    // if (isMobile) {
    //   // Use device orientation for mobile
    //   const { alpha, beta } = state.pointer;
    //   camera.position.set(-5 + (alpha * viewport.width) / 3, (4 + beta) / 2, 5);
    // } else {
    easing.damp3(
      state.camera.position,
      [
        -3 + (state.pointer.x * state.viewport.width) / 6,
        (4 + state.pointer.y) / 2,
        5,
      ],
      0.5,
      delta
    );
    // }

    state.camera.lookAt(0, 1, 0);
  });
}
