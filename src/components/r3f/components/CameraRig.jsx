import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useState } from "react";

export function CameraRig() {
  useFrame((state, delta) => {
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
