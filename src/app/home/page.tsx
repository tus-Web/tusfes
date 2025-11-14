"use client"

import React, { useRef, useState} from "react";
import { Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';
import styles from './styles.css';
import ExhibitionCard from "@/src/components/shared/ExhibitionCard/page";
import Ranking from "@/src/components/pages/home/Ranking/page";


import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import BottomBar from "@/src/components/shared/layout/BottomBar/BottomBar";
import { useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { getEventById } from "@/lib/events";

import { CiStar } from "react-icons/ci";

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

interface FavoriteItem {
  id: string;
  name: string;
  location: string;
  schedule: string;
  tags: string[];
  description: string;
  organizer: string;
  type: '展示' | 'フード' | 'イベント' | 'アメニティ';
  imageUrl?: string;
}


const dummyData: FavoriteItem[] = [
  {
    id: '1',
    name: '伝統工芸展示',
    location: '展示ホールA',
    schedule: '10:00-12:00',
    tags: ['伝統', '工芸', '文化'],
    description: '日本の伝統工芸品を展示する特別企画。職人たちの技を間近で感じることができます。',
    organizer: '文化振興協会',
    type: '展示',
    imageUrl: '/img/tmp_img1.jpg'
  },
  {
    id: '2',
    name: '地元グルメフェスティバル',
    location: 'フードコート',
    schedule: '11:00-15:00',
    tags: ['グルメ', '地元', 'フェスティバル'],
    description: '地元の美味しい食べ物を集めたフェスティバル。様々な味覚を楽しめます。',
    organizer: '地元商工会',
    type: 'フード',
    imageUrl: '/img/tmp_img2.jpg'
  },
  {
    id: '3',
    name: '音楽ライブイベント',
    location: 'メインステージ',
    schedule: '18:00-21:00',
    tags: ['音楽', 'ライブ', 'エンターテイメント'],
    description: '人気アーティストによるライブパフォーマンス。忘れられない夜を過ごせます。',
    organizer: 'イベント企画会社',
    type: 'イベント',
    imageUrl: '/img/tmp_img3.jpg'
  },
  {
    id: '4',
    name: 'リラクゼーションコーナー',
    location: 'ウェルネスエリア',
    schedule: '09:00-17:00',
    tags: ['リラクゼーション', 'ウェルネス', '健康'],
    description: 'マッサージやヨガなど、心と体のリフレッシュができるスペースです。',
    organizer: 'ウェルネスセンター',
    type: 'アメニティ',
    imageUrl: '/img/tmp_img4.jpg'
  },
  {
    id: '5',
    name: '写真コンテスト展示',
    location: 'ギャラリーB',
    schedule: '13:00-16:00',
    tags: ['写真', 'コンテスト', 'アート'],
    description: '一般公募の写真作品を展示。素晴らしい作品が揃っています。',
    organizer: '写真協会',
    type: '展示',
    imageUrl: '/img/tmp_img5.jpg'
  },
  {
    id: '6',
    name: 'ワークショップ体験',
    location: 'ワークショップルーム',
    schedule: '14:00-16:00',
    tags: ['ワークショップ', '体験', '学び'],
    description: '手作り体験ができるワークショップ。子供から大人まで楽しめます。',
    organizer: '教育センター',
    type: 'イベント'
  }
];

export default function Home() {
    const router = useRouter();
    const onBottomBarPressed = (id: string) => {
        router.push(`/${id}`);
    };

    const [rankedDisplays, setRankedDisplays] = useState<{display_id: number, average: number}[]>([]);

useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*');
            if (!error && data) {
                // 料理ごとに点数を集計（ratingカラムを使用）
                const scores: Record<string, number[]> = {};
                data.forEach((review: Review) => {
                    if (!scores[review.display_id]) scores[review.display_id] = [];
                    scores[review.display_id].push(review.rating);
                });
                // 点数の平均を計算
                const ranked = Object.entries(scores).map(([display_id, ratings]) => {
                    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                    return { display_id: parseInt(display_id), average };
                });
                // 点数の高い順にソート
                ranked.sort((a, b) => b.average - a.average);
                setRankedDisplays(ranked);
            }
        };
        fetchReviews();
    },[]);


    return(
    <>
        <Swiper
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            slidesPerView={1.2}
            breakpoints={{
                320: {
                  spaceBetween: 16 
                },
                768: {
                  spaceBetween: 24 
                },
                1024: {
                  spaceBetween: 38 
                }
            }}
            centeredSlides={true}
            pagination={{
                clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
        >
            <SwiperSlide><img src="/img\tmp_img1.jpg" alt="tmp_img1" /></SwiperSlide>
            <SwiperSlide><img src="/img\tmp_img2.jpg" alt="tmp_img2" /></SwiperSlide>
            <SwiperSlide><img src="/img\tmp_img3.jpg" alt="tmp_img3" /></SwiperSlide>
            <SwiperSlide><img src="/img\tmp_img4.jpg" alt="tmp_img4" /></SwiperSlide>
            <SwiperSlide><img src="/img\tmp_img5.jpg" alt="tmp_img5" /></SwiperSlide>
            <SwiperSlide><img src="/img\tmp_img6.jpg" alt="tmp_img6" /></SwiperSlide>
        </Swiper>
        
        <h1>Here is HomePage</h1>
        <BottomBar activeTab="home" onTabChange={onBottomBarPressed} />

        <main>
            <h1>人気ランキング</h1>

            <ol>
                {rankedDisplays.slice(0,5).map((display, idx) => {
                    const event = getEventById(display.display_id);
                    if (!event) {
                        return (
                            <li key={display.display_id}>
                                <span>イベント情報が見つかりません</span>（平均点: {display.average.toFixed(2)}）
                            </li>
                        );
                    }
                    return (
                        <div key={display.display_id} >
                        <Ranking {...display} index={idx}/>          
                        <ExhibitionCard {...(event as any)} />
                        </div>
                    );
                })}
            </ol>
        
        </main>

    </>
    );
}
