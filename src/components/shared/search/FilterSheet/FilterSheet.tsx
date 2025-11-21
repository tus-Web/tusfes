'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './FilterSheet.module.css';
import type { CategoryType } from '../types';

interface FilterSheetProps {
  isOpen: boolean;
  category: CategoryType;
  categories: CategoryType[];
  query: string;
  availableTags: string[];
  selectedTags: string[];
  availableLocations: string[];
  selectedLocations: string[];
  onCategoryChange: (category: CategoryType) => void;
  onQueryChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
  onToggleLocation: (location: string) => void;
  onApply: () => void;
  onClose: () => void;
  onReset: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  category,
  categories,
  query,
  availableTags,
  selectedTags,
  availableLocations,
  selectedLocations,
  onCategoryChange,
  onQueryChange,
  onToggleTag,
  onToggleLocation,
  onApply,
  onClose,
  onReset,
}) => {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="フィルターを閉じる"
      />
      <section className={styles.sheet} aria-modal="true" role="dialog" aria-label="詳細フィルター">
        <header className={styles.header}>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
          <h2 className={styles.title}>詳細検索</h2>
          <button type="button" className={styles.applyButton} onClick={onApply}>
            適用
          </button>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>名前で検索</h3>
            <input
              type="text"
              placeholder="展示名やイベント名を入力..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className={styles.searchInput}
            />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>カテゴリー</h3>
            <div className={styles.optionsGrid}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.optionButton} ${category === cat ? styles.optionButtonActive : ''}`}
                  onClick={() => onCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>特徴・タグ</h3>
            <div className={styles.tagsGrid}>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.tagButtonActive : ''}`}
                  onClick={() => onToggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <span className={styles.checkMark}>✓</span>}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>場所</h3>
            <div className={styles.tagsGrid}>
              {availableLocations.map((location) => (
                <button
                  key={location}
                  className={`${styles.tagButton} ${selectedLocations.includes(location) ? styles.tagButtonActive : ''}`}
                  onClick={() => onToggleLocation(location)}
                >
                  {location}
                  {selectedLocations.includes(location) && <span className={styles.checkMark}>✓</span>}
                </button>
              ))}
            </div>
          </section>

          <button type="button" className={styles.resetButton} onClick={onReset}>
            すべてリセット
          </button>
        </div>
      </section>
    </div>
  );
};

export default FilterSheet;
