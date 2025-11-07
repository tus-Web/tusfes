"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock } from 'lucide-react';
import BottomBar from '@/src/components/shared/layout/BottomBar/BottomBar';
import { supabase } from '@/src/lib/supabase/client';
import { useAuth } from '@/src/components/shared/providers/AuthProvider/AuthProvider';
import './styles.css';
import ExhibitionModal from '@/src/components/pages/map/ExhibitionModal/ExhibitionModal';

interface ExhibitionData {
  id: number;
  exhibition_id: string;
  name: string;
  group_name: string | null;
  explanation: string | null;
  location: string | null;
  schedule: string | null;
  type: string | null;
  tags: string[] | null;
}

interface FavoriteItem {
  id: number;
  name: string;
  location: string;
  schedule: string;
  tags: string[];
  description: string;
  organizer: string;
  type: string;
  imageUrl?: string;
}

interface ExhibitionModalItem {
  id: number;
  name: string;
  type: string;
  subType?: string;
  position: { x: number; y: number };
  targetAudience: string[];
  description: string;
  detailedDescription?: string;
  location: string;
  schedule: string;
  capacity?: number;
  organizer: string;
  imageUrl?: string;
  tags: string[];
  reviews?: any[];
}

export default function PersonalPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState<ExhibitionModalItem | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      // ユーザーがログインしていない場合は処理をスキップ
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // favoriteテーブルからユーザーのお気に入りexhibition_idを取得
        const { data: favoriteData, error: favoriteError } = await supabase
          .from('favorite')
          .select('exhibition_id')
          .eq('user_id', user.id);

        if (favoriteError) {
          console.error('お気に入りの取得に失敗しました:', favoriteError);
          setIsLoading(false);
          return;
        }

        // お気に入りがない場合
        if (!favoriteData || favoriteData.length === 0) {
          setFavorites([]);
          setIsLoading(false);
          return;
        }

        // exhibition_idのリストを作成
        const exhibitionIds = favoriteData.map(fav => fav.exhibition_id);

        // exhibition tableから詳細情報を取得
        const { data: exhibitionsData, error: exhibitionsError } = await supabase
          .from('exhibition table')
          .select('*')
          .in('id', exhibitionIds);

        if (exhibitionsError) {
          console.error('展示データの取得に失敗しました:', exhibitionsError);
          setIsLoading(false);
          return;
        }

        // データを変換
        const transformedData: FavoriteItem[] = (exhibitionsData || []).map((item: ExhibitionData) => ({
          id: item.id,
          name: item.name || '名称未設定',
          location: item.location || '場所未設定',
          schedule: item.schedule || '時間未設定',
          tags: item.tags || [],
          description: item.explanation || '',
          organizer: item.group_name || '主催者未設定',
          type: item.type || '展示',
        }));

        setFavorites(transformedData);
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, loading]);

  const onBottomBarPressed = (id: string) => {
    router.push(`/${id}`);
  };

  if (loading || isLoading) {
    return (
      <div className="personal-page">
        <div className="container">
          <h1 className="page-title">お気に入りの企画</h1>
          <p className="no-favorites">読み込み中...</p>
        </div>
        <BottomBar activeTab="personal" onTabChange={onBottomBarPressed} />
      </div>
    );
  }

  return (
    <div className="personal-page">
      <div className="container">
        <h1 className="page-title">お気に入りの企画</h1>
        {favorites.length === 0 ? (
          <p className="no-favorites">お気に入りの企画がありません。</p>
        ) : (
            <div className="favorites-list">
              {favorites.map((item) => {
                const onCardClick = () => {
                  // map FavoriteItem -> ExhibitionModalItem with sensible defaults
                  const exhibition: ExhibitionModalItem = {
                    id: item.id,
                    name: item.name,
                    type: item.type || '展示',
                    position: { x: 50, y: 50 }, // default center position
                    targetAudience: [],
                    description: item.description || '',
                    detailedDescription: item.description || '',
                    location: item.location || '',
                    schedule: item.schedule || '',
                    organizer: item.organizer || '',
                    imageUrl: item.imageUrl,
                    tags: item.tags || [],
                  };

                  setSelectedExhibition(exhibition);
                  setModalOpen(true);
                };

                return (
                  <div key={item.id} className="favorite-card" onClick={onCardClick} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') onCardClick(); }}>
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
                        {item.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      <p className="description">{item.description}</p>
                      <p className="organizer">{item.organizer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
        )}
      </div>
        <BottomBar activeTab="personal" onTabChange={onBottomBarPressed} />

        {/* Exhibition Modal */}
        {selectedExhibition && (
          <ExhibitionModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              // keep selected to allow animation; clear after close
              setTimeout(() => setSelectedExhibition(null), 300);
            }}
            exhibition={selectedExhibition}
          />
        )}
    </div>
  );
}