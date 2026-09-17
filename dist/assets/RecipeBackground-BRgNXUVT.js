import{a as e}from"./rolldown-runtime-B0Z9INg1.js";import{f as t}from"./vendor-BLRrKJar.js";import{r as n}from"./vendor-framer-AT4w4z3i.js";import{a as r,i,n as a,o,r as s,t as c}from"./vendor-three-CYRMLAZd.js";var l=c({uTime:0,uResolution:new o(0,0),uMouse:new o(.5,.5),uQuality:1},`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,`
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
`);s({LiquidMaterial:l});var u=e(t(),1);function d(){let e=(0,u.useRef)({x:.5,y:.5});return(0,u.useEffect)(()=>{function t(t){e.current.x=t.clientX/window.innerWidth,e.current.y=1-t.clientY/window.innerHeight}return window.addEventListener(`pointermove`,t),()=>window.removeEventListener(`pointermove`,t)},[]),e}var f=`(max-width: 768px)`;function p(){let[e,t]=(0,u.useState)(()=>typeof window<`u`&&window.matchMedia(f).matches);return(0,u.useEffect)(()=>{let e=window.matchMedia(f),n=e=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}var m=`(prefers-reduced-motion: reduce)`;function h(){let[e,t]=(0,u.useState)(()=>typeof window<`u`&&window.matchMedia(m).matches);return(0,u.useEffect)(()=>{let e=window.matchMedia(m),n=e=>t(e.matches);return e.addEventListener(`change`,n),()=>e.removeEventListener(`change`,n)},[]),e}var g=n();function _({quality:e,reducedMotion:t}){let n=(0,u.useRef)(),{viewport:a,size:o}=r(),s=d(),c=(0,u.useRef)({x:.5,y:.5}),l=(0,u.useRef)(0);return i(r=>{n.current&&(c.current.x+=(s.current.x-c.current.x)*.15,c.current.y+=(s.current.y-c.current.y)*.15,t||(l.current=r.clock.getElapsedTime()),n.current.uTime=l.current,n.current.uResolution.set(o.width,o.height),n.current.uMouse.set(c.current.x,c.current.y),n.current.uQuality=e)}),(0,g.jsxs)(`mesh`,{scale:[a.width,a.height,1],children:[(0,g.jsx)(`planeGeometry`,{args:[1,1]}),(0,g.jsx)(`liquidMaterial`,{ref:n})]})}function v(){let e=p(),t=h(),n=+!e;return(0,g.jsx)(`div`,{className:`recipe-bg`,"aria-hidden":`true`,children:(0,g.jsx)(a,{dpr:n===1?[1,2]:1,gl:{antialias:n===1},camera:{position:[0,0,1]},children:(0,g.jsx)(_,{quality:n,reducedMotion:t})})})}export{v as default};
//# sourceMappingURL=RecipeBackground-BRgNXUVT.js.map