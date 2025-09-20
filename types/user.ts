export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserReview {
  id: string;
  exhibitionId: string;
  exhibitionName: string;
  location: string;
  schedule: string;
  rating: number;
  comment: string;
  createdAt: string;
  imageUrl?: string;
}

export interface UserFavorite {
  id: string;
  exhibitionId: string;
  exhibitionName: string;
  location: string;
  schedule: string;
  createdAt: string;
  imageUrl?: string;
  type: string;
  tags: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}