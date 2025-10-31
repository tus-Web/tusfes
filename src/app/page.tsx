'use client';

import Link from 'next/link';
import { useAuth } from '@/components/shared/providers/AuthProvider/AuthProvider';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{textAlign: 'center', marginTop: '50px'}}>
        <p>認証中...</p>
      </div>
    );
  }

  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      <h1>Now TopPage!</h1>
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p>ユーザーID: {user.id}</p>
          <p>匿名ユーザー: {user.is_anonymous ? 'はい' : 'いいえ'}</p>
        </div>
      )}
      <Link href="/home">
        <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Go to HomePage
        </button>
      </Link>
    </div>
  );
}