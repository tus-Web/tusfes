import React from 'react';
import Link from 'next/link';
import styles from './SearchResultCard.module.css';

export interface SearchItem {
  id: string;
  name: string;
  category: '展示' | 'フード' | 'イベント' | 'アメニティ';
  tags: string[];
  description: string;
  location: string;
  imageUrl?: string;
}

interface SearchResultCardProps {
  item: SearchItem;
}

export default function SearchResultCard({ item }: SearchResultCardProps) {
  return (
    <Link href={`/search/detail?id=${item.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span>画像なし</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{item.name}</h3>
          <span className={styles.category}>{item.category}</span>
        </div>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.footer}>
          <span className={styles.location}>📍 {item.location}</span>
          <div className={styles.tags}>
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
