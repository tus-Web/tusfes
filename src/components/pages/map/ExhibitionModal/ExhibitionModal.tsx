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
import ExhibitionDetail from '@/src/components/shared/ExhibitionDetail/ExhibitionDetail';
import { supabase } from '@/src/lib/supabase/client';

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
/*仮データ supabaseに置き換え*/
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
  const [reviews, setReviews] = useState<Review[]>([]);
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
          if(!exhibition?.id) return;
          
          const fetchReviews = async () => {
              const {data,error} = await supabase
              .from('reviews')
              .select('*')
              .eq('display_id',exhibition?.id);
  
              if(!error && data) {
                  setReviews(data);
              }
          };
          fetchReviews();
      },[open]);

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

  const checkReviewLength = (comment: string) => {
    if (comment.length === 0) {
      alert('レビューを書いて下さい');
      return false;
    }
    return true;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!checkReviewLength(comment)) {
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            comment: comment,
            display_id: exhibition?.id,
            rating: rating
          },
        ]);
      if (error) {
        throw error;
      }

      alert('レビューを送信しました！');
      setComment('');

      const { data: newReviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('display_id', exhibition?.id);

      setReviews(newReviews || []);
    } catch (error) {
      alert("投稿失敗");
    }
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
              <ExhibitionDetail exhibition={exhibition} />
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ExhibitionModal;