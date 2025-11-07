"use client";
import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase/client";

type Review = {
  id: number;
  display_id: number;
  user_id: number;
  rating: number;
  comment: string;
}

export default function ReviewsPage() {
  //実際はsupabaseで同じ型のデータを取得する.
  const displays = [
    { id: 1, name: "Display1"},
    { id: 2, name: "Display2"},
    { id: 3, name: "Display3"}
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*');
    }
  })
  
  return(
    <main>
      <h1>レビューページ</h1>
      <ul>
        {displays.map((display) => (
          <div key={display.id}>
          <li key={display.id}>
            <Link href={`reviews/${display.id}`}>{display.name}</Link>  
          </li>

          </div>
        ))}
      </ul>

    </main>
    
  );
}