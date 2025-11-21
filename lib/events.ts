import eventsData from '@/data/events.json';
import { Event, FilterCategory } from '@/types/event';

const STAGE_KEYWORDS = ['ステージ'];
const OUTDOOR_KEYWORDS = ['屋外', '中庭', '野外', '広場'];

/**
 * 全イベントデータを取得
 */
export function getAllEvents(): Event[] {
  return eventsData as Event[];
}

/**
 * IDでイベントを取得
 */
export function getEventById(id: string|number): Event | undefined {
  const idStr = String(id);
  const events = getAllEvents();
  return events.find((event) => event.id === idStr);
}

/**
 * カテゴリーでイベントをフィルタ
 */
export function getEventsByCategory(category: FilterCategory): Event[] {
  const events = getAllEvents();
  return events.filter((event) => matchesCategory(event, category));
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
 * UI カテゴリに応じたマッチ判定
 */
export function matchesCategory(event: Event, category: FilterCategory): boolean {
  if (category === '全て') return true;
  if (category === 'ステージ') {
    return (
      event.tags?.includes('ステージ') ||
      STAGE_KEYWORDS.some((keyword) => event.name.includes(keyword) || event.location.includes(keyword))
    );
  }
  if (category === '屋外企画') {
    return (
      event.tags?.includes('屋外') ||
      OUTDOOR_KEYWORDS.some((keyword) => event.location.includes(keyword))
    );
  }
  return event.category === category;
}

/**
 * 複数の条件でイベントを検索
 */
export function searchEvents(params: {
  query?: string;
  category?: FilterCategory;
  tags?: string[];
  locations?: string[];
}): Event[] {
  let events = getAllEvents();

  // カテゴリーフィルター
  if (params.category && params.category !== '全て') {
    events = events.filter((event) => matchesCategory(event, params.category!));
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
