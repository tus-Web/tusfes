import { supabase } from './supabase';

export interface Review {
  id: number;
  display_id: number;
  user_id: number;
  rating: number;
  comment: string;
}

/**
 * レビューを全件取得
 */
export async function fetchAllReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*');
  
  if (error) {
    console.error('Fetch reviews error:', error);
    return [];
  }
  return data || [];
}

/**
 * 表示IDでレビューを取得
 */
export async function fetchReviewsByDisplayId(displayId: number) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('display_id', displayId);

  if (error) {
    console.error('Fetch reviews by display ID error:', error);
    return [];
  }
  return data || [];
}

/**
 * レビューを投稿
 */
export async function submitReview(review: {
  comment: string;
  display_id: number;
  rating: number;
}) {
  const { error } = await supabase
    .from('reviews')
    .insert([review]);

  if (error) {
    console.error('Submit review error:', error);
    return { success: false, error };
  }
  return { success: true, error: null };
}
