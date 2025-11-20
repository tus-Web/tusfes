'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getEventById } from '@/lib/events';
import styles from './page.module.css';

function DetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className={styles.container}>
        <p>イベントIDが指定されていません。</p>
      </div>
    );
  }

  const event = getEventById(id);

  if (!event) {
    return (
      <div className={styles.container}>
        <p>指定されたイベントが見つかりません。</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>{event.name}</h1>
      <div className={styles.category}>{event.category}</div>
      <div className={styles.organization}>主催: {event.organization}</div>
      <div className={styles.location}>📍 {event.location}</div>
      <div className={styles.tags}>
        {event.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <p className={styles.description}>{event.description}</p>
    </div>
  );
}

export default function Detail() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <DetailContent />
    </Suspense>
  );
}
