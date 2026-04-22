import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, Flame, Layers } from 'lucide-react';

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      title: "Total Exercises Done",
      value: stats.totalDone || 0,
      icon: <Layers className="text-neon" size={24} />,
      delay: 0.1
    },
    {
      title: "Completion Rate",
      value: `${Math.round(stats.completionRate || 0)}%`,
      icon: <Target className="text-neon" size={24} />,
      delay: 0.2
    },
    {
      title: "Active Streak",
      value: `${stats.streak || 0} Days`,
      icon: <Flame className="text-neon" size={24} />,
      delay: 0.3
    },
    {
      title: "Workouts Tracked",
      value: stats.workoutsTracked || 0,
      icon: <Activity className="text-neon" size={24} />,
      delay: 0.4
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '20px', 
      marginBottom: '40px' 
    }}>
      {statCards.map((stat, idx) => (
        <motion.div
          key={idx}
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay, duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}
        >
          <div style={{ 
            background: 'var(--accent-neon-glow)', 
            padding: '12px', 
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}>
            {stat.icon}
          </div>
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              {stat.title}
            </h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>
              {stat.value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
