"use client";

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'favoriteExhibitions';

const normalizeId = (id: string | number) => String(id);

const readFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map((value) => normalizeId(value)) : [];
  } catch (error) {
    console.warn('お気に入りの読み込みに失敗しました', error);
    return [];
  }
};

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(readFromStorage());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setFavoriteIds(readFromStorage());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const persist = useCallback((next: string[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setFavoriteIds(next);
  }, []);

  const isFavorite = useCallback(
    (id?: string | number | null) => {
      if (!id) return false;
      return favoriteIds.includes(normalizeId(id));
    },
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    (id: string | number) => {
      const normalized = normalizeId(id);
      setFavoriteIds((prev) => {
        const exists = prev.includes(normalized);
        const next = exists ? prev.filter((favId) => favId !== normalized) : [...prev, normalized];
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [],
  );

  const removeFavorite = useCallback(
    (id: string | number) => {
      const normalized = normalizeId(id);
      persist(favoriteIds.filter((favId) => favId !== normalized));
    },
    [favoriteIds, persist],
  );

  const setFavorites = useCallback((ids: Array<string | number>) => {
    const normalized = ids.map((value) => normalizeId(value));
    persist(Array.from(new Set(normalized)));
  }, [persist]);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    setFavorites,
  };
};
