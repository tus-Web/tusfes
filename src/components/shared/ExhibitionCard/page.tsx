import React from 'react'
import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import styles from './page.module.css'; 

interface FavoriteItem {
  id: string;
  name: string;
  location: string;
  schedule: string;
  tags: string[];
  description: string;
  organizer: string;
  type: '展示' | 'フード' | 'イベント' | 'アメニティ';
  imageUrl?: string;
}



export default function ExhibitionCard(item: FavoriteItem) {
    return (
        <div>
            <Link key={item.id} href={`/search/detail?id=${item.id}`} className={styles.favoriteCard}>
                <div className={styles.cardImage}>
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} />
                    ) : (
                        <div className={styles.imagePlaceholder}>画像なし</div>
                    )}
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardName}>{item.name}</h2>
                        <span className={styles.typeBadge}>{item.type}</span>
                    </div>
                    <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                            <MapPin size={14} />
                            <span>{item.location}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Clock size={14} />
                            <span>{item.schedule}</span>
                        </div>
                    </div>
                    <div className={styles.tags}>
                        {item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                    <p className={styles.description}>{item.description}</p>
                    <p className={styles.organizer}>{item.organizer}</p>
                </div>
            </Link>
        </div>
    )
}




