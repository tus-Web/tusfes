'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CTAButton from '../CTAButton/CTAButton';
import styles from './TopPage.module.css';

interface TopPageProps {
  onCTAClick: () => void;
}

const TopPage: React.FC<TopPageProps> = ({ onCTAClick }) => {
  return (
    <div className={styles.topPage}>
      <div className={styles.backgroundOverlay}></div>
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={styles.logo}
        >
          <h1 className={styles.title}>東京理科大学</h1>
          <h2 className={styles.subtitle}>理大祭 2024</h2>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className={styles.info}
        >
          <p className={styles.date}>2024年11月2日(土) - 11月3日(日)</p>
          <p className={styles.location}>神楽坂キャンパス</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
          className={styles.ctaContainer}
        >
          <CTAButton onClick={onCTAClick} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className={styles.tagline}
        >
          <p>"科学と技術の祭典へようこそ"</p>
        </motion.div>
      </motion.div>

      <div className={styles.particles}>
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TopPage;