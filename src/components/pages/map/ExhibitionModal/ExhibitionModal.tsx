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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={styles.modalContent}
          >
            <ExhibitionDetail 
              exhibition={exhibition} 
              onClose={onClose} 
              open={open} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ExhibitionModal;