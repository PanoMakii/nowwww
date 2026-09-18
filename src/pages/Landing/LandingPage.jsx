import { lazy, Suspense } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';

// Lazy load section components for performance
const Features = lazy(() => import('../../components/Features/Features'));
const HowItWorks = lazy(() => import('../../components/HowItWorks/HowItWorks'));
const Testimonials = lazy(() => import('../../components/Testimonials/Testimonials'));
const Contact = lazy(() => import('../../components/Contact/Contact'));
const Footer = lazy(() => import('../../components/Footer/Footer'));
const RecipeBackground = lazy(() => import('../../components/RecipeBackground/RecipeBackground'));

export default function LandingPage() {
  return (
    <>
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
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

      <Suspense fallback={null}>
        <RecipeBackground />
      </Suspense>

      <div className="app-content">
        <Navbar />

        <main>
          <Hero />

          <Suspense fallback={null}>
            <Features />
          </Suspense>
          <Suspense fallback={null}>
            <HowItWorks />
          </Suspense>
          <Suspense fallback={null}>
            <Testimonials />
          </Suspense>
          <Suspense fallback={null}>
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
