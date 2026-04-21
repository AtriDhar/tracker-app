import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "The hard part isn't getting your body in shape. The hard part is getting your mind in shape.",
  "Pain is temporary. Quitting lasts forever.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Success starts with self-discipline.",
  "Rome wasn't built in a day, but they worked on it every single day.",
  "The only bad workout is the one that didn't happen.",
  "Don't stop when you're tired. Stop when you're done."
];

export default function MotivationalQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: 0.8 }}
          style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--text-tertiary)', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}
        >
          "{quotes[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
