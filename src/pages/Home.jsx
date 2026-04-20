import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, CalendarDays } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import { workoutData } from '../data/workoutData';

export default function Home({ unit, onUnitChange }) {
  const [stats, setStats] = useState({
    totalDone: 0,
    completionRate: 0,
    streak: 0,
    workoutsTracked: 0
  });

  useEffect(() => {
    // Read from localStorage to calculate stats
    try {
      const memory = JSON.parse(localStorage.getItem('workout_memory') || '{}');
      let totalExercises = 0;
      let totalDone = 0;
      let workoutsTracked = 0;

      // Count across all days in our JSON
      workoutData.forEach(day => {
        const dayMemory = memory[day.day] || {};
        if (Object.keys(dayMemory).length > 0) workoutsTracked++;
        
        day.exercises.forEach(ex => {
          totalExercises++;
          if (dayMemory[ex.id]?.done) {
            totalDone++;
          }
        });
      });

      const rate = totalExercises > 0 ? (totalDone / totalExercises) * 100 : 0;
      
      // A simple streak logic placeholder based on tracked workouts
      const streak = workoutsTracked > 0 ? workoutsTracked : 0;

      setStats({
        totalDone,
        completionRate: rate,
        streak,
        workoutsTracked
      });

    } catch (e) {
      console.error("Could not parse memory", e);
    }
  }, []);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--accent-neon)', width: '40px', height: '4px', borderRadius: '2px' }}></div>
              <span style={{ color: 'var(--accent-neon)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Cbum 8-Day Split</span>
            </div>
            
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px', border: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={() => onUnitChange('kg')}
                style={{ 
                  padding: '4px 12px', 
                  borderRadius: '4px',
                  background: unit === 'kg' ? 'var(--accent-primary)' : 'transparent',
                  color: unit === 'kg' ? '#fff' : 'var(--text-secondary)'
                }}
              >Kg</button>
              <button 
                onClick={() => onUnitChange('lbs')}
                style={{ 
                  padding: '4px 12px', 
                  borderRadius: '4px',
                  background: unit === 'lbs' ? 'var(--accent-primary)' : 'transparent',
                  color: unit === 'lbs' ? '#fff' : 'var(--text-secondary)'
                }}
              >Lbs</button>
            </div>
          </div>
          <h1>Ultimate Daily <br/><span className="text-gradient">Workout Tracker</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '1.2rem', lineHeight: 1.6, marginTop: '16px' }}>
            Elevate your training with this state-of-the-art interactive tracker. Maintain your progress, track your loads, and master the movements.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '16px', marginTop: '20px' }}
        >
          <Link to="/tracker/1" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              <Play fill="var(--bg-primary)" size={20}/> Start Workout
            </button>
          </Link>
          <Link to="/tracker/1" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '16px 32px' }}>
              <CalendarDays size={20}/> View Schedule
            </button>
          </Link>
        </motion.div>
      </header>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <h2>Your Progress</h2>
        </div>
        <DashboardStats stats={stats} />
      </section>

      <section style={{ marginTop: '60px' }}>
        <h2 style={{ marginBottom: '24px' }}>Weekly Split Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {workoutData.map((day, idx) => (
            <Link to={`/tracker/${day.day}`} key={idx} style={{ textDecoration: 'none' }}>
              <motion.div 
                className="glass-card"
                whileHover={{ scale: 1.03 }}
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Day {day.day}</span>
                  <ArrowRight size={16} color="var(--text-secondary)" />
                </div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>{day.focus}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  {day.exercises.length} Exercises
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
