import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import CategoryResultsList from '@/components/pages/categories/CategoryResultsList';
import { categoryConfigBySlug, categorySlugs } from '@/constants/categoryPages';
import { getEventsByCategory } from '@/lib/events';

export function generateStaticParams() {
  return categorySlugs.map((slug) => ({ slug }));
}

type CategoryPageProps = PageProps<'/categories/[slug]'>;

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categoryConfigBySlug[slug];

  if (!category) {
    notFound();
  }

  const events = getEventsByCategory(category.type);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.breadcrumb}>
          <Link href="/categories" className={styles.breadcrumbLink}>
            カテゴリ一覧
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>{category.title}</span>
        </p>
        <h1 className={styles.title}>{category.title}</h1>
        <p className={styles.description}>{category.description}</p>
        <p className={styles.count}>
          {events.length}件の企画が見つかりました
        </p>
      </header>

      {events.length > 0 ? (
        <div className={styles.list}>
          <CategoryResultsList events={events} />
        </div>
      ) : (
        <div className={styles.empty}>
          <p>該当する企画が見つかりませんでした。</p>
          <p>
            <Link href="/search" className={styles.link}>
              詳細検索
            </Link>
            で条件を変えて探してみてください。
          </p>
        </div>
      )}
    </div>
  );
}
