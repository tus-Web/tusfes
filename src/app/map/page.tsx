'use client';
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { useRouter } from 'next/navigation';

// 1. 作成した ExhibitionModal をインポートします
import ExhibitionModal from '@/components/pages/map/ExhibitionModal/ExhibitionModal';
import BottomBar from '@/components/shared/layout/BottomBar/BottomBar';
import SearchHeader from '@/components/shared/search/SearchHeader/SearchHeader'; 

// 2. boothData を ExhibitionItem (ExhibitionModal が要求する型) に合わせます
// マーカー表示に必要な `lngLat` も残しておきます
const boothData = [
  {
    // --- マーカー表示に必要 ---
    lngLat: [139.8632, 35.7719] as [number, number], 
    
    // --- 以下、ExhibitionModal に渡すデータ (ExhibitionItem 互換) ---
    id: 1,
    name: 'ブースA: AI研究室',
    type: '展示',
    // ミニマップ用の座標 (0-100のパーセンテージ)
    position: { x: 30, y: 30 }, 
    targetAudience: ['高校生', '大学生'],
    description: 'AIによる画像認識のデモを行います。',
    detailedDescription: 'AIによる画像認識のデモンストレーションを行います。サンプルの画像を持ち込んでもOKです！最先端のディープラーニングモデルを体験してください。',
    location: '1号館 101教室',
    schedule: '10:00 - 17:00 (終日)',
    organizer: 'AI研究室（〇〇研究室）',
    tags: ['展示', '子供向け', '高校生'],
    // reviews は Modal 側で mockReviews が定義されているので空でもOK
    reviews: [], 
  },
  {
    lngLat: [139.8635, 35.7722] as [number, number],
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
  // ... 他のブースデータも同様に追加
];


// bounds を関数外に移動してleーー(再レンダリング時に同じ参照を保つ)
const bounds: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
  [139.8590, 35.7680], // 南西の座標
  [139.8670, 35.7760]  // 北東の座標
];

export default function SimpleMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoicmlrdS1vZ2F3YSIsImEiOiJjbWZzZGJzdDYwNG4zMmpvZXBwN2V6YXZ5In0.M7sZno-EhE51gYER_aeEjg'
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const router = useRouter();

  // 3. この state に、boothData のオブジェクトが丸ごと入ります (型を修正)
  const [selectedBooth, setSelectedBooth] = useState<typeof boothData[0] | null>(null);

  const onBottomBarPressed = (id: string) => {
    router.push(`/${id}`);
  };

  useEffect(() => {
    const initializeMap = ({
      setMap,
      mapContainer,
    }: {
      setMap: any;
      mapContainer: any;
    }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        center: [139.8632, 35.7719],
        zoom: 17,
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

        // データの形式が変わっただけで、マーカー生成ロジックは同じ
        boothData.forEach(booth => {
          const marker = new mapboxgl.Marker({
              color: '#c00000'
            })
            .setLngLat(booth.lngLat) // boothData の lngLat を使用
            .addTo(map);

          // クリック時に booth オブジェクト全体を state にセット
          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation(); 
            setSelectedBooth(booth);
          });
        });
      });

      map.on('click', () => {
        setSelectedBooth(null);
      });
    };
 
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]); 
 
  return (
    <>
      {/* 検索ヘッダーをマップの上に配置 */}
      <SearchHeader showFilterButton={true} />

      {/* 4. ここを ExhibitionModal に差し替えます */}
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