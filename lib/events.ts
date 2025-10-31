import eventsData from '@/data/events.json';
import { Event } from '@/types/event';

/**
 * 全イベントデータを取得
 */
export function getAllEvents(): Event[] {
  return eventsData as Event[];
}

/**
 * IDでイベントを取得
 */
export function getEventById(id: string): Event | undefined {
  const events = getAllEvents();
  return events.find((event) => event.id === id);
}

/**
 * カテゴリーでイベントをフィルタ
 */
export function getEventsByCategory(category: Event['category']): Event[] {
  const events = getAllEvents();
  return events.filter((event) => event.category === category);
}

/**
 * 場所でイベントをフィルタ
 */
export function getEventsByLocation(location: string): Event[] {
  const events = getAllEvents();
  return events.filter((event) => event.location.includes(location));
}

/**
 * タグでイベントをフィルタ
 */
export function getEventsByTag(tag: string): Event[] {
  const events = getAllEvents();
  return events.filter((event) => event.tags.includes(tag));
}

/**
 * 複数の条件でイベントを検索
 */
export function searchEvents(params: {
  query?: string;
  category?: Event['category'];
  tags?: string[];
  locations?: string[];
}): Event[] {
  let events = getAllEvents();

  // カテゴリーフィルター
  if (params.category) {
    events = events.filter((event) => event.category === params.category);
  }

  // 検索クエリフィルター
  if (params.query) {
    const query = params.query.toLowerCase();
    events = events.filter(
      (event) =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.organization.toLowerCase().includes(query)
    );
  }

  // タグフィルター
  if (params.tags && params.tags.length > 0) {
    events = events.filter((event) =>
      params.tags!.every((tag) => event.tags.includes(tag))
    );
  }

  // 場所フィルター
  if (params.locations && params.locations.length > 0) {
    events = events.filter((event) =>
      params.locations!.some((loc) => event.location.includes(loc))
    );
  }

  return events;
}
