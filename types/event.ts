export interface Event {
  id: string;
  name: string;
  category: '展示' | 'フード' | 'イベント' | 'アメニティ';
  tags: string[];
  description: string;
  organization: string;
  location: string;
  detailUrl: string;
  imageUrl?: string;
}

export interface SupabaseExhibition {
  id: number | null,
  exhibition_id: string | null;
  name: string | null;
  group_name: string | null;
  explanation: string | null;
  latitude: number | null;
  longitude: number | null;
  type: '展示' | 'フード' | 'イベント' | 'アメニティ' | null;
  minimap_pos_x: number | null;
  minimap_pos_y: number | null;
  target_audience: string[] | null;
  location: string | null;
  schedule: string | null;
  tags: string[] | null;
}

export type EventCategory = '展示' | 'フード' | 'イベント' | 'アメニティ';
