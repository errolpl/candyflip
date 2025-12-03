'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES ---
type Flavor = {
  id: string;
  name: string;
  color: string;
  img: string;
};

// --- MOCK DATA (With .png fix applied) ---
const FLAVOR_A: Flavor = { 
  id: '1', 
  name: 'Pineapple Passionfruit', 
  color: 'bg-red-300', 
  img: 'https://placehold.co/400x600/10b981/white.png?text=Apple' 
};

const FLAVOR_B: Flavor = { 
  id: '2', 
  name: 'Raspberry Lemonade', 
  color: 'bg-fuchsia-500', 
  img: 'https://placehold.co/400x600/2563eb/white.png?text=Berry' 
};

export default function CandyCard() {
  // We track TOTAL degrees rotated, not just isFlipped
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSpin = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // 1. Decide the Winner (Logic Layer)
    const isHeads = Math.random() > 0.5; // 50/50 chance
    console.log(`isHeads: ${isHeads}`)
    
    // 2. Calculate Physics
    const minSpins = 5; // Minimum full rotations (5 * 360 = 1800 degrees)
    const extraSpins = Math.floor(Math.random() * 3); // Add 0-2 extra spins for randomness
    const spinDegrees = (minSpins + extraSpins) * 360;

    // 3. Calculate Landing Zone
    // If we want Heads (Front): We need to land on a multiple of 360
    // If we want Tails (Back): We need to land on (multiple of 360) + 180
    
    // Current visual state (normalized to 0-360)
    const currentMod = rotation % 360;
    
    let targetRotation = rotation + spinDegrees;

    if (isHeads) {
        // We want to land on a multiple of 360. 
        // Since spinDegrees is already a multiple of 360, we just add it.
        // BUT, if we are currently on "Tails" (180), adding 360 keeps us on Tails.
        // So we adjust to ensure we land on 0 (mod 360).
        if (currentMod !== 0) {
            targetRotation += 180;
        }
    } else {
        // We want to land on Tails (180 mod 360).
        if (currentMod === 0) {
             targetRotation += 180;
        }
    }

    setRotation(targetRotation);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-12 bg-slate-950">
      
      <div className="relative h-96 w-72 perspective-[1000px] group">
        <motion.div
          className="relative w-full h-full"
          // ANIMATION CONFIGURATION
          animate={{ rotateY: rotation }}
          transition={{ 
            duration: 3, // Total time requested
            ease: [0.15, 0.85, 0.35, 1] // Custom Cubic Bezier (Starts fast, slows down smooth)
          }}
          onAnimationComplete={() => setIsAnimating(false)}
          style={{ transformStyle: "preserve-3d" }}
        >
          
          {/* FRONT FACE */}
          <CardFace flavor={FLAVOR_A} label="Option A" />

          {/* BACK FACE */}
          <CardFace 
            flavor={FLAVOR_B} 
            label="Option B" 
            className="transform-[rotateY(180deg)]" 
          />

        </motion.div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isAnimating}
        className={cn(
          "px-10 py-4 text-xl font-bold text-white uppercase tracking-wider transition-all rounded-full shadow-2xl",
          isAnimating 
            ? "bg-slate-800 text-slate-500 cursor-not-allowed scale-95 ring-0" 
            : "bg-linear-to-r from-indigo-600 to-violet-600 hover:scale-110 hover:shadow-indigo-500/50 active:scale-95 ring-4 ring-white/10"
        )}
      >
        {isAnimating ? 'Deciding...' : 'SPIN CANDY'}
      </button>

    </div>
  );
}

// --- SUB-COMPONENT (Unchanged) ---
function CardFace({ 
  flavor, 
  label, 
  className 
}: { 
  flavor: Flavor; 
  label: string; 
  className?: string 
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full flex flex-col items-center justify-center rounded-2xl p-6 text-center shadow-2xl",
        "border-[6px] border-white/10 backdrop-blur-md bg-opacity-90", 
        "backface-hidden", // Crucial
        flavor.color,
        className
      )}
    >
      <span className="absolute top-4 right-4 text-xs font-black tracking-widest text-white/60 uppercase">
        {label}
      </span>
      
      <div className="relative h-40 w-40 mb-6 overflow-hidden rounded-full shadow-2xl ring-4 ring-white/20 bg-white/10">
        <Image
          src={flavor.img}
          alt={flavor.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority
        />
      </div>

      <h2 className="text-3xl font-black text-white uppercase drop-shadow-lg leading-none tracking-tight">
        {flavor.name}
      </h2>
    </div>
  );
}