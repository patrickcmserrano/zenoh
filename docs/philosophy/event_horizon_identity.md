# Nexus Quantitative — Technical Visual Identity Document

> **Purpose:** This document gives a future AI agent or developer session enough context to replicate (not copy) the visual effect and identity of this website. It covers the animated background system, visual language, shader logic, color system, and component architecture.

---

## 1. Core Visual Concept

The site's visual identity is built around a **"quantum/event-horizon" aesthetic**: the feeling of staring into deep space or at the edge of a black hole. Key design decisions all serve this concept:

- Pure black void as the base layer
- Very low-opacity, glowing topographic mesh floating in the background
- Neon cyan and violet as the primary accent colors
- Slow, meditative animation — nothing is fast or distracting
- Scientific / monospace typography to reinforce a quant/tech persona

The name **"Event Horizon"** is literal — the animated background is named `EventHorizonBackground` and represents the undulating surface of spacetime near a gravitational singularity.

---

## 2. Background Animation — `EventHorizonBackground`

**File:** `src/lib/EventHorizonBackground.svelte`  
**Renderer:** Three.js WebGL with custom ShaderMaterial  
**Effect:** Animated wireframe topography using Perlin 3D noise

### 2.1 Scene Setup

```typescript
// Scene
scene.background = new THREE.Color("#000000"); // void black

// Camera — positioned to look at the plane from a low angle
camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, -10, 10); // slightly below and forward
camera.lookAt(0, 0, 0);

// Geometry — large plane, high subdivision for smooth deformation
const geometry = new THREE.PlaneGeometry(60, 60, 128, 128);

// Mesh tilt — angled like a floor/horizon
mesh.rotation.x = -Math.PI / 2 - 0.4; // ~112.9 degrees
```

The plane is large (60x60 units) with 128x128 subdivisions to allow smooth, fine-grained vertex displacement by the noise function. The mesh is rotated to appear as a flat surface viewed from a low angle — like a floor or a landscape horizon.

### 2.2 Vertex Shader — Perlin Noise Displacement

The vertex shader uses **Classic Perlin 3D Noise** (Stefan Gustavson's implementation) to displace vertices along the Z axis, creating the animated topographic wave effect.

```glsl
// Key parameters
float noiseFreq = 0.4;  // wavelength: lower = broader waves
float noiseAmp  = 2.5;  // height: controls peak-to-trough distance

// Time drives the animation — extremely slow (0.05 multiplier)
float elevation = cnoise(vec3(
    pos.x * noiseFreq + uTime * 0.05,  // X scrolls slowly with time
    pos.y * noiseFreq,                  // Y is static (no Y drift)
    0.0                                 // Z fixed (2D slice of 3D noise)
)) * noiseAmp;
```

**Why uTime * 0.05?** The original value was 0.3 — six times faster. It was dialed down to 0.05 to make the animation feel geological rather than liquid. This is a critical tuning decision for the "meditative, cosmic" feeling.

#### Mouse Gravity Well

```glsl
// Distance from current UV to mouse UV position
float dist = distance(vUv, uHover);

// Gaussian-shaped depression — pulls surface down under cursor
float gravity = (1.0 - smoothstep(0.0, 0.1, dist)) * 1.0 * uHoverState;

// Subtract = push down (gravity well / depression)
elevation -= gravity;
```

Parameters:
- Radius: `0.1` UV units — small, localized depression
- Intensity: `1.0` — modest, subtle dip (was originally 5.0, dialed back significantly)
- `uHoverState`: binary 0.0/1.0, set by raycaster intersection check each frame

### 2.3 Fragment Shader — Color and Opacity

```glsl
void main() {
    // Horizontal gradient: purple (left) → cyan (right)
    vec3 mixedColor = mix(uColorStart, uColorEnd, vUv.x);
    
    // Peak brightness — subtle white highlights on tall waves
    float peaks = smoothstep(1.5, 3.5, vElevation);
    mixedColor += vec3(peaks * 0.3);  // 30% white at peaks
    
    // Radial fade — edges fully transparent, center visible
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.0, 0.8, 1.0 - dist);
    
    // Final: VERY low global opacity
    gl_FragColor = vec4(mixedColor, alpha * 0.15);
}
```

Key values:
- `uColorStart`: `#5a189a` (medium purple — bright enough for bloom to catch)
- `uColorEnd`: `#00b4d8` (medium cyan — same reasoning)
- Global alpha: **0.15** — the mesh is nearly transparent, just ghosting
- Peak whitening: **0.3** — very subtle starlight effect on wave crests

Note: The scene colors object uses **much darker** versions (`#240046`, `#003F4C`) for the scene background interpolation, not the shader uniforms. The shader uniforms use mid-tones because UnrealBloom amplifies them.

### 2.4 Post-Processing — UnrealBloom

```typescript
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.2,  // strength — very low, just a hint of glow
    0.5,  // radius
    0.2,  // threshold — only brightest areas bloom
);
```

The bloom is deliberately subtle. It makes the wireframe lines appear to emit a faint glow without creating a jarring bright effect. The goal is to suggest luminescence rather than scream it.

### 2.5 Interaction — Scroll and Mouse

```typescript
// Scroll: tilt the mesh slightly more as user scrolls down
// Creates a subtle "diving in" feeling
mesh.rotation.x = -Math.PI / 2 - 0.4 - scrollY * 0.0002;

// Mouse: raycaster detects mesh intersection, updates UV uniform
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObject(mesh);
if (intersects.length > 0) {
    material.uniforms.uHover.value.set(intersects[0].uv.x, intersects[0].uv.y);
    material.uniforms.uHoverState.value = 1.0;
} else {
    material.uniforms.uHoverState.value = 0.0;
}
```

### 2.6 Canvas Placement

```html
<canvas
    class="fixed inset-0 w-full h-full pointer-events-none z-0"
    style="background-color: #000000;"
></canvas>
```

Fixed, full-screen, z-index 0, no pointer events. It's purely visual and never intercepts user interaction.

---

## 3. Secondary Background — `ThreeBackground` (Particle Stars)

**File:** `src/lib/ThreeBackground.svelte`  
**Status:** Available but not used on the default homepage (was replaced by EventHorizonBackground)

### Setup

```typescript
// 1500 particles distributed in a sphere of radius 40
const positions = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
    const r = Math.random() * 40;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
}

// Cyan points, semi-transparent
const material = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
});

// Animation
particles.rotation.y += 0.001;  // slow spin
```

Mouse parallax:
```typescript
targetX = mouseX * 0.5;
particles.rotation.y += 0.05 * (targetX - particles.rotation.y); // smooth lerp
```

---

## 4. Tertiary Scene — `BlackHoleSimulation`

**File:** `src/lib/BlackHoleSimulation.svelte`  
**Route:** `#/blackhole`  
**Status:** Dedicated page, replaces main background when active

This is the most technically complex scene. It combines multiple Three.js objects with custom shaders.

### 4.1 Starfield

```typescript
// 3000 white stars spread across 150-unit sphere
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    transparent: true,
    opacity: 0.8,
});
```

### 4.2 Black Hole Core

```typescript
// Opaque black sphere — the event horizon itself
const coreGeo = new THREE.SphereGeometry(2, 64, 64);
const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
```

### 4.3 Photon Ring (Fresnel Shader)

```glsl
// Fragment shader — simulates photon ring at event horizon boundary
float fresnel = pow(1.0 - dot(normal, viewDir), 6.0);
float ring = smoothstep(0.4, 0.9, fresnel);
gl_FragColor = vec4(1.0, 0.7, 0.3, ring);  // warm orange-white glow

// Additive blending to make it glow through other objects
```

### 4.4 Accretion Disk

Built as a shader-based ring mesh (torus-like geometry). Uses **Simplex 3D Noise** for gas flow simulation.

```glsl
// Spiral pattern: rotate faster at inner radius
float spiralAngle = angle + r * 8.0 + uTime * 0.4;

// Multi-octave noise for gas turbulence
float n = snoise(vec3(cos(spiralAngle) * r, sin(spiralAngle) * r, uTime * 0.2))
        + 0.5 * snoise(vec3(...));  // second octave at higher frequency

// Temperature-based color: hot core → cool edges
vec3 colorHot  = vec3(5.0, 3.5, 1.5);   // bright white-yellow
vec3 colorCool = vec3(1.2, 0.3, 0.1);   // red-orange

float heat = smoothstep(0.5, 0.29, r);  // hotter toward center
vec3 finalColor = mix(colorCool, colorHot, heat * intensity);

// Cutout: discard inner portion (inside event horizon)
if (r < 0.28) discard;
```

Post-processing for black hole scene is more aggressive:
```typescript
bloomPass = new UnrealBloomPass(resolution, 1.5, 0.0, 0.0);
// strength: 1.5, threshold: 0.0 (bloom everything bright)
```

---

## 5. Color System

### Design Token Palette

| Token | Hex | Role |
|---|---|---|
| `--color-void-black` | `#000000` | Background base |
| `--color-deep-abyss` | `#050508` | Slightly elevated black |
| `--color-quantum-cyan` | `#00F0FF` | Primary accent, glow, highlights |
| `--color-electric-blue` | `#4CC9F0` | Secondary text, secondary accent |
| `--color-synth-violet` | `#7209B7` | Gradient left anchor |
| `--color-magenta-neon` | `#F72585` | Gradient middle, hover states |
| `--color-starlight-white` | `#FFFFFF` | Primary text |
| `--color-ghost-grey` | `#333333` | Borders, dividers, scrollbar |

### Semantic Mappings

```css
--color-bg-primary:    var(--color-void-black);
--color-text-primary:  var(--color-starlight-white);
--color-text-secondary: var(--color-electric-blue);
--color-accent:        var(--color-quantum-cyan);
```

### Signature Gradient

The **Nexus gradient** flows: purple → magenta → cyan (left to right).

```css
.text-gradient-nexus {
    background: linear-gradient(
        to right,
        #7209B7,  /* synth-violet */
        #F72585,  /* magenta-neon */
        #00F0FF   /* quantum-cyan */
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

Used for brand name, section headers, key callouts.

### Selection Highlight

```css
::selection {
    background: #00F0FF;  /* quantum-cyan */
    color: #000000;       /* void-black */
}
```

---

## 6. Typography

### Fonts

| Font | Use |
|---|---|
| **JetBrains Mono** | H1–H6, `.font-mono`, all headings |
| **Inter** | Body text, paragraphs, UI labels |

The monospace font for all headings is a strong identity signal — it reads as technical, precise, and code-adjacent. Paired with the dark background, it creates a "terminal from the future" feel.

### Animations

#### Pulse-Glow (neon breathing effect)

```css
@keyframes pulse-glow {
    0%, 100% {
        opacity: 1;
        text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);  /* cyan glow */
    }
    50% {
        opacity: 0.8;
        text-shadow: 0 0 20px rgba(247, 37, 133, 0.5); /* magenta glow */
    }
}

.animate-pulse-glow {
    animation: pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

The color oscillates between cyan and magenta — the two poles of the gradient. Duration 3s is slow enough to be ambient rather than distracting.

#### Neon Border

```css
.neon-border {
    box-shadow:
        0 0 5px var(--color-quantum-cyan),
        inset 0 0 5px var(--color-quantum-cyan);
}
```

Used for card borders, dividers, interactive elements.

---

## 7. Component Architecture

### Routing (hash-based)

```svelte
<!-- App.svelte — simplified -->
{#if hash !== "#/blackhole"}
    <EventHorizonBackground />  <!-- always behind everything -->
{/if}

{#if hash === "#/presentation"}
    <Presentation />
{:else if hash === "#/blackhole"}
    <BlackHoleSimulation />
{:else}
    <Hero />
    <Philosophy />
    <Stack />
    <Metrics />
    <Footer />
{/if}
```

Three distinct page modes:
1. **Default** — hero/portfolio landing with EventHorizon background
2. **#/presentation** — fullscreen slide deck with 3D components
3. **#/blackhole** — standalone black hole physics simulation

### 3D Presentation Components

Used in the slide deck (`#/presentation`):

| Component | Effect | Key Tech |
|---|---|---|
| `MindsetObject` | Torus knot — wireframe that reveals solid on hover | `TorusKnotGeometry(10, 3, 200, 32, 2, 3)`, dual mesh |
| `DataRefinery3D` | Particle state machine — chaos → order | 150 particles, color transitions, velocity phases |
| `ReactorCore` | Three-module interactive system | Particle flows, mode switching, shield reactions |
| `DualArchitecture` | Architecture diagram | SVG/canvas hybrid |
| `BlackHoleSimulation` | Physics black hole | Full shader pipeline |

---

## 8. Replication Guide

To recreate this visual identity in a different project:

### Minimum viable background

1. Set page background to `#000000`
2. Create a Three.js WebGL canvas, fixed, full-screen, `z-index: 0`, `pointer-events: none`
3. Create a `PlaneGeometry` (large, ~50–80 units, 100+ subdivisions each axis)
4. Write a ShaderMaterial using Perlin 3D noise for vertex displacement:
   - Noise frequency: 0.3–0.5 (lower = broader, more geological waves)
   - Noise amplitude: 2–4 (taller = more dramatic topography)
   - Time multiplier: 0.03–0.08 (very slow — this is critical)
5. Fragment shader: horizontal gradient from `#5a189a` → `#00b4d8`, global alpha ~0.10–0.20
6. Tilt the plane: `mesh.rotation.x = -Math.PI / 2 - 0.3 to -0.5`
7. Position camera at y=-10, z=10, looking at origin
8. Add UnrealBloom with strength 0.1–0.3 (very subtle)

### Color palette to port

```
Background: #000000
Primary accent: #00F0FF
Secondary: #4CC9F0
Gradient: #7209B7 → #F72585 → #00F0FF
Text: #FFFFFF
```

### Typography rule

- **Monospace (JetBrains Mono or similar) for all headings** — non-negotiable for the identity
- Sans-serif (Inter or similar) for body text
- Cyan glow (`text-shadow: 0 0 10px rgba(0,240,255,0.5)`) on key accent text

### Design language rules

1. Everything dark — no light UI elements except text and glowing accents
2. Slow animations — if something feels slow enough, halve the speed
3. Use additive blending (`THREE.AdditiveBlending`) for any glowing/particle effects
4. Gradients always go violet → magenta → cyan (never reversed)
5. Wireframe for 3D objects by default, solid only on interaction (hover/focus)
6. Low global opacity for background elements — content must always be readable

---

## 9. Dependencies

```json
{
    "three": "^0.182.0",
    "svelte": "^5.x",
    "tailwindcss": "^4.x"
}
```

Three.js modules used:
- `three/examples/jsm/postprocessing/EffectComposer`
- `three/examples/jsm/postprocessing/RenderPass`
- `three/examples/jsm/postprocessing/UnrealBloomPass`
- `three/examples/jsm/controls/OrbitControls` (black hole page only)
- `THREE.ShaderMaterial`, `THREE.PlaneGeometry`, `THREE.Raycaster`

---

## 10. Key Design Decisions and Why

| Decision | Reason |
|---|---|
| `uTime * 0.05` (very slow animation) | Meditative, cosmic feel. Anything faster reads as "loading spinner energy" not "deep space" |
| Global alpha 0.15 on background | Text must be fully readable. Background is atmospheric, never competing |
| Wireframe mode on `ShaderMaterial` | Shows the geometry structure, reinforces the "underlying mathematical fabric" metaphor |
| JetBrains Mono for headings | Signals quantitative/technical precision. Not a stylistic choice — it's a message |
| UnrealBloom strength 0.2 | Glow must be felt, not seen. If the bloom is visible as a distinct effect, it's too strong |
| Gradient: violet → magenta → cyan | Represents the spectral energy progression (infrared → visible → UV). Scientifically motivated aesthetics |
| Mouse gravity well (radius 0.1) | Tiny, subtle — user must be close to see it. Rewards attention without demanding it |
| Hash-based routing | SPA with no page loads; all transitions are visual/animated |

---

*Generated from codebase analysis on 2026-04-09.*
