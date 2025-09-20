'use client';

import React from 'react';
import { Button } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import styles from './ReviewList.module.css';

interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  avatar: string;
  date: string;
}

interface ReviewListProps {
  onOpenModal: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={styles.star}>
          {star <= rating ? (
            <Star fontSize="small" style={{ color: '#ffd700' }} />
          ) : (
            <StarBorder fontSize="small" style={{ color: '#ddd' }} />
          )}
        </span>
      ))}
    </div>
  );
};

const mockReviews: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: '毎年楽しみにしている理大祭！科学実験のブースが特に面白くて、子供たちも大興奮でした。来年も絶対来ます！',
    author: 'サイエンス好き',
    avatar: '🧪',
    date: '2023-11-05',
  },
  {
    id: 2,
    rating: 4,
    comment: '研究室の展示がとても充実していて勉強になりました。学食のメニューも美味しかったです。',
    author: 'リサーチャー',
    avatar: '🔬',
    date: '2023-11-04',
  },
  {
    id: 3,
    rating: 5,
    comment: 'ロボットのデモンストレーションが圧巻でした！理科大の学生さんたちの技術力の高さに感動。',
    author: 'テック愛好家',
    avatar: '🤖',
    date: '2023-11-03',
  },
  {
    id: 4,
    rating: 4,
    comment: '家族連れでも楽しめるイベントがたくさんありました。駐車場の案内がもう少し分かりやすいと良いかも。',
    author: 'ファミリー',
    avatar: '👨‍👩‍👧‍👦',
    date: '2023-11-03',
  },
  {
    id: 5,
    rating: 5,
    comment: '化学実験のショーが面白すぎて時間を忘れました。学生さんたちの説明も分かりやすくて最高！',
    author: 'ケミストリー',
    avatar: '⚗️',
    date: '2023-11-02',
  },
];

const ReviewList: React.FC<ReviewListProps> = ({ onOpenModal }) => {
  return (
    <div className={styles.reviewList}>
      <div className={styles.header}>
        <h2 className={styles.title}>来場者レビュー</h2>
        <Button
          variant="contained"
          onClick={onOpenModal}
          className={styles.writeButton}
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            borderRadius: '25px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
            },
          }}
        >
          レビューを書く
        </Button>
      </div>

      <div className={styles.reviews}>
        {mockReviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>{review.avatar}</div>
                <div className={styles.authorDetails}>
                  <div className={styles.authorName}>{review.author}</div>
                  <div className={styles.reviewDate}>{review.date}</div>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <div className={styles.reviewComment}>
              {review.comment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;