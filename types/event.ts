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

export type EventCategory = '展示' | 'フード' | 'イベント' | 'アメニティ';
