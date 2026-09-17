import { lazy, Suspense, useEffect, useState } from 'react';
// Keep critical components immediate
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";

// Lazy load everything else
const Features = lazy(() => import("./components/Features/Features"));
const HowItWorks = lazy(() => import("./components/HowItWorks/HowItWorks"));
const Testimonials = lazy(() => import("./components/Testimonials/Testimonials"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const Footer = lazy(() => import("./components/Footer/Footer"));

// 🔥 CRITICAL: Lazy load RecipeBackground (contains Three.js)
const RecipeBackground = lazy(() => import("./components/RecipeBackground/RecipeBackground"));


function DeferredBackground() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
            return () => window.cancelIdleCallback(id);
        }
        const id = setTimeout(() => setReady(true), 300);
        return () => clearTimeout(id);
    }, []);

    if (!ready) return null;

    return (
        <Suspense fallback={null}>
            <RecipeBackground />
        </Suspense>
    );
}

function App() {
  return (
    <>
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="liquid-glass"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Now idle-deferred instead of just lazy-loaded */}
      <DeferredBackground />

      <div className="app-content">
        <Navbar />

        <main>
          <Hero />

          {/* Lazy-loaded sections */}
          <Suspense fallback={<div className="loading-skeleton">Loading...</div>}>
            <Features />
            <HowItWorks />
            <Testimonials />
            <Contact />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
}

export default App;
