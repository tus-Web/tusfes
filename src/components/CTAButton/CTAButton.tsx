'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './CTAButton.module.css';

interface CTAButtonProps {
  onClick: () => void;
}

const CTAButton: React.FC<CTAButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      className={styles.ctaButton}
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 0 25px rgba(255, 107, 107, 0.6)',
      }}
      whileTap={{
        scale: 0.95,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.buttonContent}
        whileHover={{
          background: 'linear-gradient(45deg, #ff8a80, #ff5722)',
        }}
      >
        <span className={styles.buttonText}>理大祭へ入場</span>
        <motion.div
          className={styles.buttonArrow}
          whileHover={{
            x: 5,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          →
        </motion.div>
      </motion.div>
      
      <div className={styles.buttonGlow}></div>
    </motion.button>
  );
};

export default CTAButton;