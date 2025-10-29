'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import SearchTopBar from '@/components/shared/search/SearchTopBar/SearchTopBar';
import SearchResultCard, {
  SearchItem,
} from '@/components/shared/search/SearchResultCard/SearchResultCard';

// ダミーデータ
const dummyData: SearchItem[] = [
  {
    id: '1',
    name: 'ロボット研究会展示',
    category: '展示',
    tags: ['体験型', '学生向け', '写真映え'],
    description: '最新のロボット技術を展示。実際に操作体験もできます。',
    location: '1号館 2階',
  },
  {
    id: '2',
    name: 'カフェテリア特別メニュー',
    category: 'フード',
    tags: ['限定品あり', '家族におすすめ'],
    description: '学祭限定の特別メニューをご用意しています。',
    location: '学生食堂',
  },
  {
    id: '3',
    name: 'ライブステージ',
    category: 'イベント',
    tags: ['屋外', '家族におすすめ', '写真映え'],
    description: '人気アーティストによるライブパフォーマンス。',
    location: '野外ステージ',
  },
  {
    id: '4',
    name: '化学実験ショー',
    category: '展示',
    tags: ['体験型', '家族におすすめ', '無料'],
    description: '楽しく学べる化学実験ショー。子供から大人まで楽しめます。',
    location: '3号館 実験室',
  },
  {
    id: '5',
    name: 'たこ焼き屋台',
    category: 'フード',
    tags: ['屋外', '学生向け'],
    description: 'アツアツのたこ焼きを提供しています。',
    location: '中庭',
  },
  {
    id: '6',
    name: 'VR体験コーナー',
    category: '展示',
    tags: ['体験型', '写真映え', '学生向け'],
    description: '最新のVR技術を体験できます。',
    location: '2号館 1階',
  },
  {
    id: '7',
    name: '休憩スペース',
    category: 'アメニティ',
    tags: ['屋内', '家族におすすめ', '無料'],
    description: '快適な休憩スペースをご用意しています。',
    location: '4号館 ラウンジ',
  },
  {
    id: '8',
    name: 'お笑いライブ',
    category: 'イベント',
    tags: ['屋内', '家族におすすめ'],
    description: '人気お笑い芸人によるライブステージ。',
    location: '大講堂',
  },
  {
    id: '9',
    name: 'クレープショップ',
    category: 'フード',
    tags: ['限定品あり', '写真映え'],
    description: 'インスタ映えするクレープをご提供。',
    location: '正門前広場',
  },
  {
    id: '10',
    name: '授乳室・おむつ交換室',
    category: 'アメニティ',
    tags: ['屋内', '家族におすすめ'],
    description: '小さなお子様連れの方も安心してご利用いただけます。',
    location: '1号館 1階',
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<
    '展示' | 'フード' | 'イベント' | 'アメニティ'
  >('展示');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // URLパラメータから検索条件を取得
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
    return dummyData.filter((item) => {
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
  }, [selectedCategory, searchQuery, selectedTag, selectedTags, selectedLocations]);

  return (
    <div className={styles.container}>
      <SearchTopBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        selectedTags={selectedTags}
        selectedLocations={selectedLocations}
      />

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