'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Typography, Button } from '@mui/material';
import { Close, ZoomIn } from '@mui/icons-material';
import styles from './FloorModal.module.css';

import events from '@/src/data/events.json';

interface FloorModalProps {
  open: boolean;
  onClose: () => void;
  images?: string[];
  onSelectExhibition?: (exhibition: any) => void;
}

const FloorModal: React.FC<FloorModalProps> = ({ open, onClose, images, onSelectExhibition }) => {
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

  // events.json から講義棟のものだけ抽出
  const lectureEvents = (events as any[]).filter((e) => e.location && e.location.indexOf('講義棟') !== -1);
  // 選択中のフロアに対応するイベントだけを表示
  const lectureEventsByFloor = lectureEvents.filter((e) => {
    // e.floor が未定義の場合は表示しない
    if (!e.floor) return false;
    return String(e.floor).toLowerCase() === String(selectedFloor).toLowerCase();
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
              <div className={styles.imgWrapper} onClick={() => setZoomed(src)}>
                <img src={src} alt={`floor-${src}`} className={styles.image} />
                <div className={styles.overlay}>
                  <ZoomIn />
                </div>

                {/* ピンを画像上に重ねる */}
                <div className={styles.pinsLayer} aria-hidden>
                  {lectureEventsByFloor.map((ev) => {
                    const pos = ev.position || { x: null, y: null };
                    if (pos.x == null || pos.y == null) return null;
                    const left = `${pos.x}%`;
                    const top = `${pos.y}%`;
                    return (
                      <button
                        key={ev.id}
                        className={styles.pin}
                        style={{ left, top }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (typeof onSelectExhibition === 'function') {
                            onSelectExhibition(ev);
                          }
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

        {/* Zoom overlay */}
        {zoomed && (
          <div className={styles.zoomOverlay} onClick={() => setZoomed(null)}>
            <img src={zoomed} alt="zoomed-floor" className={styles.zoomImage} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FloorModal;
