import { useEffect, useRef } from "react";

/**
 * Tracks the raw (unsmoothed) pointer position as a ref — normalized to
 * 0-1 and flipped on Y to match GL UV space (origin bottom-left).
 *
 * Returns a ref, not state, so pointer movement never triggers a React
 * re-render. Smoothing happens where it's consumed (inside useFrame in
 * RecipeBackground), since that loop is already running every frame —
 * no need for a second animation loop here.
 */
function useMousePosition() {
    const mouse = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        function handleMove(e) {
            mouse.current.x = e.clientX / window.innerWidth;
            mouse.current.y = 1 - e.clientY / window.innerHeight;
        }
        window.addEventListener("pointermove", handleMove);
        return () => window.removeEventListener("pointermove", handleMove);
    }, []);

    return mouse;
}

export default useMousePosition;
