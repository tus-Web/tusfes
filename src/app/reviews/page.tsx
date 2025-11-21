"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/src/lib/supabase/client";
import eventsData from "@/data/events.json";

type ReviewRow = {
  display_id: number;
  rating: number;
};

type ReviewSummary = {
  average: number;
  count: number;
};

const calculateSummary = (rows: ReviewRow[]): Record<string, ReviewSummary> => {
  const grouped: Record<string, number[]> = {};

  rows.forEach(({ display_id, rating }) => {
    const key = String(display_id);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(rating);
  });

  return Object.fromEntries(
    Object.entries(grouped).map(([displayId, ratings]) => {
      const count = ratings.length;
      const average = ratings.reduce((acc, cur) => acc + cur, 0) / count;
      return [displayId, { average, count }];
    })
  );
};

export default function ReviewsPage() {
  const [summaries, setSummaries] = useState<Record<string, ReviewSummary>>({});

  useEffect(() => {
    const fetchSummaries = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("display_id,rating");

      if (error || !data) {
        console.error("レビューの取得に失敗しました", error);
        setSummaries({});
        return;
      }

      setSummaries(calculateSummary(data as ReviewRow[]));
    };

    fetchSummaries();
  }, []);

  const displays = useMemo(
    () =>
      (eventsData as { id: string; name: string }[]).map((event) => ({
        id: event.id,
        name: event.name,
      })),
    []
  );

  return (
    <main>
      <h1>レビュー一覧</h1>
      <ul>
        {displays.map((display) => {
          const summary = summaries[display.id];
          const averageText =
            summary && summary.count > 0 ? summary.average.toFixed(2) : "-";
          const countText = summary?.count ?? 0;

          return (
            <li key={display.id}>
              <Link href={`/reviews/${display.id}`}>
                {display.name} / ★{averageText} / {countText}件
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
