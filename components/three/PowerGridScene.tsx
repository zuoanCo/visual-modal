
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Center } from '@react-three/drei';
import * as THREE from 'three';

// --- Constants ---
// World Countries GeoJSON (Low res for context)
const WORLD_GEOJSON_URL = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson';
// China Provinces GeoJSON (High res for detail)
const CHINA_GEOJSON_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';

const EARTH_RADIUS = 30;

// --- Math Helpers ---

/**
 * Convert Geographic coordinates (Lon, Lat) to 3D Vector on a Sphere
 */
const lonLatToVector3 = (lon: number, lat: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
};

// --- Components ---

/**
 * The base dark sphere representing the planet surface (void)
 */
const BaseGlobe = () => {
    return (
        <mesh>
            <sphereGeometry args={[EARTH_RADIUS - 0.1, 64, 64]} />
            <meshPhysicalMaterial 
                color="#020617" // Deep dark blue/black
                roughness={0.7}
                metalness={0.1}
                emissive="#0f172a"
                emissiveIntensity={0.1}
            />
        </mesh>
    )
}

/**
 * Renders Borders on the Sphere
 */
const BorderLines: React.FC<{ feature: any; color: string; opacity: number; radiusOffset?: number }> = ({ feature, color, opacity, radiusOffset = 0 }) => {
    const lines = useMemo(() => {
        const paths: THREE.Vector3[][] = [];
        const geometry = feature.geometry;
        if (!geometry || !geometry.coordinates) return [];

        const coordinates = geometry.type === 'MultiPolygon' 
            ? geometry.coordinates 
            : [geometry.coordinates];

        coordinates.forEach((polygon: any[]) => {
            polygon.forEach((ring: any[]) => {
                const points: THREE.Vector3[] = [];
                // Sampling step: 1 for World (low res), 2 for China (high res data needs optimization)
                const step = radiusOffset > 0 ? 5 : 1; 
                for(let i=0; i<ring.length; i+=step) {
                    const [lon, lat] = ring[i];
                    const vec = lonLatToVector3(lon, lat, EARTH_RADIUS + radiusOffset);
                    points.push(vec);
                }
                paths.push(points);
            });
        });
        return paths;
    }, [feature, radiusOffset]);

    return (
        <group>
            {lines.map((path, i) => (
                <line key={i}>
                    <bufferGeometry>
                        <bufferAttribute 
                            attach="attributes-position" 
                            count={path.length} 
                            array={new Float32Array(path.flatMap(v => [v.x, v.y, v.z]))} 
                            itemSize={3} 
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color={color} opacity={opacity} transparent linewidth={1} />
                </line>
            ))}
        </group>
    );
};

/**
 * Animated Power Transmission Lines (HVDC)
 */
const SphericalPowerLine = ({ startLon, startLat, endLon, endLat, color }: { startLon: number, startLat: number, endLon: number, endLat: number, color: string }) => {
    const points = useMemo(() => {
        const p1 = lonLatToVector3(startLon, startLat, EARTH_RADIUS);
        const p2 = lonLatToVector3(endLon, endLat, EARTH_RADIUS);

        const midVec = p1.clone().add(p2).normalize();
        const dist = p1.distanceTo(p2);
        
        // Arc height relative to distance
        const arcHeight = EARTH_RADIUS + 2 + (dist * 0.5);
        const control = midVec.multiplyScalar(arcHeight);

        const curve = new THREE.QuadraticBezierCurve3(p1, control, p2);
        return curve.getPoints(50);
    }, [startLon, startLat, endLon, endLat]);

    const particleRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (particleRef.current) {
            const t = (clock.getElapsedTime() * 0.5) % 1;
            const idx = Math.floor(t * (points.length - 1));
            particleRef.current.position.copy(points[idx]);
        }
    });

    return (
        <group>
            {/* Guide Line */}
            <line>
                <bufferGeometry>
                    <bufferAttribute 
                        attach="attributes-position" 
                        count={points.length} 
                        array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))} 
                        itemSize={3} 
                    />
                </bufferGeometry>
                <lineBasicMaterial color={color} opacity={0.2} transparent />
            </line>
            {/* Moving Packet */}
            <mesh ref={particleRef}>
                <sphereGeometry args={[0.3]} />
                <meshBasicMaterial color={color} toneMapped={false} />
                <pointLight color={color} distance={5} intensity={2} />
            </mesh>
        </group>
    )
}

const WorldGlobeScene = () => {
  const [worldData, setWorldData] = useState<any>(null);
  const [chinaData, setChinaData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
        fetch(WORLD_GEOJSON_URL).then(res => res.json()),
        fetch(CHINA_GEOJSON_URL).then(res => res.json())
    ])
    .then(([world, china]) => {
        setWorldData(world);
        setChinaData(china);
    })
    .catch(err => {
        console.error(err);
        setError("Failed to load map data");
    });
  }, []);

  if (error) return null;

  // Rotation logic:
  // China center is roughly Lon 105, Lat 35.
  // To bring (105, 35) to (0,0) [Front view]:
  // Rotate Y by -105 deg (in radians)
  // Rotate X by 35 deg (in radians)
  const initialRotation: [number, number, number] = [
      35 * (Math.PI / 180), 
      -105 * (Math.PI / 180), 
      0
  ];

  return (
    <group rotation={initialRotation}> 
        <BaseGlobe />

        {/* World Borders (Context) */}
        {worldData?.features.map((feature: any, i: number) => (
            <BorderLines key={`w-${i}`} feature={feature} color="#22d3ee" opacity={0.15} />
        ))}

        {/* Detailed China Borders (Overlay) */}
        {/* We lift them slightly (radiusOffset=0.05) to avoid z-fighting with world borders if they overlap */}
        {chinaData?.features.map((feature: any, i: number) => (
            <BorderLines 
                key={`c-${i}`} 
                feature={feature} 
                color="#22d3ee" 
                opacity={0.8} 
                radiusOffset={0.05}
            />
        ))}

        {/* Grid Connections - China Focused */}
        {/* West-East Power Transmission */}
        <SphericalPowerLine startLon={87} startLat={43} endLon={121} endLat={31} color="#facc15" />
        <SphericalPowerLine startLon={91} startLat={29} endLon={113} endLat={23} color="#facc15" />
        <SphericalPowerLine startLon={100} startLat={36} endLon={116} endLat={40} color="#4ade80" />
        <SphericalPowerLine startLon={104} startLat={30} endLon={119} endLat={29} color="#38bdf8" />
    </group>
  );
};

export const PowerGridScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#020617]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 70], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={45} />
        
        <OrbitControls 
            enablePan={false} 
            minDistance={40} 
            maxDistance={100}
            autoRotate={false} // Disabled auto rotation
            enableRotate={true}
            rotateSpeed={0.5}
        />
        
        {/* Space Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[100, 50, 50]} intensity={2} color="#60a5fa" />
        <pointLight position={[-100, -50, -50]} intensity={0.5} color="#c084fc" />

        <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade />
        
        {/* Atmospheric Glow */}
        <mesh scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
        </mesh>

        <Center>
             <WorldGlobeScene />
        </Center>
      </Canvas>

      {/* Label Overlay */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10 select-none">
         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">View: Detailed Regional Grid</span>
            </div>
            <div className="text-[9px] text-slate-500 font-mono pl-4">
                China Provinces Overlay • Global Context
            </div>
         </div>
      </div>
    </div>
  );
};
