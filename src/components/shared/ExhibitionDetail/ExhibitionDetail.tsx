"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  Typography, 
  Chip, 
  Box, 
  Tabs, 
  Tab, 
  Rating, 
  TextField, 
  Button,
  DialogContent,
  IconButton
} from '@mui/material';
import {
  Close,
  Favorite,
} from '@mui/icons-material';
import { ZoomIn, ImageNotSupported, Star, StarBorder } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { detectAbuse } from 'abuse-detection';
import { supabase } from '@/src/lib/supabase/client';
import styles from './ExhibitionDetail.module.css';

interface Review {
  id: number;
  rating: number;
  comment: string;
  author?: string;
  avatar?: string;
  date?: string;
}

interface ExhibitionItem {
  id?: number;
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

type ExhibitionDetailProps = {
  open: boolean;
  onClose: () => void;
  exhibition: ExhibitionItem | null;
};

const ExhibitionDetail: React.FC<ExhibitionDetailProps> = ({
  open,
  onClose,
  exhibition
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);

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

  useEffect(() => {
    // まず、お気に入りリストをローカルストレージから取得
    const favoriteExhibitions = JSON.parse(localStorage.getItem('favoriteExhibitions') || '[]');
    // 現在の展示がリストに含まれているか確認
    if (exhibition?.id && favoriteExhibitions.includes(exhibition.id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [exhibition]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exhibition?.id) return;
    
    const result = detectAbuse(comment);

    if(result.hasAbusiveWords){
      alert('不適切な言葉が含まれています。');
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

  // Focus management for accessibility
  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  const onFavoriteClick = () => {
    if (!exhibition?.id) return;

    const favoriteExhibitions = JSON.parse(localStorage.getItem('favoriteExhibitions') || '[]');
    if (isFavorite) {
      const updatedFavorites = favoriteExhibitions.filter((id: number) => id !== exhibition.id);
      localStorage.setItem('favoriteExhibitions', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favoriteExhibitions.push(exhibition.id);
      localStorage.setItem('favoriteExhibitions', JSON.stringify(favoriteExhibitions));
      setIsFavorite(true);
    }
  };

  if (!exhibition) return null;

  return (
    <div className={styles.exhibitionDetailContainer}>
      <IconButton
        ref={closeButtonRef}
        onClick={onClose}
        className={styles.closeButton}
        aria-label="モーダルを閉じる"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(70, 48, 48, 0.5)',
          },
        }}
      >
        <Close />
      </IconButton>
      <IconButton
        className={styles.favoriteButton}
        aria-label="お気に入りに追加"
        onClick={onFavoriteClick}
        sx={{
          position: 'absolute',
          top: 16,
          right: 64,
          zIndex: 10,
          backgroundColor: isFavorite ? 'rgba(255, 15, 55, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          '&:hover': {
            backgroundColor: isFavorite ? 'rgba(255, 117, 142, 0.5)' : 'rgba(70, 48, 48, 0.5)',
          },
        }}
      >
        <Favorite />
      </IconButton>
      <DialogContent className={styles.dialogContent}>
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


                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
                    レビュー一覧 ({reviews.length})
                  </h2>
                  
                  <ul className={styles.reviewList}>
                    {reviews.length === 0 && (
                      <li className={styles.noReview}>
                        まだレビューはありません。最初の投稿者になりましょう！
                      </li>
                    )}

                    {reviews.map((review) => (
                      <li key={review.id} className={styles.reviewItem}>
                        {/* ヘッダー：アイコン・名前・星評価 */}
                        <div className={styles.reviewHeader}>
                          {/* MUIのRatingコンポーネントで星を表示 */}
                          <Rating value={review.rating} readOnly size="small" />
                        </div>

                        {/* コメント本文 */}
                        <p className={styles.reviewComment}>
                          {review.comment}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Box>
          </div>
        </div>
      </DialogContent>
    </div>
  );
};

export default ExhibitionDetail;
