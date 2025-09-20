'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Chip,
  Typography,
  Box,
  IconButton,
  Tabs,
  Tab,
  Rating,
  TextField,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close, 
  LocationOn, 
  AccessTime, 
  Group,
  ImageNotSupported,
  ZoomIn,
  Star,
  StarBorder
} from '@mui/icons-material';
import styles from './ExhibitionModal.module.css';

interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  avatar: string;
  date: string;
}

interface ExhibitionItem {
  id: number;
  name: string;
  type: string;
  subType?: string;
  position: { x: number; y: number };
  targetAudience: string[];
  description: string;
  detailedDescription: string;
  location: string;
  schedule: string;
  capacity?: number;
  organizer: string;
  imageUrl?: string;
  tags: string[];
  reviews?: Review[];
}

interface ExhibitionModalProps {
  open: boolean;
  onClose: () => void;
  exhibition: ExhibitionItem | null;
}

const mockReviews: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: 'とても楽しい実験でした！子供たちも大喜びでした。',
    author: 'サイエンス好き',
    avatar: '🧪',
    date: '2024-11-02',
  },
  {
    id: 2,
    rating: 4,
    comment: '分かりやすい説明で勉強になりました。',
    author: 'リサーチャー',
    avatar: '🔬',
    date: '2024-11-02',
  },
];

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

const ExhibitionModal: React.FC<ExhibitionModalProps> = ({ 
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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  // Keyboard event handling
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

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageClick = () => {
    if (imageLoaded && !imageError) {
      setIsImageZoomed(!isImageZoomed);
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

  const handleSubmitReview = () => {
    if (!rating || !comment.trim()) return;
    
    // Here you would typically send the review to your backend
    console.log('Submitting review:', { rating, comment });
    
    // Reset form
    setRating(0);
    setComment('');
    setTabValue(0); // Switch back to reviews tab
    
    // Show success message (you could add a toast notification here)
    alert('レビューを投稿しました！');
  };

  const renderMiniMap = () => {
    if (!exhibition) return null;

    return (
      <div className={styles.miniMap}>
        <div className={styles.miniMapContainer}>
          <div className={styles.miniMapBackground}>
            {/* Campus buildings */}
            <div className={styles.miniBuilding} style={{ top: '20%', left: '15%', width: '25%', height: '30%' }}>
              <span className={styles.miniBuildingLabel}>1号館</span>
            </div>
            <div className={styles.miniBuilding} style={{ top: '20%', right: '15%', width: '25%', height: '30%' }}>
              <span className={styles.miniBuildingLabel}>2号館</span>
            </div>
            <div className={styles.miniBuilding} style={{ bottom: '20%', left: '15%', width: '25%', height: '25%' }}>
              <span className={styles.miniBuildingLabel}>3号館</span>
            </div>
            <div className={styles.miniBuilding} style={{ bottom: '20%', right: '15%', width: '25%', height: '25%' }}>
              <span className={styles.miniBuildingLabel}>中庭</span>
            </div>
            
            {/* Exhibition location pin */}
            <motion.div
              className={styles.miniPin}
              style={{
                left: `${exhibition.position.x}%`,
                top: `${exhibition.position.y}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <LocationOn className={styles.miniPinIcon} />
            </motion.div>
          </div>
        </div>
        <Typography variant="caption" className={styles.miniMapLabel}>
          📍 {exhibition.location}
        </Typography>
      </div>
    );
  };

  if (!exhibition) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: styles.dialogPaper,
        style: {
          borderRadius: '20px',
          background: 'var(--color-bg-secondary)',
          maxHeight: '90vh',
          overflow: 'hidden',
        }
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
        }
      }}
      aria-labelledby="exhibition-modal-title"
      aria-describedby="exhibition-modal-description"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={styles.modalContent}
          >
            {/* Close Button */}
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
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <Close />
            </IconButton>

            <DialogContent className={styles.dialogContent}>
              {/* 1. Image Section */}
              <div className={styles.imageSection}>
                {exhibition.imageUrl && !imageError ? (
                  <motion.div
                    className={`${styles.imageContainer} ${isImageZoomed ? styles.imageZoomed : ''}`}
                    onClick={handleImageClick}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={exhibition.imageUrl}
                      alt={`${exhibition.name}の画像`}
                      className={styles.exhibitionImage}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {imageLoaded && (
                      <div className={styles.imageOverlay}>
                        <ZoomIn className={styles.zoomIcon} />
                        <span className={styles.zoomText}>クリックで拡大</span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <ImageNotSupported className={styles.placeholderIcon} />
                    <Typography variant="body2" className={styles.placeholderText}>
                      画像を読み込めませんでした
                    </Typography>
                  </div>
                )}
              </div>

              {/* 2. Title Section */}
              <div className={styles.titleSection}>
                <Typography 
                  variant="h4" 
                  component="h1"
                  id="exhibition-modal-title"
                  className={styles.exhibitionTitle}
                >
                  {exhibition.name}
                </Typography>
                
                {/* Meta information */}
                <div className={styles.metaInfo}>
                  <div className={styles.metaItem}>
                    <LocationOn className={styles.metaIcon} />
                    <span>{exhibition.location}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <AccessTime className={styles.metaIcon} />
                    <span>{exhibition.schedule}</span>
                  </div>
                  {exhibition.capacity && (
                    <div className={styles.metaItem}>
                      <Group className={styles.metaIcon} />
                      <span>定員 {exhibition.capacity}名</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Tags Section */}
              <div className={styles.tagsSection}>
                {exhibition.tags.map((tag, index) => {
                  const tagStyle = getTagColor(tag);
                  return (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Chip
                        label={tag}
                        className={styles.tag}
                        sx={{
                          backgroundColor: tagStyle.bg,
                          color: tagStyle.color,
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          '&:hover': {
                            backgroundColor: tagStyle.bg,
                            opacity: 0.8,
                          },
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* 4. Description Section */}
              <div className={styles.descriptionSection}>
                <Typography 
                  variant="h6" 
                  className={styles.descriptionTitle}
                >
                  詳細説明
                </Typography>
                <div 
                  className={styles.descriptionContent}
                  id="exhibition-modal-description"
                >
                  <Typography 
                    variant="body1" 
                    className={styles.descriptionText}
                  >
                    {exhibition.detailedDescription || exhibition.description}
                  </Typography>
                  
                  {exhibition.organizer && (
                    <div className={styles.organizerInfo}>
                      <Typography variant="body2" className={styles.organizerLabel}>
                        主催者:
                      </Typography>
                      <Typography variant="body2" className={styles.organizerName}>
                        {exhibition.organizer}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Mini Map Section */}
              <div className={styles.mapSection}>
                <Typography variant="h6" className={styles.mapTitle}>
                  場所
                </Typography>
                {renderMiniMap()}
              </div>

              {/* 6. Reviews Section */}
              <div className={styles.reviewsSection}>
                <Box className={styles.tabsContainer}>
                  <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    className={styles.tabs}
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'var(--color-text-muted)',
                      },
                      '& .MuiTab-root.Mui-selected': {
                        color: 'var(--color-brand-main)',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: 'var(--color-brand-main)',
                      },
                    }}
                  >
                    <Tab label="レビュー" />
                    <Tab label="レビューを書く" />
                  </Tabs>
                </Box>

                <Box className={styles.tabContent}>
                  {tabValue === 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.reviewsList}>
                        {mockReviews.length > 0 ? (
                          mockReviews.map((review) => (
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
                          ))
                        ) : (
                          <div className={styles.noReviews}>
                            <Typography variant="body1" color="textSecondary">
                              まだレビューがありません。最初のレビューを投稿してみませんか？
                            </Typography>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {tabValue === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.reviewForm}>
                        <Box className={styles.ratingSection}>
                          <Typography variant="h6" className={styles.ratingLabel}>
                            評価 <span className={styles.required}>*</span>
                          </Typography>
                          <Rating
                            size="large"
                            value={rating}
                            onChange={(_, newValue) => setRating(newValue)}
                            className={styles.rating}
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#ffd700',
                              },
                              '& .MuiRating-iconEmpty': {
                                color: '#e0e0e0',
                              },
                            }}
                          />
                        </Box>

                        <Box className={styles.commentSection}>
                          <Typography variant="h6" className={styles.commentLabel}>
                            コメント
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            placeholder="体験の感想をお聞かせください..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className={styles.textField}
                            inputProps={{
                              maxLength: 500,
                            }}
                            helperText={`${comment.length}/500文字`}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'var(--color-bg-primary)',
                                '& fieldset': {
                                  borderColor: 'var(--color-border-medium)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'var(--color-brand-main)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'var(--color-brand-main)',
                                },
                              },
                            }}
                          />
                        </Box>

                        <Button
                          onClick={handleSubmitReview}
                          variant="contained"
                          disabled={!rating}
                          className={styles.submitButton}
                          sx={{
                            background: rating 
                              ? 'var(--color-brand-main)' 
                              : 'rgba(0, 0, 0, 0.12)',
                            borderRadius: '25px',
                            textTransform: 'none',
                            fontWeight: '600',
                            padding: '0.75rem 2rem',
                            '&:hover': {
                              background: rating 
                                ? 'var(--color-brand-main-dark)' 
                                : 'rgba(0, 0, 0, 0.12)',
                            },
                          }}
                        >
                          レビューを投稿
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </Box>
              </div>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ExhibitionModal;