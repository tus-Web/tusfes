import type { FilterCategory } from '@/types/event';

export type CategoryPageConfig = {
  slug: string;
  title: string;
  description: string;
  type: FilterCategory;
};

export const CATEGORY_PAGE_CONFIGS: CategoryPageConfig[] = [
  {
    slug: 'booths',
    title: '模擬店',
    description: '学生・団体による飲食や体験型の模擬店をまとめた一覧です。',
    type: '模擬店',
  },
  {
    slug: 'food',
    title: 'フード',
    description: '学内外の飲食企画はこちら。軽食からスイーツまでチェックできます。',
    type: 'フード',
  },
  {
    slug: 'exhibitions',
    title: '展示',
    description: '研究室やサークルの展示企画を集めました。',
    type: '展示',
  },
  {
    slug: 'events',
    title: 'イベント',
    description: 'ワークショップや体験イベントなどの企画一覧です。',
    type: 'イベント',
  },
];

export const categoryConfigBySlug = CATEGORY_PAGE_CONFIGS.reduce<Record<string, CategoryPageConfig>>(
  (acc, config) => {
    acc[config.slug] = config;
    return acc;
  },
  {},
);

export const categorySlugs = CATEGORY_PAGE_CONFIGS.map((config) => config.slug);
