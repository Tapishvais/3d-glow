import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scroll'

const NOISE = `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const VERTEX = `
uniform float uTime;
uniform vec2 uCursor;
uniform float uVel;
varying vec3 vNormal;
varying vec3 vPos;
varying float vDisp;
${NOISE}
void main() {
  vec3 dir = normalize(position);
  float n = snoise(dir * 1.8 + uTime * 0.22);
  float n2 = snoise(dir * 4.5 - uTime * 0.15) * 0.35;
  vec3 cursorDir = normalize(vec3(uCursor * 2.2, 1.2));
  float cursorInf = pow(max(dot(dir, cursorDir), 0.0), 3.0);
  float amp = 0.32 + abs(uVel) * 0.55;
  float d = (n + n2) * amp + cursorInf * 0.55;
  vec3 p = position + normal * d;
  vDisp = d;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const FRAGMENT = `
uniform vec3 uBase;
uniform vec3 uAccent;
uniform vec3 uCrimson;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPos;
varying float vDisp;
void main() {
  vec3 viewDir = normalize(-vPos);
  float fres = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.1);
  vec3 col = mix(uBase, uAccent, fres);
  float iri = sin(fres * 6.2831 + uTime * 0.5 + vDisp * 4.0) * 0.5 + 0.5;
  col = mix(col, uCrimson, iri * fres * 0.32);
  col += vec3(0.05, 0.06, 0.12) * smoothstep(0.15, 0.9, vDisp);
  gl_FragColor = vec4(col, 1.0);
}
`

function Blob() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const mouse = useRef(new THREE.Vector2(0, 0))
  const isMobile = useMemo(() => window.innerWidth < 1024, [])

  useEffect(() => {
    const fn = (e: PointerEvent) => {
      mouse.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
    }
    window.addEventListener('pointermove', fn, { passive: true })
    return () => window.removeEventListener('pointermove', fn)
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCursor: { value: new THREE.Vector2() },
      uVel: { value: 0 },
      uBase: { value: new THREE.Color('#121833') },
      uAccent: { value: new THREE.Color('#3D5CFF') },
      uCrimson: { value: new THREE.Color('#FF2D62') },
    }),
    [],
  )

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    if (mat.current) {
      const u = mat.current.uniforms
      u.uTime.value += d * (1 + Math.min(Math.abs(scrollState.velocity) * 0.09, 1.4))
      u.uCursor.value.lerp(mouse.current, 0.055)
      const targetVel = scrollState.velocity / 30
      u.uVel.value += (targetVel - u.uVel.value) * 0.07
    }
    if (mesh.current) {
      mesh.current.rotation.y += d * 0.09
      mesh.current.rotation.x += d * 0.035
    }
  })

  return (
    <mesh ref={mesh} position={isMobile ? [0, 0.9, 0] : [1.1, 0, 0]}>
      <icosahedronGeometry args={[2.1, isMobile ? 24 : 64]} />
      <shaderMaterial ref={mat} vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} />
    </mesh>
  )
}

export default function BlobScene({ active }: { active: boolean }) {
  return (
    <Canvas
      data-testid="hero-webgl-canvas"
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      eventSource={undefined}
    >
      <Blob />
    </Canvas>
  )
}
