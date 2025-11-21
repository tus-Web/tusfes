'use client';

import SearchResultCard from '@/components/shared/search/SearchResultCard/SearchResultCard';
import type { Event } from '@/types/event';

interface CategoryResultsListProps {
  events: Event[];
}

export default function CategoryResultsList({ events }: CategoryResultsListProps) {
  return (
    <>
      {events.map((event) => (
        <SearchResultCard key={event.id} item={event} />
      ))}
    </>
  );
}
