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

export interface EventsJSONItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  organization: string;
  location: string;
  floor: string;
  position: { x: number; y: number, lng?: number, lat?: number };
  imageUrl?: string;
  detailUrl?: string;
}

export type EventCategory = '展示' | 'フード' | 'イベント' | 'アメニティ';
