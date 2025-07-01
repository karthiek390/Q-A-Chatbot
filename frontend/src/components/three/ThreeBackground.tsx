
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { AnimatedParticles } from './AnimatedParticles';

interface ThreeBackgroundProps {
  isProcessing: boolean;
}

export const ThreeBackground = ({ isProcessing }: ThreeBackgroundProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <AnimatedParticles isProcessing={isProcessing} />
        </Suspense>
      </Canvas>
    </div>
  );
};
