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
  type: 'フード',
  tags: ['フード'],
    // ミニマップ用の座標（必要ならマッピング時に使う）
    position: { x: 30, y: 30 },
  },
  {
    lngLat: [139.8631, 35.7724] as [number, number],
  id: 2,
  name: 'ドローンサークル',
  type: '展示',
  tags: ['学生向け'],
    position: { x: 60, y: 40 },
  },
  {
    lngLat: [139.8634, 35.7723] as [number, number],
  id: 3,
  name: 'フリーマーケット',
  type: 'フード',
  tags: ['屋外'],
    position: { x: 60, y: 40 },
  },
  {
    lngLat: [139.8644, 35.7715] as [number, number],
  id: 4,
  name: '講義等',
  type: 'イベント',
  tags: ['屋内'],
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

  // 3. この state に、boothData のオブジェクトが丸ごと入ります (型を緩めて any に)
  // ExhibitionModal 側の ExhibitionItem 型がコンポーネント内で定義されているため
  // ここでは any を使って互換性を確保します。必要なら共通型に差し替えてください。
  const [selectedBooth, setSelectedBooth] = useState<any | null>(null);
  const [floorOpen, setFloorOpen] = useState(false);
  const [filterParams, setFilterParams] = useState<{ category: string; query: string; tag: string | null }>({
    category: '',
    query: '',
    tag: null,
  });

  // keep markers so we can toggle visibility without changing positions
  const markersRef = useRef<Array<{ booth: any; marker: mapboxgl.Marker }>>([]);

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

  // SearchHeader からの検索条件を受け取る（マップ上のピンは位置を変えず表示/非表示を切替）
  const handleSearch = (params: { category: string; query: string; tag: string | null }) => {
    setFilterParams(params);
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

        // create markers and keep refs for toggling visibility later
        boothData.forEach(booth => {
          const marker = new mapboxgl.Marker({ color: '#c00000' })
            .setLngLat(booth.lngLat)
            .addTo(map);

          // store association
          markersRef.current.push({ booth, marker });

          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation();
            if (booth.name === '食堂') {
              const url = 'https://tus-dining.starpayorder.com/shops/shp_107fa915bbc4e3360d40a5a';
              const newWindow = window.open(url, '_blank');
              if (newWindow) newWindow.opener = null;
              return;
            }

            if (booth.name === '講義等') {
              setFloorOpen(true);
              return;
            }

            const mapped = {
              id: Number(booth.id) || booth.id,
              name: booth.name || `ブース ${booth.id}`,
              type: booth.type || '展示',
              position: booth.position || { x: 50, y: 50 },
              targetAudience: [],
              description: '',
              detailedDescription: '',
              location: '',
              schedule: '',
              organizer: '',
              tags: booth.tags || [],
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

  // toggle marker visibility based on filterParams without changing positions
  useEffect(() => {
    if (!markersRef.current || markersRef.current.length === 0) return;

    const { category, query, tag } = filterParams;

    markersRef.current.forEach(({ booth, marker }) => {
      let visible = true;
      if (category) {
        visible = visible && (booth.type === category);
      }
      if (query) {
        visible = visible && booth.name.toLowerCase().includes(query.toLowerCase());
      }
      if (tag) {
        visible = visible && Array.isArray(booth.tags) && booth.tags.includes(tag);
      }

      const el = marker.getElement();
      el.style.display = visible ? '' : 'none';
    });
  }, [filterParams]);
 
  return (
    <>
  {/* 検索ヘッダーをマップの上に配置 */}
  <SearchHeader showFilterButton={true} onSearch={handleSearch} />

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