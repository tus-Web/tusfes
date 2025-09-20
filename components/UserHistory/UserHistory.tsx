'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Chip,
  Button,
  Pagination,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Skeleton,
} from '@mui/material';
import {
  History,
  Favorite,
  LocationOn,
  AccessTime,
  Delete,
  Refresh,
  ImageNotSupported,
} from '@mui/icons-material';
import { useUserReviews, useUserFavorites } from '@/hooks/use-user-data';
import { useLanguage } from '@/hooks/use-language';
import styles from './UserHistory.module.css';

interface UserHistoryProps {}

const UserHistory: React.FC<UserHistoryProps> = () => {
  const [tabValue, setTabValue] = useState(0);
  const { t } = useLanguage();
  
  const {
    reviews,
    pagination: reviewPagination,
    loading: reviewsLoading,
    error: reviewsError,
    loadReviews,
    refetch: refetchReviews,
  } = useUserReviews(5);

  const {
    favorites,
    pagination: favoritesPagination,
    loading: favoritesLoading,
    error: favoritesError,
    loadFavorites,
    removeFavorite,
    refetch: refetchFavorites,
  } = useUserFavorites(5);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReviewPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    loadReviews(page);
  };

  const handleFavoritePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    loadFavorites(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const LoadingSkeleton = () => (
    <div className={styles.skeletonContainer}>
      {[...Array(3)].map((_, index) => (
        <Card key={index} className={styles.skeletonCard}>
          <Skeleton variant="rectangular" height={120} />
          <CardContent>
            <Skeleton variant="text" height={32} width="80%" />
            <Skeleton variant="text" height={20} width="60%" />
            <Skeleton variant="text" height={20} width="40%" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ErrorAlert = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
    <Alert
      severity="error"
      className={styles.errorAlert}
      action={
        <IconButton
          color="inherit"
          size="small"
          onClick={onRetry}
          aria-label="再試行"
        >
          <Refresh />
        </IconButton>
      }
    >
      {error.message}
    </Alert>
  );

  const ReviewsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.tabContent}
    >
      {reviewsError && (
        <ErrorAlert error={reviewsError} onRetry={refetchReviews} />
      )}
      
      {reviewsLoading ? (
        <LoadingSkeleton />
      ) : reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <History className={styles.emptyIcon} />
          <Typography variant="h6" className={styles.emptyTitle}>
            レビュー履歴がありません
          </Typography>
          <Typography variant="body2" className={styles.emptyDescription}>
            展示を見学してレビューを投稿してみましょう
          </Typography>
        </div>
      ) : (
        <>
          <div className={styles.itemsList}>
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={styles.reviewCard}>
                    <div className={styles.cardLayout}>
                      <div className={styles.imageContainer}>
                        {review.imageUrl ? (
                          <CardMedia
                            component="img"
                            image={review.imageUrl}
                            alt={review.exhibitionName}
                            className={styles.cardImage}
                          />
                        ) : (
                          <div className={styles.imagePlaceholder}>
                            <ImageNotSupported className={styles.placeholderIcon} />
                          </div>
                        )}
                      </div>
                      
                      <CardContent className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <Typography variant="h6" className={styles.exhibitionName}>
                            {review.exhibitionName}
                          </Typography>
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                            className={styles.rating}
                          />
                        </div>
                        
                        <div className={styles.metaInfo}>
                          <div className={styles.metaItem}>
                            <LocationOn className={styles.metaIcon} />
                            <span>{review.location}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <AccessTime className={styles.metaIcon} />
                            <span>{review.schedule}</span>
                          </div>
                        </div>
                        
                        <Typography variant="body2" className={styles.reviewComment}>
                          {review.comment}
                        </Typography>
                        
                        <Typography variant="caption" className={styles.reviewDate}>
                          {formatDate(review.createdAt)}
                        </Typography>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {reviewPagination && reviewPagination.totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination
                count={reviewPagination.totalPages}
                page={reviewPagination.page}
                onChange={handleReviewPageChange}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
                className={styles.pagination}
              />
            </div>
          )}
        </>
      )}
    </motion.div>
  );

  const FavoritesTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.tabContent}
    >
      {favoritesError && (
        <ErrorAlert error={favoritesError} onRetry={refetchFavorites} />
      )}
      
      {favoritesLoading ? (
        <LoadingSkeleton />
      ) : favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <Favorite className={styles.emptyIcon} />
          <Typography variant="h6" className={styles.emptyTitle}>
            お気に入りがありません
          </Typography>
          <Typography variant="body2" className={styles.emptyDescription}>
            気になる展示をお気に入りに追加してみましょう
          </Typography>
        </div>
      ) : (
        <>
          <div className={styles.itemsList}>
            <AnimatePresence>
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={styles.favoriteCard}>
                    <div className={styles.cardLayout}>
                      <div className={styles.imageContainer}>
                        {favorite.imageUrl ? (
                          <CardMedia
                            component="img"
                            image={favorite.imageUrl}
                            alt={favorite.exhibitionName}
                            className={styles.cardImage}
                          />
                        ) : (
                          <div className={styles.imagePlaceholder}>
                            <ImageNotSupported className={styles.placeholderIcon} />
                          </div>
                        )}
                      </div>
                      
                      <CardContent className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <Typography variant="h6" className={styles.exhibitionName}>
                            {favorite.exhibitionName}
                          </Typography>
                          <IconButton
                            onClick={() => removeFavorite(favorite.id)}
                            className={styles.removeButton}
                            aria-label="お気に入りから削除"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </div>
                        
                        <div className={styles.metaInfo}>
                          <div className={styles.metaItem}>
                            <LocationOn className={styles.metaIcon} />
                            <span>{favorite.location}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <AccessTime className={styles.metaIcon} />
                            <span>{favorite.schedule}</span>
                          </div>
                        </div>
                        
                        <div className={styles.tagsContainer}>
                          {favorite.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              className={styles.tag}
                            />
                          ))}
                        </div>
                        
                        <Typography variant="caption" className={styles.favoriteDate}>
                          {formatDate(favorite.createdAt)} に追加
                        </Typography>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {favoritesPagination && favoritesPagination.totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination
                count={favoritesPagination.totalPages}
                page={favoritesPagination.page}
                onChange={handleFavoritePageChange}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
                className={styles.pagination}
              />
            </div>
          )}
        </>
      )}
    </motion.div>
  );

  return (
    <div className={styles.userHistory}>
      <div className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          履歴
        </Typography>
      </div>
      
      <div className={styles.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className={styles.tabs}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              minHeight: '48px',
            },
            '& .MuiTab-root.Mui-selected': {
              color: 'var(--color-brand-main)',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-brand-main)',
            },
          }}
        >
          <Tab
            icon={<History />}
            label="レビュー履歴"
            iconPosition="start"
            className={styles.tab}
          />
          <Tab
            icon={<Favorite />}
            label="お気に入り"
            iconPosition="start"
            className={styles.tab}
          />
        </Tabs>
      </div>
      
      <div className={styles.content}>
        {tabValue === 0 && <ReviewsTab />}
        {tabValue === 1 && <FavoritesTab />}
      </div>
    </div>
  );
};

export default UserHistory;