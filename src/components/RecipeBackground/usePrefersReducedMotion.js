import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the user has requested reduced motion at the OS/browser level.
 * RecipeBackground uses this to freeze the shader's time uniform instead
 * of animating it. The mouse lens still responds even when this is true —
 * that's motion the user directly initiates, not autoplaying motion, so
 * it's not the kind of thing prefers-reduced-motion is meant to suppress.
 */
function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(
        () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
    );

    useEffect(() => {
        const mql = window.matchMedia(QUERY);
        const handleChange = (e) => setReduced(e.matches);
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return reduced;
}

export default usePrefersReducedMotion;
