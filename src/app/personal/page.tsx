"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Clock } from 'lucide-react';
import BottomBar from '@/src/components/shared/layout/BottomBar/BottomBar';
import ExhibitionModal from '@/components/pages/map/ExhibitionModal/ExhibitionModal';
import './styles.css';

import { SupabaseExhibition } from '@/types/event';
import { supabase } from '@/src/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { useAuth } from '@/src/components/shared/providers/AuthProvider/AuthProvider';

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

// const favoriteData: FavoriteItem[] = [
//   {
//     id: '1',
//     name: '伝統工芸展示',
//     location: '展示ホールA',
//     schedule: '10:00-12:00',
//     tags: ['伝統', '工芸', '文化'],
//     description: '日本の伝統工芸品を展示する特別企画。職人たちの技を間近で感じることができます。',
//     organizer: '文化振興協会',
//     type: '展示',
//     imageUrl: '/img/tmp_img1.jpg'
//   },
//   {
//     id: '2',
//     name: '地元グルメフェスティバル',
//     location: 'フードコート',
//     schedule: '11:00-15:00',
//     tags: ['グルメ', '地元', 'フェスティバル'],
//     description: '地元の美味しい食べ物を集めたフェスティバル。様々な味覚を楽しめます。',
//     organizer: '地元商工会',
//     type: 'フード',
//     imageUrl: '/img/tmp_img2.jpg'
//   },
//   {
//     id: '3',
//     name: '音楽ライブイベント',
//     location: 'メインステージ',
//     schedule: '18:00-21:00',
//     tags: ['音楽', 'ライブ', 'エンターテイメント'],
//     description: '人気アーティストによるライブパフォーマンス。忘れられない夜を過ごせます。',
//     organizer: 'イベント企画会社',
//     type: 'イベント',
//     imageUrl: '/img/tmp_img3.jpg'
//   },
//   {
//     id: '4',
//     name: 'リラクゼーションコーナー',
//     location: 'ウェルネスエリア',
//     schedule: '09:00-17:00',
//     tags: ['リラクゼーション', 'ウェルネス', '健康'],
//     description: 'マッサージやヨガなど、心と体のリフレッシュができるスペースです。',
//     organizer: 'ウェルネスセンター',
//     type: 'アメニティ',
//     imageUrl: '/img/tmp_img4.jpg'
//   },
//   {
//     id: '5',
//     name: '写真コンテスト展示',
//     location: 'ギャラリーB',
//     schedule: '13:00-16:00',
//     tags: ['写真', 'コンテスト', 'アート'],
//     description: '一般公募の写真作品を展示。素晴らしい作品が揃っています。',
//     organizer: '写真協会',
//     type: '展示',
//     imageUrl: '/img/tmp_img5.jpg'
//   },
//   {
//     id: '6',
//     name: 'ワークショップ体験',
//     location: 'ワークショップルーム',
//     schedule: '14:00-16:00',
//     tags: ['ワークショップ', '体験', '学び'],
//     description: '手作り体験ができるワークショップ。子供から大人まで楽しめます。',
//     organizer: '教育センター',
//     type: 'イベント'
//   }
// ];

export default function PersonalPage() {
  const router = useRouter();
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<any | null>(null);
  const { user, loading } = useAuth();

  const onBottomBarPressed = (id: string) => {
    router.push(`/${id}`);
  };

  useEffect(() => {
    if (loading || !user?.id) {
      return;
    }

    const fetchFavoriteData = async () => {
      const { data: favoriteExhibitions, error } : { data: any[] | null, error: PostgrestError | null } = await supabase
        .from("favorite")
        .select(`
          exhibition_id,
          "exhibition table"!favorite_exhibition_id_fkey (
            id,
            name,
            location,
            schedule,
            tags,
            explanation,
            group_name,
            type
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorite data:', error);
        return;
      }

      if (favoriteExhibitions) {
        const mappedFavoriteItems: FavoriteItem[] = favoriteExhibitions
          .map((item: any) => item['exhibition table'])
          .filter((item: SupabaseExhibition | null) => item !== null)
          .map((item: SupabaseExhibition) => ({
            id: item.id || -1,
            name: item.name || '無題',
            location: item.location || '',
            schedule: item.schedule || '',
            tags: item.tags || [],
            description: item.explanation || '',
            organizer: item.group_name || '',
            type: item.type || '展示',
          }));

        setFavoriteItems(mappedFavoriteItems);
      }
    }

    fetchFavoriteData();
  }, [loading, user?.id]);

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
        {loading ? (
          <p className="no-favorites">読み込み中...</p>
        ) : !user?.id ? (
          <p className="no-favorites">お気に入りを表示するにはサインインしてください。</p>
        ) : favoriteItems.length === 0 ? (
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
                    {/* <span className="type-badge">{item.type}</span> */}
                  </div>
                  <div className="card-meta">
                    <div className="meta-item">
                      <MapPin size={14} />
                      <span>{item.location}</span>
                    </div>
                    {/* <div className="meta-item">
                      <Clock size={14} />
                      <span>{item.schedule}</span>
                    </div> */}
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