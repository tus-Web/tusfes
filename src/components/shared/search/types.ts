import type { FilterCategory } from '@/types/event';

export type CategoryType = FilterCategory;

// 検索やフィルターUIで使うカテゴリの並び順
export const categoryOptions: CategoryType[] = [
  '全て',
  '模擬店',
  'フード',
  '展示',
  'イベント',
  'ステージ',
  '屋外企画',
];
