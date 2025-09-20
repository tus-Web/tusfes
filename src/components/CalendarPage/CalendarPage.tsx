'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FilterList, AccessTime, LocationOn, Group } from '@mui/icons-material';
import { Button, Chip } from '@mui/material';
import styles from './CalendarPage.module.css';

interface ScheduleEvent {
  id: number;
  title: string;
  time: string;
  endTime: string;
  location: string;
  type: string;
  isKidFriendly: boolean;
  capacity: number;
  description: string;
  organizer: string;
}

interface CalendarPageProps {}

const mockEvents: ScheduleEvent[] = [
  {
    id: 1,
    title: '開会式',
    time: '09:00',
    endTime: '09:30',
    location: '大講堂',
    type: 'ceremony',
    isKidFriendly: true,
    capacity: 500,
    description: '理大祭2024の開会式です',
    organizer: '実行委員会'
  },
  {
    id: 2,
    title: '子供向け科学実験ショー',
    time: '10:00',
    endTime: '11:00',
    location: '1号館 実験室A',
    type: 'experiment',
    isKidFriendly: true,
    capacity: 50,
    description: '楽しい科学実験を一緒に体験しよう！',
    organizer: '化学研究会'
  },
  {
    id: 3,
    title: 'ロボット技術講演会',
    time: '10:30',
    endTime: '12:00',
    location: '2号館 講義室201',
    type: 'lecture',
    isKidFriendly: false,
    capacity: 100,
    description: '最新のロボット技術について専門的な講演',
    organizer: 'ロボット工学研究室'
  },
  {
    id: 4,
    title: 'キッズワークショップ「手作りスライム」',
    time: '11:30',
    endTime: '12:30',
    location: '3号館 多目的室',
    type: 'workshop',
    isKidFriendly: true,
    capacity: 30,
    description: 'カラフルなスライムを作ってみよう！',
    organizer: '学生ボランティア'
  },
  {
    id: 5,
    title: 'ランチタイムコンサート',
    time: '12:00',
    endTime: '13:00',
    location: '中庭ステージ',
    type: 'entertainment',
    isKidFriendly: true,
    capacity: 200,
    description: '軽音楽部による演奏をお楽しみください',
    organizer: '軽音楽部'
  },
  {
    id: 6,
    title: '研究発表会「AI技術の最前線」',
    time: '13:30',
    endTime: '15:00',
    location: '2号館 講義室301',
    type: 'presentation',
    isKidFriendly: false,
    capacity: 80,
    description: '学生による最新AI研究の発表',
    organizer: '情報工学研究室'
  },
  {
    id: 7,
    title: 'ファミリー向けゲーム大会',
    time: '14:00',
    endTime: '16:00',
    location: '体育館',
    type: 'game',
    isKidFriendly: true,
    capacity: 150,
    description: '家族みんなで楽しめるゲーム大会',
    organizer: '体育会'
  },
  {
    id: 8,
    title: '閉会式・抽選会',
    time: '16:30',
    endTime: '17:00',
    location: '大講堂',
    type: 'ceremony',
    isKidFriendly: true,
    capacity: 500,
    description: '理大祭の締めくくりと豪華賞品の抽選会',
    organizer: '実行委員会'
  }
];

const CalendarPage: React.FC<CalendarPageProps> = () => {
  const [showKidFriendlyOnly, setShowKidFriendlyOnly] = useState(false);

  const filteredEvents = showKidFriendlyOnly 
    ? mockEvents.filter(event => event.isKidFriendly)
    : mockEvents;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ceremony': return '🎉';
      case 'experiment': return '🧪';
      case 'lecture': return '🎤';
      case 'workshop': return '🛠️';
      case 'entertainment': return '🎵';
      case 'presentation': return '📊';
      case 'game': return '🎮';
      default: return '📅';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'ceremony': return '#C71585';
      case 'experiment': return '#3B7C5B';
      case 'lecture': return '#4299E1';
      case 'workshop': return '#F6AD55';
      case 'entertainment': return '#9F7AEA';
      case 'presentation': return '#38B2AC';
      case 'game': return '#F56565';
      default: return '#718096';
    }
  };

  return (
    <div className={styles.calendarPage}>
      {/* Header with Filter */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>イベントスケジュール</h1>
          <p className={styles.subtitle}>2024年11月2日(土)</p>
        </div>
        
        <div className={styles.filterSection}>
          <Button
            variant={showKidFriendlyOnly ? "contained" : "outlined"}
            startIcon={<FilterList />}
            onClick={() => setShowKidFriendlyOnly(!showKidFriendlyOnly)}
            className={styles.filterButton}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: '600',
              backgroundColor: showKidFriendlyOnly ? '#3B7C5B' : 'transparent',
              borderColor: '#3B7C5B',
              color: showKidFriendlyOnly ? 'white' : '#3B7C5B',
              '&:hover': {
                backgroundColor: showKidFriendlyOnly ? '#2C5D44' : 'rgba(59, 124, 91, 0.1)',
              },
            }}
          >
            子供向け
          </Button>
          
          {showKidFriendlyOnly && (
            <Chip
              label={`${filteredEvents.length}件表示中`}
              size="small"
              className={styles.resultChip}
              sx={{
                backgroundColor: 'rgba(59, 124, 91, 0.1)',
                color: '#3B7C5B',
                fontWeight: '600',
              }}
            />
          )}
        </div>
      </div>

      {/* Events List */}
      <div className={styles.eventsContainer}>
        <div className={styles.eventsList}>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className={styles.eventCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.eventTime}>
                <div className={styles.timeDisplay}>
                  <AccessTime className={styles.timeIcon} />
                  <span className={styles.timeText}>
                    {event.time} - {event.endTime}
                  </span>
                </div>
                <div 
                  className={styles.eventTypeIndicator}
                  style={{ backgroundColor: getEventColor(event.type) }}
                />
              </div>

              <div className={styles.eventContent}>
                <div className={styles.eventHeader}>
                  <div className={styles.eventTitleRow}>
                    <span className={styles.eventIcon}>
                      {getEventIcon(event.type)}
                    </span>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    {event.isKidFriendly && (
                      <Chip
                        label="子供向け"
                        size="small"
                        className={styles.kidFriendlyChip}
                        sx={{
                          backgroundColor: 'rgba(59, 124, 91, 0.1)',
                          color: '#3B7C5B',
                          fontSize: '0.7rem',
                          height: '20px',
                        }}
                      />
                    )}
                  </div>
                  
                  <div className={styles.eventMeta}>
                    <div className={styles.metaItem}>
                      <LocationOn className={styles.metaIcon} />
                      <span>{event.location}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Group className={styles.metaIcon} />
                      <span>定員 {event.capacity}名</span>
                    </div>
                  </div>
                </div>

                <p className={styles.eventDescription}>
                  {event.description}
                </p>

                <div className={styles.eventFooter}>
                  <span className={styles.organizer}>
                    主催: {event.organizer}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;