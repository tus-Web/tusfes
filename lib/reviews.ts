import { supabase } from '@/lib/supabase/client';

export interface Review {
  id: number;
  display_id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at?: string;
}

/**
 * Fetch reviews for a specific display/exhibition
 */
export async function fetchReviews(displayId: number): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('display_id', displayId);

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

/**
 * Submit a new review
 */
export async function submitReview(params: {
  displayId: number;
  userId: string;
  rating: number;
  comment: string;
}): Promise<{ success: boolean; error?: string }> {
  const { displayId, userId, rating, comment } = params;

  if (!comment || comment.length === 0) {
    return { success: false, error: 'レビューを書いて下さい' };
  }

  const { error } = await supabase
    .from('reviews')
    .insert([
      {
        comment,
        display_id: displayId,
        rating,
        user_id: userId,
      },
    ]);

  if (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: '投稿失敗' };
  }

  return { success: true };
}
