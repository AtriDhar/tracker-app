import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video } from 'lucide-react';

export default function VideoModal({ isOpen, onClose, exercise }) {
  if (!isOpen || !exercise) return null;

  // Construct a Youtube query based on the exercise name and Chris Bumstead.
  const searchQuery = encodeURIComponent(`Chris Bumstead ${exercise.name} exercise tutorial`);
  const ytLink = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()} // prevent overlay click from bubbling up
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{exercise.name}</h2>
            <button className="btn-icon" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div style={{ 
            background: 'var(--bg-primary)', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden',
            aspectRatio: '16/9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-subtle)',
            position: 'relative'
          }}>
            <Video size={64} className="text-neon" style={{ marginBottom: '16px', opacity: 0.8 }} />
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '0 20px', marginBottom: '20px' }}>
              We've generated a targeted search to help you see proper form.
            </p>
            <a 
              href={ytLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <PlayCircle size={18} /> Watch on YouTube
            </a>
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
            <strong>Tip:</strong> Pay close attention to the eccentric (lowering) portion of the movement for maximum hypertrophy!
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Needed to import playcircle here since it's used inside
import { PlayCircle } from 'lucide-react';
