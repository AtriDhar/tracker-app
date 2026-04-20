import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export default function WorkoutTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [restTime, setRestTime] = useState(0); // If > 0, we are in rest countdown mode

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (restTime > 0) {
          setRestTime((prev) => {
            if (prev <= 1) {
              // Play a sound or notification when done (optional)
              setIsActive(false);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setElapsed((prev) => prev + 1);
        }
      }, 1000);
    } else if (!isActive && elapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, elapsed, restTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const startRest = (seconds) => {
    setRestTime(seconds);
    setIsActive(true);
  };

  const resetAll = () => {
    setIsActive(false);
    setElapsed(0);
    setRestTime(0);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-hover)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        maxWidth: '400px',
        margin: '0 auto 24px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: restTime > 0 ? 'var(--accent-alert)' : 'var(--text-primary)' }}>
          <Timer size={20} />
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {restTime > 0 ? `Rest: ${formatTime(restTime)}` : `Session: ${formatTime(elapsed)}`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-icon" onClick={toggleTimer} style={{ width: '32px', height: '32px' }}>
            {isActive ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="btn-icon" onClick={resetAll} style={{ width: '32px', height: '32px' }}>
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button 
          onClick={() => startRest(60)}
          style={{ background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
        >
          60s Rest
        </button>
        <button 
          onClick={() => startRest(90)}
          style={{ background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
        >
          90s Rest
        </button>
        <button 
          onClick={() => startRest(120)}
          style={{ background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}
        >
          2m Rest
        </button>
      </div>
    </motion.div>
  );
}
