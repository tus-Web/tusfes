"use client"

import React, { useRef, useState} from "react";
import { Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Home.module.css';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import BottomBar from "@/src/components/shared/layout/BottomBar/BottomBar";
import { vw } from "framer-motion";

export default function Home() {
    const router = useRouter();
    const onBottomBarPressed = (id: string) => {
        router.push(`/${id}`);
    };

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
    </>
    );
}
