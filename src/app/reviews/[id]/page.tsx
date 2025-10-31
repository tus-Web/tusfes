"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { supabase } from '@/src/lib/supabase/client';
import { useAuth } from '@/components/shared/providers/AuthProvider/AuthProvider';

type Review = {
    id: number;
    display_id: number;
    user_id: number;
    rating: number;
    comment: string;
}

const displays ={
    1: { id: 1, name: "Display1"},
    2: { id: 2, name: "Display2"},
    3: { id: 3, name: "Display3"}
}

export default function ReviewPage(){
    const { user } = useAuth();
    const params = useParams();
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);

    const displayId = Array.isArray(params.id) ? params.id[0] : params.id;
    const display = displays[Number(displayId) as keyof typeof displays];

    useEffect(() => {
        if(!displayId) return;
        
        const fetchReviews = async () => {
            const {data,error} = await supabase
            .from('reviews')
            .select('*')
            .eq('display_id',display.id);

            if(!error && data) {
                setReviews(data);
            }
        };
        fetchReviews();
    },[display?.id]);

    if(!display) {
        return <div>
            <p>該当するものが見つかりませんでした。</p>
            <Link href="/">戻る</Link>
        </div>;
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
    
    if (!user) {
      alert('ユーザー認証に失敗しました。ページをリロードしてください。');
      return;
    }

    try {
      if (!checkReviewLength(reviewText)) {
        return;
      }
    
      const {error} = await supabase
      .from('reviews')
      .insert([
        {
            comment: reviewText,
            display_id: display.id,
            rating: rating,
            user_id: user.id  // 認証済みユーザーIDを使用
        },
      ]);
        if (error) {
            throw error;
        }

        alert('レビューを送信しました！');
        setReviewText('');
        setRating(5);

        const {data: newReviews} = await supabase
        .from('reviews')
        .select('*')
        .eq('display_id', display.id);

        setReviews(newReviews || []);
    } catch (error) {
        console.error('レビュー投稿エラー:', error);
        alert("投稿失敗");
    }
};
return(
    <div>
        <h1>レビュー</h1>
        <h2>{display.name}</h2>

        <form onSubmit={handleSubmit}>
            <h2>評価{rating}</h2>
            <input type="range" min="0" max="5" step="1" value={rating} onChange= {(e) => setRating(parseFloat(e.target.value))}/>

                <textarea
                value={reviewText}
                onChange={handleTextChange}
                placeholder="レビューを入力してください"
            />
            <button type ="submit">
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
)


}
