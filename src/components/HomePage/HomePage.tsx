'use client';

import React, { useState } from 'react';
import TopPage from '../TopPage/TopPage';
import MapPage from '../MapPage/MapPage';
import CalendarPage from '../CalendarPage/CalendarPage';
import SettingsPage from '../SettingsPage/SettingsPage';
import BottomBar from '../BottomBar/BottomBar';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const [showMainApp, setShowMainApp] = useState(false);
  const [activeTab, setActiveTab] = useState('map');

  const handleEnterFestival = () => {
    setShowMainApp(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <MapPage onLocationSelect={() => {}} />
        );
      case 'calendar':
        return (
          <CalendarPage />
        );
      case 'settings':
        return (
          <SettingsPage />
        );
      default:
        return null;
    }
  };

  // 入場画面を表示
  if (!showMainApp) {
    return <TopPage onCTAClick={handleEnterFestival} />;
  }

  // メインアプリを表示
  return (
    <div className={styles.homePage}>
      <main className={styles.main}>
        {renderContent()}
      </main>
      <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default HomePage;