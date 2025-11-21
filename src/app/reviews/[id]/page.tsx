"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Rating } from "@mui/material";
import { supabase } from "@/src/lib/supabase/client";
import { useAuth } from "@/components/shared/providers/AuthProvider/AuthProvider";
import { getEventById } from "@/lib/events";

type Review = {
  id: number;
  display_id: number;
  user_id?: number;
  rating: number;
  comment: string;
};

type ReviewSummary = {
  average: number;
  count: number;
};

const calculateSummary = (reviewList: Review[]): ReviewSummary => {
  if (reviewList.length === 0) return { average: 0, count: 0 };

  const total = reviewList.reduce((sum, review) => sum + review.rating, 0);
  return {
    average: total / reviewList.length,
    count: reviewList.length,
  };
};

export default function ReviewPage() {
  const { user } = useAuth();
  const params = useParams();
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [summary, setSummary] = useState<ReviewSummary>({ average: 0, count: 0 });

  const displayId = Array.isArray(params.id) ? params.id[0] : params.id;
  const display = displayId ? getEventById(displayId) : undefined;
  const displayIdNumber = displayId ? Number(displayId) : null;

  useEffect(() => {
    const fetchReviews = async () => {
      if (!displayIdNumber) return;

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("display_id", displayIdNumber);

      if (!error && data) {
        setReviews(data as Review[]);
        setSummary(calculateSummary(data as Review[]));
      } else {
        setReviews([]);
        setSummary({ average: 0, count: 0 });
      }
    };

    fetchReviews();
  }, [displayIdNumber]);

  if (!display) {
    return (
      <div>
        <p>該当するものが見つかりませんでした。</p>
        <Link href="/">戻る</Link>
      </div>
    );
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  const checkReviewLength = (text: string) => {
    if (text.length === 0) {
      alert("ちゃんとレビューを書いてね😢");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("ユーザー認証に失敗しました。ページをリロードしてください。");
      return;
    }

    try {
      if (!checkReviewLength(reviewText) || !displayIdNumber) return;

      const { error } = await supabase.from("reviews").insert([
        {
          comment: reviewText,
          display_id: displayIdNumber,
          rating: rating,
          user_id: user.id, // 認証済みユーザーIDを使用
        },
      ]);
      if (error) {
        throw error;
      }

      const { data: newReviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("display_id", displayIdNumber);

      const updatedReviews = (newReviews as Review[]) || [];
      setReviews(updatedReviews);
      setSummary(calculateSummary(updatedReviews));

      alert("レビューを送信しました！");
      setReviewText("");
      setRating(5);
    } catch (error) {
      console.error("レビュー投稿エラー:", error);
      alert("投稿失敗");
    }
  };
  return (
    <div>
      <h1>レビュー</h1>
      <h2>{display.name}</h2>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Rating value={summary.average} precision={0.1} readOnly />
          <span>
            平均★{summary.count ? summary.average.toFixed(2) : "-"}（
            {summary.count}件）
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>評価 {rating}</h2>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={rating}
          onChange={(e) => setRating(parseFloat(e.target.value))}
        />

        <textarea
          value={reviewText}
          onChange={handleTextChange}
          placeholder="レビューを入力してください"
        />
        <button type="submit">レビューを投稿</button>
      </form>

      <h2>レビュー一覧</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            {review.comment} (評価:{review.rating})
          </li>
        ))}
      </ul>
      <Link href="/">戻る</Link>
    </div>
  );
}
