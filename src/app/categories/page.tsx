"use client";

import Link from 'next/link';
import styles from './page.module.css';
import { CATEGORY_PAGE_CONFIGS } from '@/constants/categoryPages';
import { getEventsByCategory } from '@/lib/events';
import { useRouter } from 'next/navigation';
import BottomBar from '@/src/components/shared/layout/BottomBar/BottomBar';

export default function CategoriesPage() {
  const router = useRouter();
  const categoriesWithCount = CATEGORY_PAGE_CONFIGS.map((category) => ({
    ...category,
    count: getEventsByCategory(category.type).length,
  }));

  const onBottomBarPressed = (id: string) => {
    if (id === 'home') {
      router.push('/home');
    } else if (id === 'map') {
      router.push('/map');
    } else if (id === 'personal') {
      router.push('/personal');
    }
  };

  return (
    <>
      <BottomBar activeTab="home" onTabChange={onBottomBarPressed} />
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.subtitle}>カテゴリから探す</p>
          <h1 className={styles.title}>企画一覧</h1>
          <p className={styles.lead}>
            模擬店や展示、ステージ企画など、目的に合わせてイベントを探せます。
          </p>
        </header>

        <div className={styles.grid}>
          {categoriesWithCount.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardBadge}>{category.count}件</span>
                <h2 className={styles.cardTitle}>{category.title}</h2>
              </div>
              <p className={styles.cardDescription}>{category.description}</p>
              <span className={styles.cardLink}>一覧を見る →</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
