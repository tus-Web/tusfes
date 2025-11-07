"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Typography, Button, Chip } from '@mui/material';
import { Close, ZoomIn, LocationOn, AccessTime, Group } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FloorModal.module.css';
import exStyles from '../ExhibitionModal/ExhibitionModal.module.css';
import ExhibitionDetail from '@/src/components/shared/ExhibitionDetail/ExhibitionDetail';

import events from '@/src/data/events.json';

import SearchHeader from '@/components/shared/search/SearchHeader/SearchHeader'; 

interface FloorModalProps {
  open: boolean;
  onClose: () => void;
  images?: string[];
}

const FloorModal: React.FC<FloorModalProps> = ({ open, onClose, images }) => {
  const defaultImages = [
    '/img/floor/1kai.png',
    '/img/floor/3kai.png',
    '/img/floor/4kai.png',
    '/img/floor/5kai.png',
  ];

  // フロアごとの画像マッピング
  const FLOOR_IMAGES: Record<string, string[]> = {
    '1F': ['/img/floor/1kai.png'],
    '3F': ['/img/floor/3kai.png'],
    '4F': ['/img/floor/4kai.png'],
    '5F': ['/img/floor/5kai.png'],
    '6F': ['/img/floor/6kai.png'],
  };

  const [selectedFloor, setSelectedFloor] = useState<string>('1F');
  const imgs = images && images.length > 0 ? images.slice(0, 4) : (FLOOR_IMAGES[selectedFloor] ?? defaultImages);
  const [zoomed, setZoomed] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [filterParams, setFilterParams] = useState<{ category: string; query: string; tag: string | null }>({
    category: '全て',
    query: '',
    tag: null,
  });

  const handleSearch = (params: { category: string; query: string; tag: string | null }) => {
    setFilterParams(params);
  };

  // events.json から講義棟のものだけ抽出
  const lectureEvents = (events as any[]).filter((e) => e.location && e.location.indexOf('講義棟') !== -1);
  // 選択中のフロアに対応するイベントだけを表示
  const lectureEventsByFloor = lectureEvents.filter((e) => {
    // e.floor が未定義の場合は表示しない
    if (!e.floor) return false;
    return String(e.floor).toLowerCase() === String(selectedFloor).toLowerCase();
  });

  // フィルタパラメータに基づきピンを絞る（表示/非表示）
  const lectureEventsByFloorFiltered = lectureEventsByFloor.filter((ev) => {
    const { category, query, tag } = filterParams;
    let ok = true;
    // treat '全て' as no filter
    if (category && category !== '全て') ok = ok && ev.category === category;
    if (query) ok = ok && ev.name.toLowerCase().includes(query.toLowerCase());
    if (tag) ok = ok && Array.isArray(ev.tags) && ev.tags.includes(tag);
    return ok;
  });

  return (
    <Dialog
      open={open}
      onClose={() => { setZoomed(null); onClose(); }}
      fullScreen
      PaperProps={{ className: styles.dialogPaper }}
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.6)' } }}
      aria-labelledby="floor-modal-title"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={styles.modalContent}
          >
            <SearchHeader position="static" onSearch={handleSearch} />
            <div className={styles.header}>
              <Typography id="floor-modal-title" variant="h6" className={styles.title}>
                フロア写真
              </Typography>
              {/* ExhibitionModal と同じスタイルの閉じるボタン */}
              <IconButton
                onClick={() => { setZoomed(null); onClose(); }}
                className={styles.closeButton}
                aria-label="モーダルを閉じる"
                sx={{
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
            </div>

            <DialogContent className={styles.content}>
              {/* フロア選択ボタン */}
              <div className={styles.buttonGroup}>
                {Object.keys(FLOOR_IMAGES).map((floor) => (
                  <Button
                    key={floor}
                    variant={selectedFloor === floor ? 'contained' : 'outlined'}
                    onClick={() => { setSelectedFloor(floor); setZoomed(null); }}
                    className={styles.floorButton}
                  >
                    {floor}
                  </Button>
                ))}
              </div>

              <div className={styles.grid}>
                {imgs.map((src, imgIndex) => (
                  <div key={src} className={styles.gridItem}>
                    {/* 画像自体のクリックでズームしないように、ラッパーの onClick は削除。
                        ズームはオーバーレイ (虫眼鏡アイコン) をクリックしたときのみ発火する。 */}
                    <div className={styles.imgWrapper}>
                      <img src={src} alt={`floor-${src}`} className={styles.image} />
                      <div
                        className={styles.overlay}
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomed(src);
                        }}
                        role="button"
                        aria-label="拡大表示"
                      >
                        <ZoomIn />
                      </div>

                      {/* ピンを画像上に重ねる */}
                      <div className={styles.pinsLayer} aria-hidden>
                        {lectureEventsByFloorFiltered.map((ev) => {
                          const pos = ev.position || { x: null, y: null };
                          if (pos.x == null || pos.y == null) return null;
                          const left = `${pos.x}%`;
                          const top = `${pos.y}%`;

                          // Choose an appropriate pin SVG based on category/tags
                          const pinTypeClass = (ev.category === 'フード' || (Array.isArray(ev.tags) && ev.tags.includes('フード')))
                            ? styles.pinFood
                            : ev.category === '展示'
                              ? styles.pinShop
                              : ev.category === 'イベント'
                                ? styles.pinStage
                                : styles.pinDefault;

                          return (
                            <button
                              key={ev.id}
                              className={`${styles.pin} ${pinTypeClass}`}
                              style={{ left, top }}
                              onClick={(e) => {
                                e.stopPropagation();
                                // show inline detail panel inside FloorModal
                                setSelectedEvent(ev);
                              }}
                              title={ev.name}
                              aria-label={`開く ${ev.name}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inline detail panel shown under the floor map when a pin is selected */}
              {selectedEvent && (
                <div className={styles.detailPanel} role="region" aria-label="選択された展示詳細">
                  <ExhibitionDetail exhibition={selectedEvent} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <Button onClick={() => setSelectedEvent(null)} variant="contained" sx={{ textTransform: 'none' }}>閉じる</Button>
                  </div>
                </div>
              )}

              {/* Zoom overlay */}
              {zoomed && (
                <div className={styles.zoomOverlay} onClick={() => setZoomed(null)}>
                  <img src={zoomed} alt="zoomed-floor" className={styles.zoomImage} />
                </div>
              )}
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default FloorModal;
