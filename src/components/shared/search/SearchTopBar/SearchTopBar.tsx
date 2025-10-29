'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './SearchTopBar.module.css';
import { Search } from 'lucide-react';

type CategoryType = '展示' | 'フード' | 'イベント' | 'アメニティ';

interface SearchTopBarProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

const categories: CategoryType[] = ['展示', 'フード', 'イベント', 'アメニティ'];

const popularTags = [
  '家族におすすめ',
  '学生向け',
  '体験型',
  '写真映え',
  '限定品あり',
  '屋内',
  '屋外',
  '無料',
];

export default function SearchTopBar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagSelect,
}: SearchTopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* カテゴリー選択とフィルター */}
      <div className={styles.topBar}>
        <div className={styles.categorySelector}>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as CategoryType)}
            className={styles.categoryDropdown}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Link href="/filter" className={styles.filterButton}>
          フィルター
        </Link>

        <button
          className={styles.searchButton}
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search size={20} />
        </button>
      </div>

      {/* 検索バー */}
      {isSearchOpen && (
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="名前で検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      {/* 人気タグ横スクロール */}
      <div className={styles.tagsContainer}>
        <div className={styles.tagsScroll}>
          <button
            className={`${styles.tag} ${selectedTag === null ? styles.tagActive : ''}`}
            onClick={() => onTagSelect(null)}
          >
            すべて
          </button>
          {popularTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tag} ${selectedTag === tag ? styles.tagActive : ''}`}
              onClick={() => onTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
