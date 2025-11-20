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

import type { Feature, Polygon } from 'geojson';

import events from '@/src/data/events.json';

// 2. boothData を ExhibitionItem (ExhibitionModal が要求する型) に合わせます
// マーカー表示に必要な `lngLat` も残しておきます
// boothData はマーカー表示に必要な最小限の情報だけを持たせます。
// モーダルに渡す完全な ExhibitionItem 互換オブジェクトは
// クリック時にマッピングして作成します（余計なデータを配列に持たないため）。

const boothData = events
  .filter(event => event?.position?.lng && event?.position?.lat)
  .map((event) => ({
    lngLat: [event?.position?.lng, event?.position?.lat] as [number, number],
    id: event.id,
    name: event.name,
    type: event.category || '展示',
    tags: event.tags || [],
    description: event.description || '',
    organization: event.organization || '',
    location: event.location || '',
    imageUrl: event?.imageUrl || null,
    position: {
      x: event?.position?.x || 50,
      y: event?.position?.y || 50,
    },
  }));

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
  const [filterParams, setFilterParams] = useState<{
    category: string;
    query: string;
    tag: string | null;
    tags: string[];
    locations: string[];
  }>({
    category: '全て',
    query: '',
    tag: null,
    tags: [],
    locations: [],
  });

  // external link confirmation state for 食堂
  const [externalConfirm, setExternalConfirm] = useState<{ url: string; name?: string } | null>(null);

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
      imageUrl: ev.imageUrl || ev.image || null,
      tags: ev.tags || [],
      reviews: [],
    } as any;

    // Open ExhibitionModal but keep the floor modal visible so users can easily reopen other booths
    setSelectedBooth(mapped);
  };

  const onBottomBarPressed = (id: string) => {
    router.push(`/${id}`);
  };

  // SearchHeader からの検索条件を受け取る（マップ上のピンは位置を変えず表示/非表示を切替）
  const handleSearch = (params: {
    category: string;
    query: string;
    tag: string | null;
    tags?: string[];
    locations?: string[];
  }) => {
    setFilterParams((prev) => ({
      category: params.category,
      query: params.query,
      tag: params.tag,
      tags: params.tags ?? prev.tags,
      locations: params.locations ?? prev.locations,
    }));
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
        zoom: 15,
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

      const maskGeoJson: Feature<Polygon> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            // 外側
            [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
            // 内側
            [
            [139.86468906681867, 35.77043838971092],
            [139.86211980338487, 35.77133803801555],
            [139.8614288295468, 35.77184613967636],
            [139.8619176485884, 35.77258170730573],
            [139.8629414676755, 35.7727800898285],
            [139.86374099919203, 35.772552356775876],
            [139.86520779309967, 35.77161676904132],
              
            ]
          ]
        }
      }
      
      const language = new MapboxLanguage({ defaultLanguage: 'ja' });
      map.addControl(language);
      
      map.on('load', () => {
        setMap(map);
        map.resize();

        map.addSource('mask-source', {
          type: 'geojson',
          data: maskGeoJson
        });

        map.addLayer({
          id: 'mask-layer',
          type: 'fill',
          source: 'mask-source',
          'paint': {
            'fill-color': '#34D399',
            'fill-opacity': 0.7
          }
        })

        // create markers and keep refs for toggling visibility later
        boothData.forEach(booth => {
          // If this is the cafeteria ('食堂'), use a custom SVG marker
          if (booth.name === '食堂') {
            const el = document.createElement('div');
            el.className = 'marker marker-cafeteria';
            // public フォルダ配下はビルド時にルート `/` にマップされるので先頭に `/` を付ける
            el.style.backgroundImage = 'url(/img/pin/food-dish-svgrepo-com.svg)';
            el.style.backgroundSize = 'contain';
            // el.style.backgroundRepeat = 'no-repeat';
            // el.style.backgroundPosition = 'center';

            // sizing & accessibility
            el.style.width = '58px';
            el.style.height = '58px';
            // el.style.cursor = 'pointer';
            el.tabIndex = 0;
            el.setAttribute('role', 'button');
            el.setAttribute('aria-label', `${booth.name} のピン`);

            const marker = new mapboxgl.Marker(el)
              .setLngLat(booth.lngLat)
              .addTo(map);

            // store association
            markersRef.current.push({ booth, marker });

            // preserve existing click behaviour for cafeteria
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              const url = 'https://tus-dining.starpayorder.com/shops/shp_107fa915bbc4e3360d40a5a';
              setExternalConfirm({ url, name: booth.name });
            });

            el.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const url = 'https://tus-dining.starpayorder.com/shops/shp_107fa915bbc4e3360d40a5a';
                setExternalConfirm({ url, name: booth.name });
              }
            });

            return; // continue to next booth
          }

          // default marker for other booths
          const marker = new mapboxgl.Marker({ color: '#c00000' })
            .setLngLat(booth.lngLat)
            .addTo(map);

          // store association
          markersRef.current.push({ booth, marker });

          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation();

            if (booth.name === '講義棟') {
              setFloorOpen(true);
              return;
            }

            const mapped = {
              id: booth.id,
              name: booth.name || `ブース ${booth.id}`,
              type: booth.type || '展示',
              position: booth.position || { x: 50, y: 50 },
              targetAudience: [],
              description: (booth as any).description || '',
              detailedDescription: (booth as any).description || '',
              location: (booth as any).location || '',
              schedule: (booth as any).schedule || '',
              organizer: (booth as any).organization || '',
              imageUrl: (booth as any).imageUrl || (booth as any).image || null,
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

    const { category, query, tag, tags, locations } = filterParams;

    markersRef.current.forEach(({ booth, marker }) => {
      let visible = true;
      // treat '全て' or empty as no filtering for category
      if (category && category !== '全て') {
        visible = visible && (booth.type === category);
      }
      if (query) {
        visible = visible && booth.name.toLowerCase().includes(query.toLowerCase());
      }
      if (tag) {
        visible = visible && Array.isArray(booth.tags) && booth.tags.includes(tag);
      }
      if (tags && tags.length > 0) {
        visible = visible && Array.isArray(booth.tags) && tags.every((t) => booth.tags.includes(t));
      }
      if (locations && locations.length > 0) {
        const boothLocation = (booth as any).location;
        if (typeof boothLocation === 'string' && boothLocation.length > 0) {
          visible = visible && locations.some((loc) => boothLocation.includes(loc));
        } else {
          visible = false;
        }
      }

      const el = marker.getElement();
      el.style.display = visible ? '' : 'none';
    });
  }, [filterParams]);
 
  return (
    <>
  {/* 検索ヘッダーをマップの上に配置 */}
  <SearchHeader showFilterButton={true} onSearch={handleSearch} filterMode="modal" />

      {/* 外部リンク確認バー （食堂） */}
      {externalConfirm && (
        <div style={{position: 'fixed', left: 16, right: 16, top: 80, zIndex: 9999, display: 'flex', justifyContent: 'center'}}>
          <div style={{background: 'white', padding: '10px 16px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', display: 'flex', gap: 8, alignItems: 'center'}}>
            <div style={{fontWeight: 600}}>{externalConfirm.name} の外部サイトに移動しますか？</div>
            <button
              onClick={() => {
                const newWindow = window.open(externalConfirm.url, '_blank');
                if (newWindow) newWindow.opener = null;
                setExternalConfirm(null);
              }}
              style={{background: '#10B981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer'}}
            >移動する</button>
            <button
              onClick={() => setExternalConfirm(null)}
              style={{background: 'transparent', border: '1px solid #ddd', padding: '8px 12px', borderRadius: 6, cursor: 'pointer'}}
            >キャンセル</button>
          </div>
        </div>
      )}

      {/* 4. ここを ExhibitionModal に差し替えます */}
      <FloorModal
        open={floorOpen}
        onClose={() => setFloorOpen(false)}
        onSelectExhibition={handleSelectExhibitionFromFloor}
      />

      <ExhibitionModal 
        open={!!selectedBooth} // selectedBooth が null でなければ true
        onClose={() => setSelectedBooth(null)} // 閉じるための関数
        exhibition={selectedBooth} // 選択されたブースのデータ（オブジェクト丸ごと）
      />
 
  <div ref={mapContainer} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
      <BottomBar activeTab="map" onTabChange={onBottomBarPressed} />
    </>
  );
}