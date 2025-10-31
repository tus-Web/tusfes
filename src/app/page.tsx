'use client';

import Link from 'next/link';
import { useAuth } from '@/components/shared/providers/AuthProvider/AuthProvider';
import styles from './page.module.css';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>認証中...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Now TopPage!</h1>
      {user && (
        <div className={styles.userInfo}>
          <p>ユーザーID: {user.id}</p>
          <p>匿名ユーザー: {user.is_anonymous ? 'はい' : 'いいえ'}</p>
        </div>
      )}
      <Link href="/home">
        <button className={styles.button}>
          Go to HomePage
        </button>
      </Link>
    </div>
  );
}