"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from '@/components/shared/providers/AuthProvider/AuthProvider';
import { fetchReviews } from '@/lib/reviews';
import { ReviewForm } from '@/components/shared/common/ReviewForm/ReviewForm';

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
    const [reviews, setReviews] = useState<Review[]>([]);

    const displayId = Array.isArray(params.id) ? params.id[0] : params.id;
    const display = displays[Number(displayId) as keyof typeof displays];

    const loadReviews = async () => {
        if (!display) return;
        const reviewsData = await fetchReviews(display.id);
        setReviews(reviewsData);
    };

    useEffect(() => {
        loadReviews();
    },[display?.id]);

    if(!display) {
        return <div>
            <p>該当するものが見つかりませんでした。</p>
            <Link href="/">戻る</Link>
        </div>;
    }

    if (!user) {
        return <div>
            <p>認証中...</p>
        </div>;
    }
return(
    <div>
        <h1>レビュー</h1>
        <h2>{display.name}</h2>

        <ReviewForm 
            displayId={display.id}
            userId={user.id}
            onSuccess={loadReviews}
        />

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
