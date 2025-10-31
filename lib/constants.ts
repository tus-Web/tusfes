/**
 * アプリケーション全体で使用する定数
 */

export type CategoryType = '展示' | 'フード' | 'イベント' | 'アメニティ';

/**
 * カテゴリー一覧
 */
export const categories: CategoryType[] = ['展示', 'フード', 'イベント', 'アメニティ'];

/**
 * タグ一覧
 */
export const allTags = [
  '家族におすすめ',
  '学生向け',
  '体験型',
  '写真映え',
  '限定品あり',
  '屋内',
  '屋外',
  '無料',
];

/**
 * 場所一覧
 */
export const locations = [
  '1号館',
  '2号館',
  '3号館',
  '4号館',
  '中庭',
  '正門前広場',
  '野外ステージ',
  '大講堂',
  '学生食堂',
];

/**
 * 表示データ（仮データ）
 */
export const displays = {
  1: { id: 1, name: 'Display1' },
  2: { id: 2, name: 'Display2' },
  3: { id: 3, name: 'Display3' },
};
