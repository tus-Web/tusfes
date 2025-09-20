'use client';
import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import 'mapbox-gl/dist/mapbox-gl.css';
 
export default function SimpleMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoicmlrdS1vZ2F3YSIsImEiOiJjbWZzZGJzdDYwNG4zMmpvZXBwN2V6YXZ5In0.M7sZno-EhE51gYER_aeEjg'
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  const bounds: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
        [139.8610, 35.7700], // 南西の座標
        [139.8640, 35.7730]  // 北東の座標
      ];
 
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
        center: [139.8632, 35.7719], // 東京駅を初期値点として表示（緯度、経度を指定）
        zoom: 17.5,
        style: 'mapbox://styles/mapbox/streets-v12',
        maxBounds: bounds // 地図の表示範囲を設定
      });
      // 言語変更設定参考
      // defaultLanguageとしてjaを指定
      const language = new MapboxLanguage({ defaultLanguage: 'ja' });
      map.addControl(language);
      

      map.on('load', () => {
        setMap(map);
        map.resize();
      });
    };
 
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);
 
  return (
    <>
      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
    </>
  );
}