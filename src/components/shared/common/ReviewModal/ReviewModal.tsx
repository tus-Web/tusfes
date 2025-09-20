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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ReviewModal.module.css';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose }) => {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // ここではモーダルを閉じるだけ（バックエンド機能は実装しない）
    console.log('Rating:', rating, 'Comment:', comment);
    setRating(0);
    setComment('');
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: styles.dialogPaper,
        style: {
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
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
              <Typography variant="h5" className={styles.title}>
                理大祭のレビューを投稿
              </Typography>
              <Typography variant="body2" className={styles.subtitle}>
                あなたの体験を他の来場者とシェアしてください
              </Typography>
            </DialogTitle>

            <DialogContent className={styles.dialogContent}>
              <Box className={styles.ratingSection}>
                <Typography variant="h6" className={styles.ratingLabel}>
                  総合評価
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Rating
                    size="large"
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                    className={styles.rating}
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#ffd700',
                        filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))',
                      },
                      '& .MuiRating-iconEmpty': {
                        color: '#e0e0e0',
                      },
                      '& .MuiRating-iconHover': {
                        color: '#ffed4e',
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                </motion.div>
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
                  placeholder="理大祭での体験や感想をお聞かせください..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={styles.textField}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Box>
            </DialogContent>

            <DialogActions className={styles.dialogActions}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleClose}
                  className={styles.cancelButton}
                  sx={{
                    borderRadius: '25px',
                    textTransform: 'none',
                    fontWeight: '600',
                    color: '#666',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  キャンセル
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={!rating || !comment.trim()}
                  className={styles.submitButton}
                  sx={{
                    background: rating && comment.trim() 
                      ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                      : 'rgba(0, 0, 0, 0.12)',
                    borderRadius: '25px',
                    textTransform: 'none',
                    fontWeight: '600',
                    minWidth: '120px',
                    '&:hover': {
                      background: rating && comment.trim() 
                        ? 'linear-gradient(45deg, #5a6fd8, #6a419a)' 
                        : 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:disabled': {
                      color: 'rgba(0, 0, 0, 0.26)',
                    },
                  }}
                >
                  投稿する
                </Button>
              </motion.div>
            </DialogActions>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ReviewModal;