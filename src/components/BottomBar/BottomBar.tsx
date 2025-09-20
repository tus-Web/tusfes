'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Map, CalendarToday, Settings } from '@mui/icons-material';
import { useLanguage } from '@/hooks/use-language';
import styles from './BottomBar.module.css';

interface BottomBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  { id: 'map', label: 'bottomBar.map', icon: <Map /> },
  { id: 'calendar', label: 'bottomBar.calendar', icon: <CalendarToday /> },
  { id: 'settings', label: 'bottomBar.settings', icon: <Settings /> },
];

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  return (
    <div className={styles.bottomBar}>
      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className={styles.iconContainer}
              animate={{
                y: activeTab === tab.id ? -2 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {tab.icon}
            </motion.div>
            
            <motion.span
              className={styles.label}
              animate={{
                opacity: activeTab === tab.id ? 1 : 0.7,
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
              transition={{ duration: 0.2 }}
            >
              {t(tab.label)}
            </motion.span>

            {activeTab === tab.id && (
              <motion.div
                className={styles.activeIndicator}
                layoutId="activeTab"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;