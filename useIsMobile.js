import { useEffect, useState } from "react";

const QUERY = "(max-width: 768px)";

/**
 * True at or below the mobile breakpoint. Used to drop the shader to a
 * simplified 2-layer version, skip the mouse lens (no real hover on
 * touch anyway), and cap dpr — phones often have both smaller GPUs and
 * higher device pixel ratios, a costly combination for a full-screen
 * fragment shader.
 */
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
    );

    useEffect(() => {
        const mql = window.matchMedia(QUERY);
        const handleChange = (e) => setIsMobile(e.matches);
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return isMobile;
}

export default useIsMobile;
