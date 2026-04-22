import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, CalendarDays, Lock, CheckCircle2, UserCircle } from 'lucide-react';
import Hero3DBox from '../components/Hero3DBox';
import MotivationalQuote from '../components/MotivationalQuote';
import DashboardStats from '../components/DashboardStats';
import { workoutData } from '../data/workoutData';
import { useAuth } from '../components/AuthContainer';

export default function Home({ unit, onUnitChange }) {
  const { user, isPro, signOut } = useAuth();
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
      <header style={{ marginBottom: '80px' }}>
        <div className="mobile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--accent-neon)', width: '40px', height: '4px', borderRadius: '2px' }}></div>
                <span style={{ color: 'var(--accent-neon)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Cbum 8-Day Split</span>
              </div>
              
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px', border: '1px solid var(--border-subtle)', marginLeft: '16px' }}>
                <button 
                  onClick={() => onUnitChange('kg')}
                  style={{ 
                    padding: '6px 16px', 
                    borderRadius: 'var(--radius-sm)',
                    background: unit === 'kg' ? 'var(--accent-primary)' : 'transparent',
                    color: unit === 'kg' ? '#fff' : 'var(--text-secondary)'
                  }}
                >Kg</button>
                <button 
                  onClick={() => onUnitChange('lbs')}
                  style={{ 
                    padding: '6px 16px', 
                    borderRadius: 'var(--radius-sm)',
                    background: unit === 'lbs' ? 'var(--accent-primary)' : 'transparent',
                    color: unit === 'lbs' ? '#fff' : 'var(--text-secondary)'
                  }}
                >Lbs</button>
              </div>
            </div>
            <h1 style={{ fontSize: '3.5rem', lineHeight: '1.15', marginBottom: '16px' }}>Ultimate Daily <br/><span className="text-gradient">Workout Tracker</span></h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '1.15rem', lineHeight: 1.7 }}>
              Elevate your training with this premium interactive tracker. Maintain your progress, track your loads, and master the movements.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ display: 'flex', gap: '16px', marginTop: '40px', flexWrap: 'wrap' }}
            >
              <Link to="/tracker/1" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem', minWidth: '200px' }}>
                  <Play fill="var(--bg-primary)" size={20}/> Start Workout
                </button>
              </Link>
              <Link to="/tracker/1" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '16px 32px', minWidth: '200px' }}>
                  <CalendarDays size={20}/> View Schedule
                </button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
             animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
             transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
             className="hero-3d-container"
          >
             <Hero3DBox />
          </motion.div>
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '60px' }}
      >
        <MotivationalQuote />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <h2>Your Progress</h2>
        </div>
        <DashboardStats stats={stats} />
      </motion.section>

      <section style={{ marginTop: '80px' }}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{ marginBottom: '32px' }}
        >
          Weekly Split Overview
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {workoutData.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              style={{ height: '100%' }}
            >
              <Link to={`/tracker/${day.day}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <motion.div 
                  className="glass-card"
                  whileHover={{ scale: 1.02, translateY: -4 }}
                  style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.95rem', color: 'var(--accent-neon)', fontWeight: 600 }}>Day {day.day}</span>
                    <ArrowRight size={18} color="var(--text-secondary)" />
                  </div>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', flex: 1 }}>{day.focus}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                    {day.exercises.length} Exercises
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        id="pro" 
        style={{ marginTop: '80px', borderTop: '1px solid var(--border-subtle)', paddingTop: '60px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2>Account & Billing</h2>
          {!user ? (
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}><UserCircle size={18}/> Login / Sign Up</button>
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Welcome, <span style={{color: 'var(--text-primary)'}}>{user.email}</span></span>
              <button onClick={signOut} className="btn-primary" style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', fontSize: '0.9rem' }}>Sign Out</button>
            </div>
          )}
        </div>

        {isPro ? (
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-neon)' }}>
            <h3><CheckCircle2 className="text-neon" style={{ display: 'inline', marginRight: '10px', verticalAlign: 'text-bottom' }}/> You are a Pro Member!</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '1.05rem' }}>
              You have full, lifetime access to cloud-syncing and the active rest timer. Go crush your workout.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '24px' }}>
            <motion.div className="glass-card" whileHover={{ scale: 1.01 }}>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Free Tier</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>$0 <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>/ forever</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)' }}><CheckCircle2 size={20} className="text-neon" /> Local Storage Tracking</li>
                <li style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)' }}><CheckCircle2 size={20} className="text-neon" /> Basic Analytics</li>
                <li style={{ display: 'flex', gap: '12px', color: 'var(--text-tertiary)' }}><Lock size={20} /> No Cloud Syncing</li>
                <li style={{ display: 'flex', gap: '12px', color: 'var(--text-tertiary)' }}><Lock size={20} /> No Active Rest Timer</li>
              </ul>
              {!user && <Link to="/auth" style={{ textDecoration: 'none' }}><button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Create Account To Upgrade</button></Link>}
            </motion.div>

            <motion.div className="glass-card" whileHover={{ scale: 1.01 }} style={{ borderColor: 'var(--accent-neon)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '24px', background: 'var(--accent-neon)', color: 'var(--bg-primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800' }}>MOST POPULAR</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Tracker Pro</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>$3 <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>/ month</span> <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>or $15 Lifetime</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', color: 'var(--text-primary)' }}><CheckCircle2 size={20} className="text-neon" /> Secure Cloud Database Sync</li>
                <li style={{ display: 'flex', gap: '12px', color: 'var(--text-primary)' }}><CheckCircle2 size={20} className="text-neon" /> Access from Any Device</li>
                <li style={{ display: 'flex', gap: '12px', color: 'var(--text-primary)' }}><CheckCircle2 size={20} className="text-neon" /> Elite Active Rest Timers</li>
                <li style={{ display: 'flex', gap: '12px', color: 'var(--text-primary)' }}><CheckCircle2 size={20} className="text-neon" /> Unlimited Tracker History</li>
              </ul>
              {user ? (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="#" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'var(--bg-tertiary)', textDecoration: 'none' }}>$3 / Mo</a>
                  <a href="#" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'var(--accent-neon)', color: 'var(--bg-primary)', textDecoration: 'none' }}>$15 Lifetime</a>
                </div>
              ) : (
                <Link to="/auth" style={{ textDecoration: 'none' }}><button className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-neon)', color: 'var(--bg-primary)' }}>Sign Up to Upgrade</button></Link>
              )}
            </motion.div>
          </div>
        )}
      </motion.section>
    </div>
  );
}
