"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Clock } from 'lucide-react';
import BottomBar from '@/src/components/shared/layout/BottomBar/BottomBar';
import ExhibitionModal from '@/components/pages/map/ExhibitionModal/ExhibitionModal';
import './styles.css';

import type { EventsJSONItem } from '@/types/event';
import events from '@/src/data/events.json';


interface FavoriteItem {
  id: number;
  name: string;
  location: string;
  schedule: string;
  tags: string[];
  description: string;
  organizer: string;
  type: '展示' | 'フード' | 'イベント' | 'アメニティ';
  imageUrl?: string;
}

export default function PersonalPage() {
  const router = useRouter();
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<any | null>(null);

  const onBottomBarPressed = (id: string) => {
    router.push(`/${id}`);
  };

  useEffect(() => {
    const favoriteIds = JSON
      .parse(localStorage.getItem('favoriteExhibitions') || '[]')
      .map((id: any) => String(id));

    // events.jsonからお気に入りの企画データをフィルタリング
    const favoriteEvents: EventsJSONItem[] = events.filter(event => favoriteIds.includes(event.id)) as any[];
    const favoriteItems: FavoriteItem[] = favoriteEvents.map(event => ({
      id: Number(event.id),
      name: event.name,
      location: event.location,
      schedule: '',
      tags: event.tags || [],
      description: event.description,
      organizer: event.organization,
      type: (event.category as '展示' | 'フード' | 'イベント' | 'アメニティ') || '展示',
      imageUrl: event.imageUrl || undefined,
    }));

    setFavoriteItems(favoriteItems);
  }, []);

  const handleCardClick = (e: React.MouseEvent, item: FavoriteItem) => {
    e.preventDefault();
    const mapped = {
      id: Number(item.id) || item.id,
      name: item.name,
      type: item.type || '展示',
      position: { x: 50, y: 50 },
      targetAudience: item.tags || [],
      description: item.description || '',
      detailedDescription: item.description || '',
      location: item.location || '',
      schedule: item.schedule || '',
      organizer: item.organizer || '',
      imageUrl: item.imageUrl || null,
      tags: item.tags || [],
      reviews: [],
    } as any;
    setSelectedExhibition(mapped);
  };

  return (
    <div className="personal-page">
      <div className="container">
        <h1 className="page-title">お気に入りの企画</h1>
        {favoriteItems.length === 0 ? (
          <p className="no-favorites">お気に入りの企画がありません。</p>
        ) : (
          <div className="favorites-list">
            {favoriteItems.map((item) => (
              <div 
                key={item.id} 
                onClick={(e) => handleCardClick(e, item)}
                className="favorite-card"
                style={{ cursor: 'pointer' }}
              >
                <div className="card-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="image-placeholder">画像なし</div>
                  )}
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h2 className="card-name">{item.name}</h2>
                    <span className="type-badge">{item.type}</span>
                  </div>
                  <div className="card-meta">
                    <div className="meta-item">
                      <MapPin size={14} />
                      <span>{item.location}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{item.schedule}</span>
                    </div>
                  </div>
                  <div className="tags">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <p className="description">{item.description}</p>
                  <p className="organizer">{item.organizer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <ExhibitionModal 
        open={!!selectedExhibition}
        onClose={() => setSelectedExhibition(null)}
        exhibition={selectedExhibition}
      />
      
      <BottomBar activeTab="personal" onTabChange={onBottomBarPressed} />
    </div>
  );
}