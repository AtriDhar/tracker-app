import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, Trophy, Sparkles } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import VideoModal from '../components/VideoModal';
import WorkoutTimer from '../components/WorkoutTimer';
import MotivationalQuote from '../components/MotivationalQuote';
import { workoutData } from '../data/workoutData';
import { useAuth } from '../components/AuthContainer';
import { supabase } from '../lib/supabase';

export default function Tracker({ unit }) {
  const { dayId } = useParams();
  const { user, isPro } = useAuth();
  const navigate = useNavigate();
  const currentDay = parseInt(dayId, 10);
  
  const dayData = workoutData.find(d => d.day === currentDay);
  
  // State for tracked data per exercise: { [exerciseId]: { done: bool, load: string, achieved: string, time_spent: number } }
  const [dayMemory, setDayMemory] = useState({});
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [activeVideoEx, setActiveVideoEx] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

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
        const history = JSON.parse(localStorage.getItem('workout_history') || '[]');
        setWorkoutHistory(history);
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
        });

      // We can also load history from local for now, and optionally sync to cloud if table exists
      loadLocal();
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
    const updated = { ...dayMemory, [exerciseId]: { ...(dayMemory[exerciseId] || {}), ...updateData } };
    saveMemory(updated);
  };

  // Extract a custom target based on history
  const getCustomTarget = (exId) => {
    for (let i = workoutHistory.length - 1; i >= 0; i--) {
      const session = workoutHistory[i];
      if (session.memory_data && session.memory_data[exId]) {
        const lastExData = session.memory_data[exId];
        if (lastExData.load && lastExData.achieved && lastExData.done) {
           return `${lastExData.load} (did ${lastExData.achieved})`;
        }
      }
    }
    return null;
  };

  const finishSession = async () => {
    const sessionRecord = {
      date: new Date().toISOString(),
      day_id: currentDay,
      memory_data: dayMemory
    };
    const newHistory = [...workoutHistory, sessionRecord];
    setWorkoutHistory(newHistory);
    localStorage.setItem('workout_history', JSON.stringify(newHistory));

    if (user && isPro) {
       // Optional: try to save to a history table if it exists
       try {
         await supabase.from('workout_history_log').insert({
            user_id: user.id,
            day_id: currentDay,
            memory_data: dayMemory,
            completed_at: new Date().toISOString()
         });
       } catch (e) { console.error(e); }
    }

    // Reset current day tracking for next time, except keep the target records implicitly via history
    const resetMemory = {};
    Object.keys(dayMemory).forEach(key => {
      // Keep load as default input but clear achieved and done
      resetMemory[key] = { load: dayMemory[key].load, achieved: '', done: false, time_spent: 0 };
    });
    await saveMemory(resetMemory);
    
    setShowCelebration(true);
    setTimeout(() => {
       setShowCelebration(false);
       navigate('/');
    }, 4000);
  };

  if (!dayData) return <div style={{ color: 'white', padding: '40px' }}>Loading or Invalid Day...</div>;

  const isRestDay = dayData.focus.includes('Rest') || dayData.exercises.length === 0;
  
  // Calculate completion
  const totalExercises = dayData.exercises.length;
  const doneExercises = Object.values(dayMemory).filter(v => v.done).length;
  const completionPercent = totalExercises > 0 ? Math.round((doneExercises / totalExercises) * 100) : 0;

  return (
    <div className="mobile-padding" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '120px', position: 'relative' }}>
      
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.8)', zIndex: 999,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'
             }}
          >
            <Trophy size={80} color="var(--accent-neon)" style={{ marginBottom: '20px' }} />
            <h1 style={{ color: 'white' }}>Workout Completed!</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Session added to history. Great job.</p>
          </motion.div>
        )}
      </AnimatePresence>

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
                customTarget={getCustomTarget(ex.id)}
                onUpdate={(data) => handleUpdate(ex.id, data)}
                onOpenVideo={(exData) => setActiveVideoEx(exData)}
                unit={unit}
              />
            </motion.div>
          ))}
        </div>
      )}

      {completionPercent === 100 && !showCelebration && (
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '20px' }}
         >
            <MotivationalQuote />
            <button 
              onClick={finishSession}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.2rem', gap: '8px' }}
            >
              <Sparkles size={20} /> Finish & Log Session
            </button>
         </motion.div>
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
        border: completionPercent === 100 ? "1px solid var(--accent-neon)" : "1px solid var(--border-subtle)",
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        zIndex: 50,
        boxShadow: completionPercent === 100 ? '0 0 20px rgba(69, 97, 255, 0.4)' : '0 4px 30px rgba(0,0,0,0.5)',
        transition: 'all 0.3s'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Daily Session Completion</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-neon)' }}>{completionPercent}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: 'var(--accent-neon)' }}
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
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
