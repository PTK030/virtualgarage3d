import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Auto-progress through intro steps
    const timer1 = setTimeout(() => setStep(1), 500);
    const timer2 = setTimeout(() => setStep(2), 2000);
    const timer3 = setTimeout(() => setStep(3), 3500);
    const timer4 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: step >= 3 ? 0 : 1 }}
      transition={{ duration: 1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      {/* Animated background particles */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 400 - 200],
              y: [0, Math.random() * 400 - 200],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: `hsl(${220 + Math.random() * 40}, 80%, 60%)`,
              boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Main title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ 
          opacity: step >= 1 ? 1 : 0,
          scale: step >= 1 ? 1 : 0.5,
          y: step >= 1 ? 0 : 50,
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.6, 0.05, 0.01, 0.9],
          type: 'spring',
          stiffness: 100,
        }}
        style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h1 style={{
          fontSize: '72px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          padding: '20px',
          fontFamily: 'Orbitron, sans-serif',
          letterSpacing: '4px',
          textShadow: '0 0 80px rgba(102, 126, 234, 0.5)',
          filter: 'drop-shadow(0 0 30px rgba(102, 126, 234, 0.6))',
        }}>
          VIRTUAL GARAGE
        </h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: step >= 1 ? 1 : 0,
            scale: step >= 1 ? 1 : 0.8,
          }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#a0aec0',
            marginTop: '10px',
            fontFamily: 'Rajdhani, sans-serif',
            letterSpacing: '8px',
            textTransform: 'uppercase',
          }}
        >
          3D+
        </motion.div>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: step >= 2 ? 1 : 0,
          y: step >= 2 ? 0 : 20,
        }}
        transition={{ duration: 0.6 }}
        style={{
          marginTop: '40px',
          fontSize: '18px',
          color: '#718096',
          fontFamily: 'Rajdhani, sans-serif',
          letterSpacing: '2px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Experience Your Dream Collection
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: step >= 2 ? 1 : 0,
          scale: step >= 2 ? 1 : 0.8,
        }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          marginTop: '60px',
          width: '300px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: step >= 2 ? '100%' : '0%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.8)',
          }}
        />
      </motion.div>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 1 ? 0.6 : 0 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: '600',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          transition: 'all 0.3s',
          zIndex: 2,
        }}
      >
        Skip Intro
      </motion.button>
    </motion.div>
  );
}
