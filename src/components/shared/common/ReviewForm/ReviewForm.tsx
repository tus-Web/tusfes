'use client';

import React, { useState } from 'react';
import { submitReview } from '@/lib/reviews';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
  displayId: number;
  userId: string;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  displayId,
  userId,
  onSuccess,
}) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('ユーザー認証に失敗しました');
      return;
    }

    const result = await submitReview({
      displayId,
      userId,
      rating,
      comment: reviewText,
    });

    if (result.success) {
      alert('レビューを送信しました！');
      setReviewText('');
      setRating(5);
      onSuccess?.();
    } else {
      alert(result.error || '投稿失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <h2 className={styles.ratingLabel}>評価: {rating}</h2>
      <input
        type="range"
        min="0"
        max="5"
        step="1"
        value={rating}
        onChange={(e) => setRating(parseFloat(e.target.value))}
        className={styles.ratingSlider}
      />

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="レビューを入力してください"
        className={styles.textarea}
      />

      <button type="submit" className={styles.submitButton}>
        レビューを投稿
      </button>
    </form>
  );
};
