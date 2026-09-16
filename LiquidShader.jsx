import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { Vector2 } from "three";

// STAGE 6: adds uQuality (1.0 = full, 0.0 = simplified). This is a
// *uniform* branch — the same value for every fragment in the draw call —
// so the GPU doesn't pay a per-pixel divergence cost for the if-checks;
// it just skips the extra instructions entirely on low quality.
//
// Low quality drops from 4 noise layers to 2 and skips the mouse lens,
// used on mobile and automatically when PerformanceMonitor (wired up in
// RecipeBackground.jsx) detects the frame rate struggling.

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uQuality;
  varying vec2 vUv;

  vec3 saffron = vec3(0.95, 0.77, 0.19);
  vec3 tomato  = vec3(1.0, 0.39, 0.28);
  vec3 herb    = vec3(0.31, 0.47, 0.26);
  vec3 cream   = vec3(1.0, 0.99, 0.82);

  float layer(vec2 uv, float freq, float speed, float phase) {
    return sin(uv.x * freq + uTime * speed + phase)
         * cos(uv.y * freq * 0.8 - uTime * speed * 0.7 + phase);
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 uv = vec2(vUv.x * aspect, vUv.y);
    bool highQuality = uQuality > 0.5;

    float n1 = layer(uv, 2.2, 0.15, 0.0);
    float n2 = layer(uv, 3.6, 0.22, 1.3);
    float n3 = 0.0;
    float n4 = 0.0;
    float base;

    if (highQuality) {
      n3 = layer(uv, 5.1, 0.10, 2.6);
      n4 = layer(uv, 1.4, 0.28, 4.0);
      base = (n1 + n2 * 0.6 + n3 * 0.4 + n4 * 0.5) / 2.5;
    } else {
      base = (n1 + n2 * 0.6) / 1.6;
    }
    base = base * 0.5 + 0.5;

    vec3 color = mix(saffron, tomato, base);

    float herbMix = smoothstep(0.35, 0.75, n2 * 0.5 + n4 * 0.5 + 0.5);
    color = mix(color, herb, herbMix * 0.35);

    float creamMix = smoothstep(0.6, 0.95, n1 * 0.5 + n3 * 0.5 + 0.5);
    color = mix(color, cream, creamMix * 0.25);

    if (highQuality) {
      vec2 pixelPos   = vUv * uResolution;
      vec2 mousePixel = uMouse * uResolution;
      float pxDist    = distance(pixelPos, mousePixel);

      float lensRadius = 8.0;
      float lensEdge    = 6.0;

      float lensCore = 1.0 - smoothstep(lensRadius - lensEdge, lensRadius, pxDist);
      color = mix(color, cream, lensCore * 0.55);

      float ring = smoothstep(lensRadius - 1.5, lensRadius, pxDist)
                 - smoothstep(lensRadius, lensRadius + 1.5, pxDist);
      color += ring * 0.3;

      float edgeDist = distance(uMouse, vec2(0.5, 0.5));
      float edgePull = smoothstep(0.15, 0.65, edgeDist);
      color = mix(color, tomato, edgePull * 0.2);
    }

    float breathe = sin(uTime * 0.25) * 0.5 + 0.5;
    color *= 0.95 + breathe * 0.05;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const LiquidMaterial = shaderMaterial(
    {
        uTime: 0,
        uResolution: new Vector2(0, 0),
        uMouse: new Vector2(0.5, 0.5),
        uQuality: 1,
    },
    vertexShader,
    fragmentShader
);

extend({ LiquidMaterial });

export default LiquidMaterial;
