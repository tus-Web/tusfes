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

// "use client";

// // 理科大工学部サークル検索（モバイル優先 UI）
// // - 画面上部: タグ（チップ）で分類。タップでマップ/リストが絞り込み。
// // - USJアプリ上部の「◯◯におすすめ」UIの形を参考に、横スクロールのタグ群。
// // - ul/li + display:flex を徹底使用。シンプルな Tailwind クラスのみで完結。
// // - Filter ボタンでフィルタシート（簡易モーダル）を開閉。
// // - 擬似マップ: 学内マップ風の矩形エリアにクラブの座標を相対配置（0–100%）。
// // - データはデモ。実データに差し替え可（DB/API 連携を想定）。

// import { useMemo, useState } from "react";

// // ---- デモデータ型定義 ----
// type Club = {
//   id: string;
//   name: string;
//   tags: string[]; // カテゴリタグ（文化系/体育会/初心者歓迎/…）
//   target: ("新入生" | "学部生" | "院生" | "誰でも");
//   description: string;
//   meet: ("平日" | "土日" | "朝" | "夕方" | "夜")[];
//   coords: { x: number; y: number }; // 擬似マップの相対座標（%）
// };

// // ---- タグ候補（上部チップに出す） ----
// const TAGS = [
//   "すべて",
//   "初心者歓迎",
//   "文化系",
//   "体育会",
//   "ものづくり",
//   "音楽",
//   "ボランティア",
//   "競技プログラミング",
//   "自転車",
//   "国際交流",
// ] as const;

// // ---- デモクラブ一覧 ----
// const CLUBS: Club[] = [
//   {
//     id: "itc",
//     name: "情報技術クラブ",
//     tags: ["ものづくり", "競技プログラミング", "初心者歓迎"],
//     target: "誰でも",
//     description:
//       "Web/アプリ制作、AtCoder入門、ハッカソン参加など幅広く活動。初心者向け勉強会あり。",
//     meet: ["平日", "夕方"],
//     coords: { x: 22, y: 38 },
//   },
//   {
//     id: "roadbike",
//     name: "ロードバイクサークル",
//     tags: ["体育会", "自転車", "初心者歓迎"],
//     target: "学部生",
//     description:
//       "週末に江戸川やしまなみ海道合宿など。整備講習で初めてでも安心。",
//     meet: ["土日", "朝"],
//     coords: { x: 62, y: 44 },
//   },
//   {
//     id: "music",
//     name: "軽音楽部",
//     tags: ["音楽", "文化系"],
//     target: "誰でも",
//     description:
//       "学内ライブや学祭ステージ。バンド未経験でも大歓迎、パート別に練習可。",
//     meet: ["平日", "夜"],
//     coords: { x: 48, y: 72 },
//   },
//   {
//     id: "astronomy",
//     name: "天文研究会",
//     tags: ["文化系", "初心者歓迎"],
//     target: "新入生",
//     description:
//       "観望会や撮影会、プラネタリウム見学。理科ならではの機材講習あり。",
//     meet: ["土日", "夜"],
//     coords: { x: 75, y: 30 },
//   },
//   {
//     id: "sado",
//     name: "茶道研究会",
//     tags: ["文化系", "国際交流"],
//     target: "誰でも",
//     description:
//       "和文化体験を英語解説付きで実施する日も。留学生交流イベントあり。",
//     meet: ["平日", "夕方"],
//     coords: { x: 30, y: 60 },
//   },
//   {
//     id: "esports",
//     name: "eスポーツ同好会",
//     tags: ["文化系", "初心者歓迎"],
//     target: "学部生",
//     description:
//       "FPS/MOBA/格ゲーなどタイトル別コミュニティ。学内大会を定期開催。",
//     meet: ["平日", "夜"],
//     coords: { x: 15, y: 20 },
//   },
//   {
//     id: "volunteer",
//     name: "ボランティアサークル",
//     tags: ["ボランティア", "国際交流", "初心者歓迎"],
//     target: "誰でも",
//     description:
//       "地域清掃、子ども向け科学ワークショップの運営、留学生サポートなど。",
//     meet: ["土日", "朝"],
//     coords: { x: 84, y: 58 },
//   },
// ];

// // ---- アイコン（インライン SVG） ----
// function FilterIcon({ className = "w-5 h-5" }: { className?: string }) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden
//     >
//       <path d="M22 3H2l8 9v7l4 2v-9l8-9Z" />
//     </svg>
//   );
// }

// function XIcon({ className = "w-5 h-5" }: { className?: string }) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden
//     >
//       <path d="M18 6 6 18M6 6l12 12" />
//     </svg>
//   );
// }

// export default function Search() {
//   const [query, setQuery] = useState("");
//   const [selectedTags, setSelectedTags] = useState<string[]>(["すべて"]);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [meetFilter, setMeetFilter] = useState<Club["meet"][number][]>([]);

//   const toggleTag = (tag: string) => {
//     if (tag === "すべて") {
//       setSelectedTags(["すべて"]);
//       return;
//     }
//     const next = selectedTags.includes(tag)
//       ? selectedTags.filter((t) => t !== tag)
//       : [...selectedTags.filter((t) => t !== "すべて"), tag];
//     setSelectedTags(next.length ? next : ["すべて"]);
//   };

//   const clearAll = () => {
//     setSelectedTags(["すべて"]);
//     setQuery("");
//     setMeetFilter([]);
//   };

//   const filtered = useMemo(() => {
//     return CLUBS.filter((c) => {
//       // テキスト検索
//       const q = query.trim().toLowerCase();
//       const matchText = !q
//         ? true
//         : [c.name, c.description, c.tags.join(" "), c.target]
//             .join(" ")
//             .toLowerCase()
//             .includes(q);

//       // タグ（すべて は無条件）
//       const matchTags =
//         selectedTags.includes("すべて") ||
//         selectedTags.every((t) => c.tags.includes(t));

//       // 詳細フィルタ（曜日・時間帯）
//       const matchMeet =
//         meetFilter.length === 0 || meetFilter.every((m) => c.meet.includes(m));

//       return matchText && matchTags && matchMeet;
//     });
//   }, [query, selectedTags, meetFilter]);

//   return (
//     <div className="mx-auto max-w-screen-sm p-3 pb-28 font-sans">
//       {/* ヘッダー */}
//       <header className="sticky top-0 z-30 -mx-3 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//         <div className="px-3 pt-3 flex items-center justify-between gap-2">
//           <h1 className="text-xl font-bold">サークル検索</h1>
//           <button
//             onClick={() => setFilterOpen(true)}
//             className="inline-flex items-center gap-1 rounded-2xl border px-3 py-1.5 text-sm shadow-sm active:scale-[0.98]"
//             aria-label="フィルタを開く"
//           >
//             <FilterIcon />
//             フィルタ
//           </button>
//         </div>

//         {/* 検索ボックス */}
//         <div className="px-3 py-2">
//           <label className="sr-only" htmlFor="q">
//             キーワード検索
//           </label>
//           <input
//             id="q"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="キーワードで検索（例: プログラミング / 自転車）"
//             className="w-full rounded-2xl border px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* タグバー（横スクロール ul/li + flex） */}
//         <nav className="px-1 pb-2">
//           {/* ul + display:flex */}
//           <ul
//             className="flex items-center gap-2 overflow-x-auto px-2 py-1 [scrollbar-width:none] [-ms-overflow-style:none]"
//             style={{ WebkitOverflowScrolling: "touch" }}
//           >
//             {/* スクロールバー非表示（iOS/Chrome） */}
//             <style>{`
//               ul::-webkit-scrollbar{ display:none; }
//             `}</style>
//             {TAGS.map((tag) => {
//               const active = selectedTags.includes(tag as string);
//               return (
//                 <li key={tag} className="shrink-0">
//                   <button
//                     onClick={() => toggleTag(tag as string)}
//                     className={
//                       "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm shadow-sm transition " +
//                       (active
//                         ? "border-blue-500 bg-blue-50 text-blue-700"
//                         : "bg-white hover:bg-slate-50")
//                     }
//                     aria-pressed={active}
//                   >
//                     {tag}
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </header>

//       {/* 擬似マップ（上部） */}
//       <section className="mt-3">
//         <h2 className="mb-2 text-sm font-semibold text-slate-700">マップ（デモ）</h2>
//         <div
//           className="relative h-72 w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 to-slate-100"
//           aria-label="学内マップ（デモ）"
//         >
//           {/* マップのグリッド装飾 */}
//           <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px]"></div>

//           {/* マーカー */}
//           {filtered.map((c) => (
//             <button
//               key={c.id}
//               title={c.name}
//               className="group absolute -translate-x-1/2 -translate-y-1/2"
//               style={{ left: `${c.coords.x}%`, top: `${c.coords.y}%` }}
//               aria-label={`${c.name} の位置`}
//             >
//               <span className="block h-4 w-4 rounded-full border-2 border-white shadow ring-2 ring-blue-500 group-hover:scale-110 transition" />
//               <span className="mt-1 block max-w-[40vw] truncate rounded bg-white/90 px-2 py-0.5 text-xs shadow">
//                 {c.name}
//               </span>
//             </button>
//           ))}

//           {/* 絞り込みゼロ時の表示 */}
//           {filtered.length === 0 && (
//             <div className="absolute inset-0 grid place-items-center text-sm text-slate-500">
//               条件に合うサークルがありません
//             </div>
//           )}
//         </div>
//       </section>

//       {/* リスト（下部） */}
//       <section className="mt-5">
//         <h2 className="mb-2 text-sm font-semibold text-slate-700">サークル一覧</h2>
//         {/* ul + display:flex（縦方向スタックだが flex を使用） */}
//         <ul className="flex flex-col gap-3">
//           {filtered.map((c) => (
//             <li key={c.id} className="list-none">
//               <article className="rounded-2xl border p-3 shadow-sm">
//                 <header className="mb-1 flex items-center justify-between gap-2">
//                   <h3 className="text-base font-bold">{c.name}</h3>
//                   <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
//                     対象: {c.target}
//                   </span>
//                 </header>
//                 <p className="text-sm text-slate-700">{c.description}</p>
//                 <div className="mt-2 flex flex-wrap items-center gap-1.5">
//                   {c.tags.map((t) => (
//                     <span
//                       key={t}
//                       className="rounded-full border bg-white px-2 py-0.5 text-xs text-slate-700"
//                     >
//                       #{t}
//                     </span>
//                   ))}
//                   <span className="ml-auto text-xs text-slate-500">
//                     活動: {c.meet.join(" / ")}
//                   </span>
//                 </div>
//               </article>
//             </li>
//           ))}
//           {filtered.length === 0 && (
//             <li className="list-none rounded-2xl border p-4 text-center text-sm text-slate-500">
//               条件に合うサークルがありません
//             </li>
//           )}
//         </ul>
//       </section>

//       {/* フッタ操作列 */}
//       <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-screen-sm border-t bg-white p-2">
//         <div className="flex items-center gap-2">
//           <button
//             onClick={clearAll}
//             className="flex-1 rounded-2xl border px-4 py-2 text-sm active:scale-[0.98]"
//           >
//             クリア
//           </button>
//           <div className="text-xs text-slate-600">
//             表示: <strong>{filtered.length}</strong> / {CLUBS.length}
//           </div>
//         </div>
//       </footer>

//       {/* フィルタシート（簡易モーダル） */}
//       {filterOpen && (
//         <div
//           className="fixed inset-0 z-40 grid place-items-end bg-black/30 p-0"
//           role="dialog"
//           aria-modal="true"
//           onClick={() => setFilterOpen(false)}
//         >
//           <div
//             className="w-full max-w-screen-sm rounded-t-3xl bg-white p-4 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="mb-3 flex items-center justify-between">
//               <h3 className="text-base font-semibold">詳細フィルタ</h3>
//               <button
//                 onClick={() => setFilterOpen(false)}
//                 aria-label="閉じる"
//                 className="rounded-full p-1 hover:bg-slate-100"
//               >
//                 <XIcon />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <fieldset>
//                 <legend className="mb-2 text-sm font-medium">活動日/時間帯</legend>
//                 {/* ul + li + display:flex */}
//                 <ul className="flex flex-wrap gap-2">
//                   {["平日", "土日", "朝", "夕方", "夜"].map((m) => {
//                     const active = meetFilter.includes(m as any);
//                     return (
//                       <li key={m} className="list-none">
//                         <button
//                           onClick={() =>
//                             setMeetFilter((prev) =>
//                               prev.includes(m as any)
//                                 ? prev.filter((x) => x !== (m as any))
//                                 : [...prev, m as any]
//                             )
//                           }
//                           className={
//                             "rounded-full border px-3 py-1.5 text-sm shadow-sm " +
//                             (active
//                               ? "border-blue-500 bg-blue-50 text-blue-700"
//                               : "bg-white")
//                           }
//                           aria-pressed={active}
//                         >
//                           {m}
//                         </button>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </fieldset>

//               <div className="flex items-center justify-end gap-2 pt-2">
//                 <button
//                   onClick={() => {
//                     setMeetFilter([]);
//                   }}
//                   className="rounded-2xl border px-4 py-2 text-sm"
//                 >
//                   リセット
//                 </button>
//                 <button
//                   onClick={() => setFilterOpen(false)}
//                   className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm active:scale-[0.98]"
//                 >
//                   閉じる
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
