"use client"

import React, { useRef, useState} from "react";
import { Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css'

import { Pagination } from "swiper/modules";

export default function Home() {
    return(
    <div>
        <h1>Here is HomePage</h1>
        <Swiper
            slidesPerView={1.2}
            spaceBetween={10}
            centeredSlides={true}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
        >
            <SwiperSlide>img 1 here</SwiperSlide>
            <SwiperSlide>img 2 here</SwiperSlide>
            <SwiperSlide>img 3 here</SwiperSlide>
            <SwiperSlide>img 4 here</SwiperSlide>
            <SwiperSlide>img 5 here</SwiperSlide>
            <SwiperSlide>img 6 here</SwiperSlide>
        </Swiper>
    </div>
    );
}