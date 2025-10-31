"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchAllReviews } from "@/lib/reviews";
import { displays } from "@/lib/constants";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchAllReviews();
      setReviews(data);
    };
    loadReviews();
  }, []);
  
  return (
    <main>
      <h1>レビューページ</h1>
      <ul>
        {Object.values(displays).map((display) => (
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