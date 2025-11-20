'use client';

import React, { useEffect, useState } from 'react';
import styles from './PWAInstallPrompt.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // スタンドアロンモード（既にインストール済み）かチェック
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode);

    // iOS判定
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 既にインストール済みまたは以前に閉じた場合は表示しない
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (isInStandaloneMode || dismissed) {
      return;
    }

    // Android/Chrome用のインストールプロンプト
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOSの場合は自動的に表示
    if (isIOSDevice && !isInStandaloneMode && !dismissed) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWAインストールが承認されました');
    } else {
      console.log('PWAインストールが拒否されました');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.promptCard}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <span className={styles.iconText}>祭</span>
          </div>
          <h2 className={styles.title}>理大祭アプリ</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            理大祭特設サイトをアプリとしてインストールしますか？
          </p>
          
          {isIOS ? (
            <div className={styles.iosInstructions}>
              <p className={styles.iosText}>
                Safari の共有ボタン <span className={styles.shareIcon}>⎙</span> をタップして
              </p>
              <p className={styles.iosText}>
                「ホーム画面に追加」を選択してください
              </p>
            </div>
          ) : (
            <ul className={styles.features}>
              <li>📱 ホーム画面から素早くアクセス</li>
              <li>🚀 高速な読み込み</li>
              <li>📡 オフラインでも利用可能</li>
            </ul>
          )}
        </div>

        <div className={styles.actions}>
          {!isIOS && deferredPrompt && (
            <button className={styles.installButton} onClick={handleInstallClick}>
              インストール
            </button>
          )}
          <button className={styles.dismissButton} onClick={handleDismiss}>
            {isIOS ? '閉じる' : '後で'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
