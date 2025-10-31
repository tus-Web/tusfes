"use client"

import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '@/styles/swiper.css';
import { Autoplay, Pagination } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import BottomBar from "@/components/shared/layout/BottomBar/BottomBar";
import styles from './page.module.css';

export default function Home() {
    const router = useRouter();
    const onBottomBarPressed = (id: string) => {
        router.push(`/${id}`);
    };

    return (
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
                <SwiperSlide><img src="/img/tmp_img1.jpg" alt="tmp_img1" /></SwiperSlide>
                <SwiperSlide><img src="/img/tmp_img2.jpg" alt="tmp_img2" /></SwiperSlide>
                <SwiperSlide><img src="/img/tmp_img3.jpg" alt="tmp_img3" /></SwiperSlide>
                <SwiperSlide><img src="/img/tmp_img4.jpg" alt="tmp_img4" /></SwiperSlide>
                <SwiperSlide><img src="/img/tmp_img5.jpg" alt="tmp_img5" /></SwiperSlide>
                <SwiperSlide><img src="/img/tmp_img6.jpg" alt="tmp_img6" /></SwiperSlide>
            </Swiper>
            
            <h1 className={styles.title}>Here is HomePage</h1>
            <BottomBar activeTab="home" onTabChange={onBottomBarPressed} />
        </>
    );
}
