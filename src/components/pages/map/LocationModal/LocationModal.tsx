'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, StarBorder, LocationOn, AccessTime } from '@mui/icons-material';
import styles from './LocationModal.module.css';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  location: any;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  avatar: string;
  date: string;
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

const LocationModal: React.FC<LocationModalProps> = ({ open, onClose, location }) => {
  const [tabValue, setTabValue] = useState(0);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');

  const handleSubmitReview = () => {
    console.log('Rating:', rating, 'Comment:', comment);
    setRating(0);
    setComment('');
    setTabValue(0); // Switch back to reviews tab
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setTabValue(0);
    onClose();
  };

  if (!location) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: styles.dialogPaper,
        style: {
          borderRadius: '20px',
          background: 'var(--color-bg-secondary)',
          maxHeight: '90vh',
        }
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
        }
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className={styles.dialogTitle}>
              <div className={styles.locationHeader}>
                <div className={styles.locationIcon}>
                  {location.type === 'experiment' ? '🧪' : 
                   location.type === 'exhibition' ? '🤖' :
                   location.type === 'food' ? '🍽️' :
                   location.type === 'workshop' ? '🛠️' :
                   location.type === 'presentation' ? '📊' :
                   location.type === 'lecture' ? '🎤' : '📍'}
                </div>
                <div className={styles.locationInfo}>
                  <Typography variant="h5" className={styles.locationTitle}>
                    {location.name}
                  </Typography>
                  <div className={styles.locationMeta}>
                    <div className={styles.metaItem}>
                      <LocationOn className={styles.metaIcon} />
                      <span>会場内</span>
                    </div>
                    <div className={styles.metaItem}>
                      <AccessTime className={styles.metaIcon} />
                      <span>開催中</span>
                    </div>
                  </div>
                  <Typography variant="body2" className={styles.locationDescription}>
                    {location.description}
                  </Typography>
                </div>
              </div>
            </DialogTitle>

            <DialogContent className={styles.dialogContent}>
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
                          評価
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
                        disabled={!rating || !comment.trim()}
                        className={styles.submitButton}
                        sx={{
                          background: rating && comment.trim() 
                            ? 'var(--color-brand-main)' 
                            : 'rgba(0, 0, 0, 0.12)',
                          borderRadius: '25px',
                          textTransform: 'none',
                          fontWeight: '600',
                          padding: '0.75rem 2rem',
                          '&:hover': {
                            background: rating && comment.trim() 
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
            </DialogContent>

            <DialogActions className={styles.dialogActions}>
              <Button
                onClick={handleClose}
                className={styles.closeButton}
                sx={{
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: '600',
                  color: 'var(--color-text-muted)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                閉じる
              </Button>
            </DialogActions>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default LocationModal;