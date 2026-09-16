import "./RecipeBackground.css";
import "./LiquidShader";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import useMousePosition from "./useMousePosition";
import useIsMobile from "./useIsMobile";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

function LiquidPlane({ quality, reducedMotion }) {
    const materialRef = useRef();
    const { viewport, size } = useThree();
    const mouseTarget = useMousePosition();
    const smoothedMouse = useRef({ x: 0.5, y: 0.5 });
    const frozenTime = useRef(0);

    useFrame((state) => {
        if (!materialRef.current) return;

        // lerp toward the raw pointer target — smooths out jitter without
        // fully eliminating the catch-up delay. 0.15 settles in ~200ms;
        // raise toward 0.3 for near-instant, lower for a dreamier drift.
        smoothedMouse.current.x +=
            (mouseTarget.current.x - smoothedMouse.current.x) * 0.15;
        smoothedMouse.current.y +=
            (mouseTarget.current.y - smoothedMouse.current.y) * 0.15;

        if (!reducedMotion) {
            frozenTime.current = state.clock.getElapsedTime();
        }

        materialRef.current.uTime = frozenTime.current;
        materialRef.current.uResolution.set(size.width, size.height);
        materialRef.current.uMouse.set(
            smoothedMouse.current.x,
            smoothedMouse.current.y
        );
        materialRef.current.uQuality = quality;
    });

    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <liquidMaterial ref={materialRef} />
        </mesh>
    );
}

function RecipeBackground() {
    const isMobile = useIsMobile();
    const reducedMotion = usePrefersReducedMotion();

    // Quality is tied directly to device tier — no runtime auto-downgrade.
    // (PerformanceMonitor lived here originally, but its ~2.5s warm-up
    // window was reading normal page-load jank as declining performance
    // and permanently dropping quality afterward — killing the mouse
    // lens a few seconds after every reload, with no way to recover
    // since the real cost driving any slowdown is the stacked
    // backdrop-filter blur on the DOM side, not this shader.)
    const quality = isMobile ? 0 : 1;

    return (
        <div className="recipe-bg" aria-hidden="true">
            <Canvas
                dpr={quality === 1 ? [1, 2] : 1}
                gl={{ antialias: quality === 1 }}
                camera={{ position: [0, 0, 1] }}
            >
                <LiquidPlane quality={quality} reducedMotion={reducedMotion} />
            </Canvas>
        </div>
    );
}

export default RecipeBackground;
