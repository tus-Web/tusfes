'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Paper,
  Divider,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  DarkMode, 
  LightMode, 
  Language as LanguageIcon,
  Palette,
  Settings as SettingsIcon,
  History,
} from '@mui/icons-material';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage, type Language } from '@/hooks/use-language';
import UserHistory from '@/components/pages/setting/UserHistory/UserHistory';
import styles from './SettingsPage.module.css';

const SettingsPage: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.header}>
        <motion.div
          className={styles.titleContainer}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SettingsIcon className={styles.titleIcon} />
          <Typography variant="h4" className={styles.title}>
            設定
          </Typography>
        </motion.div>
      </div>

      <div className={styles.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className={styles.tabs}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
            },
            '& .MuiTab-root.Mui-selected': {
              color: 'var(--color-brand-main)',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-brand-main)',
            },
          }}
        >
          <Tab label="理大祭情報" />
          <Tab label="履歴" icon={<History />} iconPosition="start" />
        </Tabs>
      </div>

      <div className={styles.content}>
        {tabValue === 0 && (
          <div className={styles.settingsContainer}>
            {/* 理大祭情報セクション */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Paper className={styles.settingSection} elevation={2}>
                <div className={styles.sectionHeader}>
                  <SettingsIcon className={styles.sectionIcon} />
                  <Typography variant="h6" className={styles.sectionTitle}>
                    理大祭 2024 について
                  </Typography>
                </div>
                
                <div className={styles.festivalInfo}>
                  <div className={styles.infoItem}>
                    <Typography variant="h6" className={styles.infoLabel}>
                      開催日程
                    </Typography>
                    <Typography variant="body1" className={styles.infoValue}>
                      2024年11月2日(土) - 11月3日(日)
                    </Typography>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <Typography variant="h6" className={styles.infoLabel}>
                      開催場所
                    </Typography>
                    <Typography variant="body1" className={styles.infoValue}>
                      東京理科大学 神楽坂キャンパス
                    </Typography>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <Typography variant="h6" className={styles.infoLabel}>
                      テーマ
                    </Typography>
                    <Typography variant="body1" className={styles.infoValue}>
                      "科学と技術の祭典へようこそ"
                    </Typography>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <Typography variant="h6" className={styles.infoLabel}>
                      アプリバージョン
                    </Typography>
                    <Typography variant="body1" className={styles.infoValue}>
                      v1.0.0
                    </Typography>
                  </div>
                </div>
              </Paper>
            </motion.div>
          </div>
        )}

        {tabValue === 1 && (
          <UserHistory />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;