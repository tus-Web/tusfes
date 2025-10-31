"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useState, useParams, useEffect } from "react";
import { fetchReviewsByDisplayId, submitReview, Review } from "@/lib/reviews";
import { displays } from "@/lib/constants";

export default function ReviewPage() {
  const params = useParams();
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);

  const displayId = Array.isArray(params.id) ? params.id[0] : params.id;
  const display = displays[Number(displayId) as keyof typeof displays];

  useEffect(() => {
    if (!display?.id) return;
    
    const loadReviews = async () => {
      const data = await fetchReviewsByDisplayId(display.id);
      setReviews(data);
    };
    loadReviews();
  }, [display?.id]);

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

  const checkReviewLength = (reviewText: string) => {
    if (reviewText.length === 0) {
      alert('ちゃんとレビューを書いてね😢');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!checkReviewLength(reviewText)) {
        return;
      }

      const result = await submitReview({
        comment: reviewText,
        display_id: display.id,
        rating: rating,
      });

      if (!result.success) {
        throw result.error;
      }

      alert('レビューを送信しました！');
      setReviewText('');

      const newReviews = await fetchReviewsByDisplayId(display.id);
      setReviews(newReviews);
    } catch (error) {
      alert("投稿失敗");
    }
  };

  return (
    <div>
      <h1>レビュー</h1>
      <h2>{display.name}</h2>

      <form onSubmit={handleSubmit}>
        <h2>評価{rating}</h2>
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
        <button type="submit">
          レビューを投稿
        </button>
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
