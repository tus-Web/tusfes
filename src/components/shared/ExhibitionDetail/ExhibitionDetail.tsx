"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Chip, Box, Tabs, Tab, Rating, TextField, Button } from '@mui/material';
import { ZoomIn, ImageNotSupported, Star, StarBorder } from '@mui/icons-material';
import styles from '@/src/components/pages/map/ExhibitionModal/ExhibitionModal.module.css';
import { supabase } from '@/src/lib/supabase/client';

interface Review {
  id: number;
  rating: number;
  comment: string;
  author?: string;
  avatar?: string;
  date?: string;
}

interface ExhibitionItem {
  id?: string | number;
  name?: string;
  type?: string;
  subType?: string;
  position?: { x: number; y: number };
  targetAudience?: string[];
  description?: string;
  detailedDescription?: string;
  location?: string;
  schedule?: string;
  capacity?: number;
  organizer?: string;
  imageUrl?: string;
  tags?: string[];
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

const ExhibitionDetail: React.FC<{ exhibition: ExhibitionItem | null }> = ({ exhibition }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!exhibition?.id) return;
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('display_id', exhibition.id);

      if (!error && data) {
        setReviews(data as Review[]);
      }
    };
    fetchReviews();
  }, [exhibition?.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exhibition?.id) return;
    if (comment.length === 0) {
      alert('レビューを書いて下さい');
      return;
    }

    try {
      const { error } = await supabase.from('reviews').insert([
        {
          comment: comment,
          display_id: exhibition.id,
          rating: rating,
        },
      ]);
      if (error) throw error;
      setComment('');
      const { data } = await supabase.from('reviews').select('*').eq('display_id', exhibition.id);
      setReviews(data || []);
      alert('レビューを送信しました！');
    } catch (err) {
      alert('投稿失敗');
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case '子供向け':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
      case '高校生':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
      case '大学生':
        return { bg: 'rgba(139, 69, 19, 0.1)', color: '#8B4513' };
      case '展示':
        return { bg: 'rgba(168, 85, 247, 0.1)', color: '#A855F7' };
      case 'フード':
        return { bg: 'rgba(245, 101, 101, 0.1)', color: '#F56565' };
      case 'イベント':
        return { bg: 'rgba(236, 201, 75, 0.1)', color: '#ECC94B' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' };
    }
  };

  if (!exhibition) return null;

  return (
    <div className={styles.dialogContent}>
      {/* Image */}
      <div className={styles.imageSection}>
        {exhibition.imageUrl ? (
          <div
            className={`${styles.imageContainer} ${isImageZoomed ? styles.imageZoomed : ''}`}
            onClick={() => { if (imageLoaded && !imageError) setIsImageZoomed(!isImageZoomed); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' && imageLoaded && !imageError) setIsImageZoomed(!isImageZoomed); }}
            aria-label={exhibition.name + ' の画像'}
          >
            {!imageError ? (
              <img
                src={exhibition.imageUrl}
                alt={exhibition.name}
                className={styles.exhibitionImage}
                onLoad={() => { setImageLoaded(true); setImageError(false); }}
                onError={() => { setImageError(true); setImageLoaded(false); }}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <ImageNotSupported className={styles.placeholderIcon} />
                <div className={styles.placeholderText}>画像を読み込めませんでした</div>
              </div>
            )}

            <div className={styles.imageOverlay}>
              <ZoomIn className={styles.zoomIcon} />
              <span className={styles.zoomText}>拡大する</span>
            </div>
          </div>
        ) : (
          <div className={styles.imagePlaceholder}>
            <ImageNotSupported className={styles.placeholderIcon} />
            <div className={styles.placeholderText}>画像がありません</div>
          </div>
        )}
      </div>

      {/* Title */}
      <div className={styles.titleSection}>
        <Typography variant="h4" component="h1" className={styles.exhibitionTitle}>
          {exhibition.name}
        </Typography>
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <span>{exhibition.location}</span>
          </div>
          <div className={styles.metaItem}>
            <span>{exhibition.schedule}</span>
          </div>
          {exhibition.capacity && (
            <div className={styles.metaItem}>
              <span>定員 {exhibition.capacity}名</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className={styles.tagsSection}>
        {(exhibition.tags || []).map((tag, index) => {
          const tagStyle = getTagColor(tag);
          return (
            <Chip
              key={tag}
              label={tag}
              className={styles.tag}
              sx={{ backgroundColor: tagStyle.bg, color: tagStyle.color, fontWeight: 600, fontSize: '0.8rem' }}
            />
          );
        })}
      </div>

      {/* Reviews / Tabs */}
      <div className={styles.reviewsSection}>
        <Box className={styles.tabsContainer}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} className={styles.tabs}>
            <Tab label="説明" />
            <Tab label="レビュー" />
          </Tabs>
        </Box>

        <Box className={styles.tabContent}>
          {tabValue === 0 && (
            <div>
              <div className={styles.descriptionSection}>
                <Typography variant="h6" className={styles.descriptionTitle}>展示説明</Typography>
                <div className={styles.descriptionContent}>
                  <Typography variant="body1" className={styles.descriptionText}>
                    {exhibition.detailedDescription || exhibition.description}
                  </Typography>
                  {exhibition.organizer && (
                    <div className={styles.organizerInfo}>
                      <Typography variant="body2" className={styles.organizerLabel}>主催者:</Typography>
                      <Typography variant="body2" className={styles.organizerName}>{exhibition.organizer}</Typography>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.reviewsList}>
                {reviews.length > 0 ? (
                  <p>レビューが投稿されております</p>
                ) : (
                  <div className={styles.noReviews}>
                    <Typography variant="body1" color="textSecondary">まだレビューがありません。最初のレビューを投稿してみませんか？</Typography>
                  </div>
                )}
              </div>
            </div>
          )}

          {tabValue === 1 && (
            <div className={styles.reviewForm}>
              <Box className={styles.ratingSection}>
                <Typography variant="h6" className={styles.ratingLabel}>評価 <span className={styles.required}>*</span></Typography>
                <Rating size="large" value={rating} onChange={(_, newValue) => setRating(newValue)} className={styles.rating} />
              </Box>

              <Box className={styles.commentSection}>
                <Typography variant="h6" className={styles.commentLabel}>コメント</Typography>
                <TextField fullWidth multiline rows={4} variant="outlined" placeholder="体験の感想をお聞かせください..." value={comment} onChange={(e) => setComment(e.target.value)} className={styles.textField} inputProps={{ maxLength: 500 }} helperText={`${comment.length}/500文字`} />
              </Box>

              <Button onClick={handleSubmitReview} variant="contained" disabled={!rating} className={styles.submitButton} sx={{ alignSelf: 'center' }}>レビューを投稿</Button>

              <h2>レビュー一覧</h2>
              <ul>
                {reviews.map((review) => (
                  <li key={review.id}>{review.comment} (評価:{review.rating})</li>
                ))}
              </ul>
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default ExhibitionDetail;
