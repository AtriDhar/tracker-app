import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import VideoModal from '../components/VideoModal';
import WorkoutTimer from '../components/WorkoutTimer';
import { workoutData } from '../data/workoutData';
import { useAuth } from '../components/AuthContainer';
import { supabase } from '../lib/supabase';

export default function Tracker({ unit }) {
  const { dayId } = useParams();
  const { user, isPro } = useAuth();
  const navigate = useNavigate();
  const currentDay = parseInt(dayId, 10);
  
  const dayData = workoutData.find(d => d.day === currentDay);
  
  // State for tracked data per exercise: { [exerciseId]: { done: bool, load: string, achieved: string } }
  const [dayMemory, setDayMemory] = useState({});
  const [activeVideoEx, setActiveVideoEx] = useState(null);

  useEffect(() => {
    if (!dayData) {
      if (currentDay > 8) navigate('/tracker/1');
      if (currentDay < 1) navigate('/tracker/8');
      return;
    }

    const loadLocal = () => {
      try {
        const memory = JSON.parse(localStorage.getItem('workout_memory') || '{}');
        setDayMemory(memory[currentDay] || {});
      } catch (e) {
        console.error(e);
      }
    };

    if (user) {
      // Sync from cloud
      supabase.from('workout_sync')
        .select('memory_data')
        .eq('user_id', user.id)
        .eq('day_id', currentDay)
        .single()
        .then(({ data, error }) => {
          if (!error && data) setDayMemory(data.memory_data);
          else loadLocal();
        });
    } else {
      loadLocal();
    }
  }, [currentDay, dayData, navigate, user]);

  const saveMemory = async (newMemory) => {
    setDayMemory(newMemory);
    try {
      const globalMemory = JSON.parse(localStorage.getItem('workout_memory') || '{}');
      globalMemory[currentDay] = newMemory;
      localStorage.setItem('workout_memory', JSON.stringify(globalMemory));
      
      // Sync back to cloud if pro
      if (user && isPro) {
        await supabase.from('workout_sync').upsert(
          { user_id: user.id, day_id: currentDay, memory_data: newMemory },
          { onConflict: 'user_id,day_id' }
        );
      }
    } catch (e) {
      console.error("Storage full or blocked", e);
    }
  };

  const handleUpdate = (exerciseId, updateData) => {
    const updated = {
      ...dayMemory,
      [exerciseId]: {
        ...(dayMemory[exerciseId] || {}),
        ...updateData
      }
    };
    saveMemory(updated);
  };

  if (!dayData) return <div style={{ color: 'white', padding: '40px' }}>Loading or Invalid Day...</div>;

  const isRestDay = dayData.focus.includes('Rest') || dayData.exercises.length === 0;

  return (
    <div className="mobile-padding" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={20} /> Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to={`/tracker/${currentDay - 1}`} className="btn-icon"><ChevronLeft size={20}/></Link>
          <div style={{ fontWeight: 600, width: '80px', textAlign: 'center' }}>Day {currentDay} / 8</div>
          <Link to={`/tracker/${currentDay + 1}`} className="btn-icon"><ChevronRight size={20}/></Link>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ marginBottom: '8px' }}>{dayData.focus}</h1>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: '32px' }}>
          Check off exercises as you go. Record load and reps. Your progress will be saved automatically.
        </p>
      </motion.div>

      {isPro ? (
        <WorkoutTimer />
      ) : (
        <a href="#pro-upgrade" style={{ textDecoration: 'none' }} onClick={() => navigate('/#pro')}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              background: 'rgba(255, 51, 102, 0.05)', 
              border: '1px dashed var(--accent-alert)',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: 'var(--text-secondary)'
            }}
          >
            <Lock size={18} className="text-neon" style={{ color: 'var(--accent-alert)' }}/>
            <span>Pro / Founder Feature: Active Rest Timer (Tap to Upgrade)</span>
          </motion.div>
        </a>
      )}

      {isRestDay ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card" 
          style={{ textAlign: 'center', padding: '60px 20px', borderTop: '4px solid var(--accent-primary)' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧘</div>
          <h2>Rest & Recovery</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '16px auto 0' }}>
            There are no tracked exercises for today. Focus on your nutrition, mobility work, and getting quality sleep.
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {dayData.exercises.map((ex, index) => (
            <motion.div 
              key={ex.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ExerciseCard 
                exercise={ex} 
                data={dayMemory[ex.id] || {}}
                onUpdate={(data) => handleUpdate(ex.id, data)}
                onOpenVideo={(exData) => setActiveVideoEx(exData)}
                unit={unit}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating progress bar at bottom */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '800px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        zIndex: 50,
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Daily Session Completion</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-neon)' }}>
              {Math.round((Object.values(dayMemory).filter(v => v.done).length / Math.max(1, dayData.exercises.length)) * 100)}%
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: 'var(--accent-neon)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(Object.values(dayMemory).filter(v => v.done).length / Math.max(1, dayData.exercises.length)) * 100}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
        </div>
      </div>

      <VideoModal 
        isOpen={!!activeVideoEx} 
        onClose={() => setActiveVideoEx(null)} 
        exercise={activeVideoEx} 
      />
    </div>
  );
}
