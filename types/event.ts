export interface Event {
  id: string;
  name: string;
  category: EventCategory;
  tags: string[];
  description: string;
  organization: string;
  location: string;
  detailUrl: string;
  imageUrl?: string;
}

export interface EventsJSONItem {
  id: string;
  name: string;
  category: EventCategory;
  tags: string[];
  description: string;
  organization: string;
  schedule?: string;
  location: string;
  floor: string;
  position: { x: number; y: number, lng?: number, lat?: number };
  imageUrl?: string;
  detailUrl?: string;
}

export type EventCategory = '模擬店' | '展示' | 'イベント' | 'フード';
// UI での絞り込み用カテゴリ（タグベースの派生カテゴリも含む）
export type FilterCategory = '全て' | EventCategory | 'ステージ' | '屋外企画';
