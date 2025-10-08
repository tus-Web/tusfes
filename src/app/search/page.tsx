// ul Tag, tagを押すとタブが出てくる
// targetを作って tagを増やして familyかstudentをデータベースで作ってマップの上のほうに表示
// filterを押すとfilter画面になる
// ulタグにボタンを作ってボタンを押したらstudentを押したら
// ulタグにliを入れてdisplayflexでやってる
// スマホ用のサイズで書く
// USJのスマホアプリでの，地図検索の上の部分にある，子供にお勧め，家族にお勧め,...などの形を作る
// 画面上部に，タグで分類したやつのタグを表示して，それをタップするとマップに表示されている建物の表示が絞られるようにする
// このpage.tsxの内部にhtmlを書いていって検索機能という名のクラス分け，すなわち分類を作っていって，理科大工学部のいろんなサークルの紹介をするためのhtml，cssを書く
import React from 'react';
import styles from './page.module.css'
import Link from 'next/link'

export default function Search() {
    return (
        <>
        <div className={styles.box1}>
            <div>展示</div>
            <Link href="/filter">フィルター</Link>
            <Link href="search/detail">検索</Link>
        </div>
        <div className={styles.box2}>
            <div className={styles.subbox}>展示</div>
            <Link className={styles.subbox} href="/filter">フィルター</Link>
            <Link className={styles.subbox} href="/filter">検索</Link>
        </div>
        </>
    )
}