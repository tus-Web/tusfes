'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { X } from 'lucide-react';
import { categories, allTags, locations, CategoryType } from '@/data/filterOptions';

function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('展示');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // URLパラメータから初期値を取得
  useEffect(() => {
    const category = searchParams.get('category') as CategoryType;
    const tags = searchParams.get('tags');
    const locations = searchParams.get('locations');
    const query = searchParams.get('query');

    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
    if (tags) {
      setSelectedTags(tags.split(','));
    }
    if (locations) {
      setSelectedLocations(locations.split(','));
    }
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    params.set('category', selectedCategory);
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','));
    }
    if (selectedLocations.length > 0) {
      params.set('locations', selectedLocations.join(','));
    }
    if (searchQuery) {
      params.set('query', searchQuery);
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedCategory('展示');
    setSelectedTags([]);
    setSelectedLocations([]);
    setSearchQuery('');
  };

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={() => router.back()}>
          <X size={24} />
        </button>
        <h1 className={styles.title}>詳細検索</h1>
        <button className={styles.applyButton} onClick={handleApply}>
          適用
        </button>
      </div>

      <div className={styles.content}>
        {/* 名前検索 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>名前で検索</h2>
          <input
            type="text"
            placeholder="展示名やイベント名を入力..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </section>

        {/* カテゴリー選択 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>カテゴリー</h2>
          <div className={styles.optionsGrid}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.optionButton} ${
                  selectedCategory === category ? styles.optionButtonActive : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* タグ選択 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>特徴・タグ</h2>
          <div className={styles.tagsGrid}>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`${styles.tagButton} ${
                  selectedTags.includes(tag) ? styles.tagButtonActive : ''
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <span className={styles.checkMark}>✓</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 場所選択 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>場所</h2>
          <div className={styles.tagsGrid}>
            {locations.map((location) => (
              <button
                key={location}
                className={`${styles.tagButton} ${
                  selectedLocations.includes(location)
                    ? styles.tagButtonActive
                    : ''
                }`}
                onClick={() => toggleLocation(location)}
              >
                {location}
                {selectedLocations.includes(location) && (
                  <span className={styles.checkMark}>✓</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* リセットボタン */}
        <button className={styles.resetButton} onClick={handleReset}>
          すべてリセット
        </button>
      </div>
    </div>
  );
}

export default function Filter() {
  return (
    <Suspense fallback={<div className={styles.loading}>読み込み中...</div>}>
      <FilterContent />
    </Suspense>
  );
}
