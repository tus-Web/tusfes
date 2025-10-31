'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { getUserSession, signInAnonymously } from '@/lib/auth';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getUserSession();
      if (session) {
        router.push('/home');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async () => {
    console.log('login success');
    const result = await signInAnonymously();
    if (result.error) {
      console.error(result.error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Now TopPage!</h1>
      <button onClick={handleLogin}>
        <Link href="/home">Go to HomePage</Link>
      </button>
    </div>
  );
}