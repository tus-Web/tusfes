'use client';
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase/client';

// ExhibitionModal をインポート
import ExhibitionModal from '@/components/pages/map/ExhibitionModal/ExhibitionModal';
import BottomBar from '@/components/shared/layout/BottomBar/BottomBar';
import SearchHeader from '@/components/shared/search/SearchHeader/SearchHeader'; 

// Supabaseから取得する型定義
export interface SupabaseData {
  id: number;
  exhibition_id: string;
  name: string;
  group_name: string | null;
  explanation: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
  minimap_pos_x: number | null;
  minimap_pos_y: number | null;
  target_audience: string[] | null;
  location: string | null;
  schedule: string | null;
  tags: string[] | null;
};

// /mapページ用にデータを変換する型
export interface MapData {
  lngLat: [number, number];
  id: number;
  name: string;
  type: string;
  position: { x: number; y: number };
  targetAudience: string[];
  description: string;
  detailedDescription: string;
  location: string;
  schedule: string;
  organizer: string;
  tags: string[];
  reviews: any[];
};

// bounds を関数外に移動(再レンダリング時に同じ参照を保つ)
const bounds: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
  [139.8610, 35.7700], // 南西の座標
  [139.8650, 35.7730]  // 北東の座標
];

export async function getExhibitions(): Promise<MapData[]> {
  const { data, error } = await supabase
    .from('exhibition table')
    .select('*');

  if (error || !data) {
    console.error('展示データの取得に失敗しました:', error);
    return [];
  }

  // Supabaseのデータを MapData 形式に変換
  const transformedData: MapData[] = data
    .filter((item: SupabaseData) => item.latitude && item.longitude) // 座標がないデータは除外
    .map((item: SupabaseData) => ({
      lngLat: [item.longitude!, item.latitude!] as [number, number],
      id: item.id,
      name: item.name || '名称未設定',
      type: item.type || '展示',
      position: { 
        x: item.minimap_pos_x ? Number(item.minimap_pos_x) : 50, 
        y: item.minimap_pos_y ? Number(item.minimap_pos_y) : 50 
      },
      targetAudience: item.target_audience || [],
      description: item.explanation || '',
      detailedDescription: item.explanation || '',
      location: item.location || '場所未設定',
      schedule: item.schedule || '時間未設定',
      organizer: item.group_name || '主催者未設定',
      tags: item.tags || [],
      reviews: [],
    }));
  
  return transformedData;
}

export default function MapClient() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const router = useRouter();

  // Supabaseから取得したデータを保持する state
  const [boothData, setBoothData] = useState<MapData[]>([]);
  // 選択されたブースを保持する state
  const [selectedBooth, setSelectedBooth] = useState<MapData | null>(null);

  const onBottomBarPressed = (id: string) => {
    router.push(`/${id}`);
  };

  // データ取得
  useEffect(() => {
    const fetchBoothData = async () => {
      const data = await getExhibitions();
      setBoothData(data);
    };
    fetchBoothData();
  }, []);

  // マップの初期化
  useEffect(() => {
    const initializeMap = ({
      setMap,
      mapContainer,
    }: {
      setMap: any;
      mapContainer: any;
    }) => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        center: [139.8632, 35.7719],
        zoom: 17.5,
        pitch: 0, 
        bearing: -62,
        antialias: true,
        style: 'mapbox://styles/mapbox/streets-v11',
        config: {
          basemap: {
            theme: 'custom',
            lightPreset: 'day',
            font: "Alegreya SC",
          }
        },
        maxBounds: bounds
      });
      
      const language = new MapboxLanguage({ defaultLanguage: 'ja' });
      map.addControl(language);
      
      map.on('load', () => {
        setMap(map);
        map.resize();
      });

      map.on('click', () => {
        setSelectedBooth(null);
      });
    };
 
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]); 

  // boothData が取得されたらマーカーを配置
  useEffect(() => {
    if (!map || boothData.length === 0) return;

    // 既存のマーカーをクリア（もし必要なら）
    const markers: mapboxgl.Marker[] = [];

    boothData.forEach((booth: MapData) => {
      const marker = new mapboxgl.Marker({
          color: '#c00000'
        })
        .setLngLat(booth.lngLat)
        .addTo(map);

      // クリック時に booth オブジェクト全体を state にセット
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation(); 
        setSelectedBooth(booth);
      });

      markers.push(marker);
    });

    // クリーンアップ関数でマーカーを削除
    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [map, boothData]);

  return (
    <>
      {/* 検索ヘッダーをマップの上に配置 */}
      <SearchHeader showFilterButton={true} />

      {/* ExhibitionModal を表示 */}
      <ExhibitionModal 
        open={!!selectedBooth} // selectedBooth が null でなければ true
        onClose={() => setSelectedBooth(null)} // 閉じるための関数
        exhibition={selectedBooth} // 選択されたブースのデータ（オブジェクト丸ごと）
      />
 
      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
      <BottomBar activeTab="map" onTabChange={onBottomBarPressed} />
    </>
  );
}