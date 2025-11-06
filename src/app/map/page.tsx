'use client';
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { useRouter } from 'next/navigation';

// 1. 作成した ExhibitionModal をインポートします
import ExhibitionModal from '@/components/pages/map/ExhibitionModal/ExhibitionModal';
import FloorModal from '@/components/pages/map/FloorModal/FloorModal';
import BottomBar from '@/components/shared/layout/BottomBar/BottomBar';
import SearchHeader from '@/components/shared/search/SearchHeader/SearchHeader'; 

// 2. boothData を ExhibitionItem (ExhibitionModal が要求する型) に合わせます
// マーカー表示に必要な `lngLat` も残しておきます
// boothData はマーカー表示に必要な最小限の情報だけを持たせます。
// モーダルに渡す完全な ExhibitionItem 互換オブジェクトは
// クリック時にマッピングして作成します（余計なデータを配列に持たないため）。
const boothData = [
  {
    // マーカー表示に必要
    lngLat: [139.8632, 35.7719] as [number, number],
    id: 1,
    name: '食堂',
    // ミニマップ用の座標（必要ならマッピング時に使う）
    position: { x: 30, y: 30 },
  },
  {
    lngLat: [139.8631, 35.7724] as [number, number],
    id: 2,
    name: 'ドローンサークル',
    position: { x: 60, y: 40 },
  },
  {
    lngLat: [139.8634, 35.7723] as [number, number],
    id: 3,
    name: 'フリーマーケット',
    position: { x: 60, y: 40 },
  },
  {
    lngLat: [139.8644, 35.7715] as [number, number],
    id: 4,
    name: '講義等',
    position: { x: 60, y: 40 },
  },
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
  const [floorOpen, setFloorOpen] = useState(false);

  const handleSelectExhibitionFromFloor = (ev: any) => {
    // Map events.json entry to ExhibitionItem-like object expected by ExhibitionModal
    const mapped = {
      id: Number(ev.id) || ev.id,
      name: ev.name,
      type: ev.category || '展示',
      position: { x: 50, y: 50 },
      targetAudience: ev.tags || [],
      description: ev.description || '',
      detailedDescription: ev.description || '',
      location: ev.location || '',
      schedule: ev.schedule || '',
      organizer: ev.organization || '',
      tags: ev.tags || [],
      reviews: [],
    } as any;

    // Open ExhibitionModal but keep FloorModal open
    setSelectedBooth(mapped);
  };

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

          // クリック時に ExhibitionModal が期待する形にマッピングして state にセット
          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation();
            // 特定のピン（ここでは id === 4）を押したら FloorModal を開く
            if (booth.name === '講義等') {
              setFloorOpen(true);
              return;
            }

            // boothData 自体は軽量化しているため、モーダルに渡す形にここで組み立てる
            const mapped = {
              id: Number(booth.id) || booth.id,
              name: booth.name || `ブース ${booth.id}`,
              type: '展示',
              position: booth.position || { x: 50, y: 50 },
              targetAudience: [],
              description: '',
              detailedDescription: '',
              location: '',
              schedule: '',
              organizer: '',
              tags: [],
              reviews: [],
            } as any;

            setSelectedBooth(mapped);
          });
        });
      });

      // マップの他の部分をクリックしたらモーダルを閉じる
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
      <FloorModal
        open={floorOpen}
        onClose={() => setFloorOpen(false)}
      />

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