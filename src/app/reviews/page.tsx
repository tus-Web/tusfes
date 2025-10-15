"use client";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import Image from "next/image"; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

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