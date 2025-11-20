'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './SearchHeader.module.css';
import { Search } from 'lucide-react';
import FilterSheet from '../FilterSheet/FilterSheet';
import type { CategoryType } from '../types';

interface SearchHeaderProps {
  onSearch?: (params: {
    category: CategoryType;
    query: string;
    tag: string | null;
    tags?: string[];
    locations?: string[];
  }) => void;
  showFilterButton?: boolean;
  // モーダル内などで絶対配置を無効化したいときに使用
  position?: 'absolute' | 'static';
  filterMode?: 'link' | 'modal';
}

const categories: CategoryType[] = ['全て', '展示', 'フード', 'イベント', 'アメニティ'];

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

const detailLocations = [
  '1号館',
  '2号館',
  '3号館',
  '4号館',
  '中庭',
  '正門前広場',
  '野外ステージ',
  '大講堂',
  '学生食堂',
];

export default function SearchHeader({
  onSearch,
  showFilterButton = true,
  position = 'absolute',
  filterMode = 'link',
}: SearchHeaderProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('全て');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState<CategoryType>('全て');
  const [draftQuery, setDraftQuery] = useState('');
  const [draftDetailTags, setDraftDetailTags] = useState<string[]>([]);
  const [draftLocations, setDraftLocations] = useState<string[]>([]);
  const [appliedDetailTags, setAppliedDetailTags] = useState<string[]>([]);
  const [appliedLocations, setAppliedLocations] = useState<string[]>([]);

  // 検索条件が変更されたときに親コンポーネントに通知
  const handleSearchChange = (
    category: CategoryType,
    query: string,
    tag: string | null,
    tagsParam?: string[],
    locationsParam?: string[]
  ) => {
    const tagsToUse = tagsParam ?? appliedDetailTags;
    const locationsToUse = locationsParam ?? appliedLocations;
    if (onSearch) {
      onSearch({ category, query, tag, tags: tagsToUse, locations: locationsToUse });
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

  const toggleDraftTag = (tag: string) => {
    setDraftDetailTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleDraftLocation = (location: string) => {
    setDraftLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleFilterApply = () => {
    setSelectedCategory(draftCategory);
    setSearchQuery(draftQuery);
    setAppliedDetailTags(draftDetailTags);
    setAppliedLocations(draftLocations);
    handleSearchChange(draftCategory, draftQuery, selectedTag, draftDetailTags, draftLocations);
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    setSelectedCategory('全て');
    setSearchQuery('');
    setDraftCategory('全て');
    setDraftQuery('');
    setSelectedTag(null);
    setDraftDetailTags([]);
    setDraftLocations([]);
    setAppliedDetailTags([]);
    setAppliedLocations([]);
    handleSearchChange('全て', '', null, [], []);
  };

  const handleFilterClose = () => {
    setDraftDetailTags(appliedDetailTags);
    setDraftLocations(appliedLocations);
    setDraftCategory(selectedCategory);
    setDraftQuery(searchQuery);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    if (isFilterOpen) {
      setDraftDetailTags(appliedDetailTags);
      setDraftLocations(appliedLocations);
      setDraftCategory(selectedCategory);
      setDraftQuery(searchQuery);
    }
  }, [isFilterOpen, appliedDetailTags, appliedLocations, selectedCategory, searchQuery]);

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

        {showFilterButton && filterMode === 'link' && (
          <Link href={getFilterLink()} className={styles.filterButton}>
            フィルター
          </Link>
        )}

        {showFilterButton && filterMode === 'modal' && (
          <button
            type="button"
            className={`${styles.filterButton} ${styles.filterButtonAction}`}
            onClick={(event) => {
              setIsFilterOpen(true);
              event.currentTarget.blur();
            }}
          >
            フィルター
          </button>
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

      {filterMode === 'modal' && (
        <FilterSheet
          isOpen={isFilterOpen}
          category={draftCategory}
          categories={categories}
          query={draftQuery}
          availableTags={popularTags}
          selectedTags={draftDetailTags}
          availableLocations={detailLocations}
          selectedLocations={draftLocations}
          onCategoryChange={setDraftCategory}
          onQueryChange={setDraftQuery}
          onToggleTag={toggleDraftTag}
          onToggleLocation={toggleDraftLocation}
          onApply={handleFilterApply}
          onClose={handleFilterClose}
          onReset={handleFilterReset}
        />
      )}
    </div>
  );
}
