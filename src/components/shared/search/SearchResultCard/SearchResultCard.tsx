import React from 'react';
import Link from 'next/link';
import styles from './SearchResultCard.module.css';
import { Event } from '@/types/event';
import { useFavorites } from '@/src/hooks/useFavorites';

// 後方互換性のためのエイリアス
export type SearchItem = Event;

interface SearchResultCardProps {
  item: Event;
}

export default function SearchResultCard({ item }: SearchResultCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.id);

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(item.id);
  };

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
        <div className={styles.favoriteRow}>
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`${styles.favoriteButton} ${favorite ? styles.favoriteActive : ''}`}
            aria-pressed={favorite}
            aria-label={favorite ? 'お気に入りを解除' : 'お気に入りに追加'}
          >
            {favorite ? '★ お気に入り済み' : '☆ お気に入りに追加'}
          </button>
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
