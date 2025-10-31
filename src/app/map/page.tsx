'use client';
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { useRouter } from 'next/navigation';
import ExhibitionModal from '@/components/pages/map/ExhibitionModal/ExhibitionModal';
import BottomBar from '@/components/shared/layout/BottomBar/BottomBar';
import SearchHeader from '@/components/shared/search/SearchHeader/SearchHeader';
import { boothData, mapBounds, mapConfig, BoothData } from '@/lib/mapData';
import styles from './page.module.css';

export default function SimpleMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoicmlrdS1vZ2F3YSIsImEiOiJjbWZzZGJzdDYwNG4zMmpvZXBwN2V6YXZ5In0.M7sZno-EhE51gYER_aeEjg'
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const router = useRouter();

  const [selectedBooth, setSelectedBooth] = useState<BoothData | null>(null);

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
        center: mapConfig.center,
        zoom: mapConfig.zoom,
        pitch: mapConfig.pitch,
        bearing: mapConfig.bearing,
        antialias: true,
        style: 'mapbox://styles/mapbox/streets-v11',
        config: {
          basemap: {
            theme: 'custom',
            lightPreset: 'day',
            font: "Alegreya SC",
          }
        },
        maxBounds: mapBounds
      });
      
      const language = new MapboxLanguage({ defaultLanguage: 'ja' });
      map.addControl(language);
      
      map.on('load', () => {
        setMap(map);
        map.resize();

        boothData.forEach(booth => {
          const marker = new mapboxgl.Marker({
              color: '#c00000'
            })
            .setLngLat(booth.lngLat)
            .addTo(map);

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
      <SearchHeader showFilterButton={true} />

      <ExhibitionModal 
        open={!!selectedBooth}
        onClose={() => setSelectedBooth(null)}
        exhibition={selectedBooth}
      />
 
      <div ref={mapContainer} className={styles.mapContainer} />
      <BottomBar activeTab="map" onTabChange={onBottomBarPressed} />
    </>
  );
}