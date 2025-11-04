'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import SearchTopBar from '@/components/shared/search/SearchTopBar/SearchTopBar';
import SearchResultCard, {
  SearchItem,
} from '@/components/shared/search/SearchResultCard/SearchResultCard';
import { getAllEvents } from '@/lib/events';

function SearchContent() {
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<
    '展示' | 'フード' | 'イベント' | 'アメニティ'
  >('展示');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 全イベントデータを取得
  const allEvents = useMemo(() => getAllEvents(), []);
  useEffect(() => {
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const tags = searchParams.get('tags');
    const locations = searchParams.get('locations');

    if (category) {
      setSelectedCategory(category as '展示' | 'フード' | 'イベント' | 'アメニティ');
    }
    if (query) {
      setSearchQuery(query);
    }
    if (tags) {
      setSelectedTags(tags.split(','));
    }
    if (locations) {
      setSelectedLocations(locations.split(','));
    }
  }, [searchParams]);

  // フィルタリングロジック
  const filteredData = useMemo(() => {
    return allEvents.filter((item) => {
      // カテゴリーフィルター
      if (item.category !== selectedCategory) {
        return false;
      }

      // 検索クエリフィルター
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // タグフィルター（トップバーから選択）
      if (selectedTag && !item.tags.includes(selectedTag)) {
        return false;
      }

      // 詳細フィルターのタグ（複数選択可能）
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tag => item.tags.includes(tag));
        if (!hasAllTags) {
          return false;
        }
      }

      // 場所フィルター
      if (selectedLocations.length > 0) {
        const hasMatchingLocation = selectedLocations.some(loc => 
          item.location.includes(loc)
        );
        if (!hasMatchingLocation) {
          return false;
        }
      }

      return true;
    });
  }, [allEvents, selectedCategory, searchQuery, selectedTag, selectedTags, selectedLocations]);

  return (
    <div className={styles.container}>
      {/* SearchTopBar hidden as per issue requirement */}
      {/* <SearchTopBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        selectedTags={selectedTags}
        selectedLocations={selectedLocations}
      /> */}

      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>
            検索結果 ({filteredData.length}件)
          </h2>
        </div>

        <div className={styles.resultsList}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <SearchResultCard key={item.id} item={item} />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>該当する結果が見つかりませんでした。</p>
              <p>検索条件を変更してみてください。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div className={styles.loading}>読み込み中...</div>}>
      <SearchContent />
    </Suspense>
  );
}