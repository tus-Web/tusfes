'use client';
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { useRouter } from 'next/navigation';

import ExhibitionModal from '@/components/pages/map/ExhibitionModal/ExhibitionModal';
import BottomBar from '@/components/shared/layout/BottomBar/BottomBar';
import SearchHeader from '@/components/shared/search/SearchHeader/SearchHeader';
import { boothData } from '@/data/boothData';
import styles from './page.module.css';


// bounds を関数外に移動してleーー(再レンダリング時に同じ参照を保つ)
const bounds: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
  [139.8610, 35.7700], // 南西の座標
  [139.8650, 35.7730]  // 北東の座標
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
 
      <div ref={mapContainer} className={styles.mapContainer} />
      <BottomBar activeTab="map" onTabChange={onBottomBarPressed} />
    </>
  );
}