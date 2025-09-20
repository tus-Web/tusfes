import { useState, useEffect, useCallback } from 'react';
import { UserReview, UserFavorite, PaginatedResponse, ApiError } from '@/types/user';

// Mock API functions (実際の実装では実際のAPIエンドポイントを使用)
const mockUserReviews: UserReview[] = [
  {
    id: '1',
    exhibitionId: 'ex1',
    exhibitionName: '化学実験ショー',
    location: '1号館 実験室A',
    schedule: '10:00-17:00',
    rating: 5,
    comment: 'とても楽しい実験でした！子供たちも大喜びでした。',
    createdAt: '2024-11-02T10:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    exhibitionId: 'ex2',
    exhibitionName: 'AIロボット展示',
    location: '2号館 展示ホール',
    schedule: '9:00-18:00',
    rating: 4,
    comment: '最新技術に触れることができて勉強になりました。',
    createdAt: '2024-11-02T14:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    exhibitionId: 'ex3',
    exhibitionName: 'VR体験コーナー',
    location: '3号館 VR体験室',
    schedule: '10:00-17:00',
    rating: 5,
    comment: '未来の技術を体感できて感動しました！',
    createdAt: '2024-11-02T16:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const mockUserFavorites: UserFavorite[] = [
  {
    id: '1',
    exhibitionId: 'ex4',
    exhibitionName: '美術部作品展',
    location: '1号館 ギャラリー',
    schedule: '9:00-17:00',
    createdAt: '2024-11-02T09:00:00Z',
    imageUrl: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: '展示',
    tags: ['アート・文化', '子供向け'],
  },
  {
    id: '2',
    exhibitionId: 'ex5',
    exhibitionName: '軽音楽部ライブ',
    location: '大講堂ステージ',
    schedule: '13:00-18:00',
    createdAt: '2024-11-02T11:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: '展示',
    tags: ['音楽・ステージ', '高校生'],
  },
];

// Mock API functions
const fetchUserReviews = async (page: number, limit: number): Promise<PaginatedResponse<UserReview>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockUserReviews.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: mockUserReviews.length,
      totalPages: Math.ceil(mockUserReviews.length / limit),
      hasNext: endIndex < mockUserReviews.length,
      hasPrev: page > 1,
    },
  };
};

const fetchUserFavorites = async (page: number, limit: number): Promise<PaginatedResponse<UserFavorite>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockUserFavorites.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: mockUserFavorites.length,
      totalPages: Math.ceil(mockUserFavorites.length / limit),
      hasNext: endIndex < mockUserFavorites.length,
      hasPrev: page > 1,
    },
  };
};

export const useUserReviews = (limit: number = 10) => {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<UserReview>['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const loadReviews = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchUserReviews(page, limit);
      setReviews(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError({
        message: 'レビュー履歴の取得に失敗しました',
        code: 'FETCH_REVIEWS_ERROR',
        details: err,
      });
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadReviews(1);
  }, [loadReviews]);

  return {
    reviews,
    pagination,
    loading,
    error,
    loadReviews,
    refetch: () => loadReviews(pagination?.page || 1),
  };
};

export const useUserFavorites = (limit: number = 10) => {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<UserFavorite>['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const loadFavorites = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchUserFavorites(page, limit);
      setFavorites(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError({
        message: 'お気に入りの取得に失敗しました',
        code: 'FETCH_FAVORITES_ERROR',
        details: err,
      });
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadFavorites(1);
  }, [loadFavorites]);

  const removeFavorite = useCallback(async (favoriteId: string) => {
    try {
      // Mock API call to remove favorite
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      
      // Update pagination if needed
      if (pagination && favorites.length === 1 && pagination.page > 1) {
        loadFavorites(pagination.page - 1);
      }
    } catch (err) {
      setError({
        message: 'お気に入りの削除に失敗しました',
        code: 'REMOVE_FAVORITE_ERROR',
        details: err,
      });
    }
  }, [favorites.length, pagination, loadFavorites]);

  return {
    favorites,
    pagination,
    loading,
    error,
    loadFavorites,
    removeFavorite,
    refetch: () => loadFavorites(pagination?.page || 1),
  };
};