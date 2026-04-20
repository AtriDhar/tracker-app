import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, PlayCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ExerciseCard({ exercise, data, onUpdate, onOpenVideo, unit = 'kg' }) {
  const [showTip, setShowTip] = useState(false);
  
  const isDone = data.done || false;
  const load = data.load || '';
  const achieved = data.achieved || '';

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
          <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Load Used</label>
          <input 
            type="text" 
            className="custom-input" 
            placeholder={`e.g. 100 ${unit}`}
            value={load}
            onChange={(e) => onUpdate({ load: e.target.value })}
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
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Done</label>
          <input 
            type="checkbox" 
            className="custom-checkbox"
            checked={isDone}
            onChange={(e) => onUpdate({ done: e.target.checked })}
          />
        </div>
      </div>
    </motion.div>
  );
}
