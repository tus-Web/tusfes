/**
 * Booth data for map page
 */

import { Review } from '@/lib/reviews';

export interface BoothData {
  // Marker display data
  lngLat: [number, number];
  
  // Exhibition modal data
  id: number;
  name: string;
  type: string;
  position: { x: number; y: number };
  targetAudience: string[];
  description: string;
  detailedDescription: string;
  location: string;
  schedule: string;
  capacity?: number;
  organizer: string;
  tags: string[];
  reviews?: Review[];
}

export const boothData: BoothData[] = [
  {
    lngLat: [139.8632, 35.7719],
    id: 1,
    name: 'ブースA: AI研究室',
    type: '展示',
    position: { x: 30, y: 30 },
    targetAudience: ['高校生', '大学生'],
    description: 'AIによる画像認識のデモを行います。',
    detailedDescription: 'AIによる画像認識のデモンストレーションを行います。サンプルの画像を持ち込んでもOKです！最先端のディープラーニングモデルを体験してください。',
    location: '1号館 101教室',
    schedule: '10:00 - 17:00 (終日)',
    organizer: 'AI研究室（〇〇研究室）',
    tags: ['展示', '子供向け', '高校生'],
    reviews: [],
  },
  {
    lngLat: [139.8635, 35.7722],
    id: 2,
    name: 'ブースB: ドローンサークル',
    type: '体験',
    position: { x: 60, y: 40 },
    targetAudience: ['子供向け', '高校生'],
    description: '最新ドローンの展示と飛行体験。',
    detailedDescription: 'サークルで開発した最新ドローンの展示と、シミュレータによる飛行体験ができます。全国大会4位の実力をぜひご覧ください。',
    location: '中庭 特設エリア',
    schedule: '11:00 - 16:00',
    capacity: 10,
    organizer: 'ドローンサークル "StampFly"',
    tags: ['イベント', '子供向け'],
    reviews: [],
  },
];
