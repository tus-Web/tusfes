'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './SearchHeader.module.css';
import { Search } from 'lucide-react';

type CategoryType = '展示' | 'フード' | 'イベント' | 'アメニティ';

interface SearchHeaderProps {
  onSearch?: (params: {
    category: CategoryType;
    query: string;
    tag: string | null;
  }) => void;
  showFilterButton?: boolean;
  // モーダル内などで絶対配置を無効化したいときに使用
  position?: 'absolute' | 'static';
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

export default function SearchHeader({
  onSearch,
  showFilterButton = true,
  position = 'absolute',
}: SearchHeaderProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('展示');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 検索条件が変更されたときに親コンポーネントに通知
  const handleSearchChange = (
    category: CategoryType,
    query: string,
    tag: string | null
  ) => {
    if (onSearch) {
      onSearch({ category, query, tag });
    }
  };

  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
    handleSearchChange(category, searchQuery, selectedTag);
  };

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    handleSearchChange(selectedCategory, query, selectedTag);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    handleSearchChange(selectedCategory, searchQuery, tag);
  };

  // フィルターリンク用のURLを生成
  const getFilterLink = () => {
    const params = new URLSearchParams();
    params.set('category', selectedCategory);
    if (searchQuery) {
      params.set('query', searchQuery);
    }
    return `/filter?${params.toString()}`;
  };

  const containerStyle: React.CSSProperties | undefined =
    position === 'absolute'
      ? undefined
      : { position: 'static', boxShadow: 'none' };

  return (
    <div className={styles.container} style={containerStyle}>
      {/* カテゴリー選択とフィルター */}
      <div className={styles.topBar}>
        <div className={styles.categorySelector}>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value as CategoryType)}
            className={styles.categoryDropdown}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {showFilterButton && (
          <Link href={getFilterLink()} className={styles.filterButton}>
            フィルター
          </Link>
        )}

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
            onChange={(e) => handleQueryChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      {/* 人気タグ横スクロール */}
      <div className={styles.tagsContainer}>
        <div className={styles.tagsScroll}>
          <button
            className={`${styles.tag} ${selectedTag === null ? styles.tagActive : ''}`}
            onClick={() => handleTagSelect(null)}
          >
            すべて
          </button>
          {popularTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tag} ${selectedTag === tag ? styles.tagActive : ''}`}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
