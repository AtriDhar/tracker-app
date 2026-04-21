import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, PlayCircle, CheckCircle2, Timer, Pause, Play } from 'lucide-react';

export default function ExerciseCard({ exercise, data, customTarget, onUpdate, onOpenVideo, unit = 'kg' }) {
  const [showTip, setShowTip] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(data.time_spent || 0);
  
  const isDone = data.done || false;
  const load = data.load || '';
  const achieved = data.achieved || '';

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && !isDone) {
      interval = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isDone]);

  // Sync to parent when stopping or completing
  useEffect(() => {
    if (!isActive && timeSpent > 0 && timeSpent !== data.time_spent) {
      onUpdate({ time_spent: timeSpent });
    }
  }, [isActive, timeSpent]);

  const handleDoneUpdate = (checked) => {
    if (checked) setIsActive(false);
    onUpdate({ done: checked, time_spent: timeSpent });
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card ${isDone ? 'border-accent-neon opacity-80' : ''}`}
      style={{
        borderColor: isDone ? 'var(--accent-neon)' : 'var(--border-subtle)',
        marginBottom: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h3 style={{ margin: 0 }}>{exercise.name}</h3>
            {isDone && <CheckCircle2 size={18} className="text-neon" />}
          </div>
          <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px' }}>
              {exercise.sets} Sets
            </span>
            <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px' }}>
              {exercise.reps} Reps
            </span>
            {exercise.category && (
              <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px' }}>
                {exercise.category}
              </span>
            )}
            {customTarget && !isDone && (
              <span style={{ background: 'rgba(255, 51, 102, 0.1)', color: 'var(--accent-alert)', border: '1px solid var(--accent-alert)', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Target: {customTarget}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {exercise.notes && exercise.notes !== '-' && (
            <button className="btn-icon" onClick={() => setShowTip(!showTip)} title="Tips">
              <Info size={18} />
            </button>
          )}
          <button className="btn-icon" onClick={() => onOpenVideo(exercise)} title="Demo Clip">
            <PlayCircle size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ 
              background: 'rgba(69, 97, 255, 0.1)', 
              borderLeft: '3px solid var(--accent-primary)',
              padding: '12px',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              marginBottom: '16px',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              <strong>Technique / Notes:</strong> {exercise.notes}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isActive ? 'var(--accent-neon)' : 'var(--text-secondary)' }}>
          <Timer size={16} /> <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{formatTime(timeSpent)}</span>
        </div>
        {!isDone && (
          <button 
            onClick={() => setIsActive(!isActive)}
            style={{ 
              background: isActive ? 'rgba(255,51,102,0.1)' : 'var(--bg-tertiary)',
              color: isActive ? 'var(--accent-alert)' : 'var(--text-primary)',
              border: isActive ? '1px solid var(--accent-alert)' : 'none',
              padding: '6px 16px', 
              borderRadius: 'var(--radius-sm)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {isActive ? <><Pause size={14} /> Stop</> : <><Play size={14} /> Track Time</>}
          </button>
        )}
      </div>

      <div className="mobile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Load Used</label>
          <input 
            type="text" 
            className="custom-input" 
            placeholder={`e.g. 100 ${unit}`}
            value={load}
            onChange={(e) => onUpdate({ load: e.target.value })}
            disabled={isDone}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Reps Achieved</label>
          <input 
            type="text" 
            className="custom-input" 
            placeholder="e.g. 15, 12" 
            value={achieved}
            onChange={(e) => onUpdate({ achieved: e.target.value })}
            disabled={isDone}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Done</label>
          <input 
            type="checkbox" 
            className="custom-checkbox"
            checked={isDone}
            onChange={(e) => handleDoneUpdate(e.target.checked)}
          />
        </div>
      </div>
    </motion.div>
  );
}
