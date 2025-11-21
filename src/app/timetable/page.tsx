'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomBar from '@/src/components/shared/layout/BottomBar/BottomBar';
import styles from './page.module.css';
import timetableData from './timetable.json';

type TimetableEvent = {
  title: string;
  location: string;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
};

type Stage = {
  id: string;
  name: string;
  events: TimetableEvent[];
};

type Day = {
  id: string;
  date: string;
  label: string; // "11月22日(土)" など
  stages: Stage[];
};

type TimetableJson = {
  days: Day[];
};

// JSON の型をざっくりキャスト
const data = timetableData as TimetableJson;

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function TimetablePage() {
  const router = useRouter();
  const [activeDayId, setActiveDayId] = useState<string>(data.days[0]?.id ?? '');
  const [activeStageId, setActiveStageId] = useState<string>(
    data.days[0]?.stages[0]?.id ?? '',
  );

  const activeDay = useMemo(
    () => data.days.find((d) => d.id === activeDayId),
    [activeDayId],
  );

  useEffect(() => {
    if (!activeDay) return;
    if (!activeDay.stages.some((stage) => stage.id === activeStageId)) {
      setActiveStageId(activeDay.stages[0]?.id ?? '');
    }
  }, [activeDay, activeStageId]);

  // 選択されたステージのイベントを開始時刻でソート
  const activeStage = useMemo(() => {
    if (!activeDay) return undefined;
    const stage = activeDay.stages.find((s) => s.id === activeStageId);
    if (!stage) return undefined;
    return {
      ...stage,
      events: [...stage.events].sort(
        (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start),
      ),
    };
  }, [activeDay, activeStageId]);

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
      <main className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>タイムテーブル</h1>

          {/* 日付トグルボタン */}
          <div className={styles.dayToggle}>
            {data.days.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setActiveDayId(day.id)}
                className={
                  day.id === activeDayId
                    ? `${styles.dayButton} ${styles.dayButtonActive}`
                    : styles.dayButton
                }
              >
                {day.label}
              </button>
            ))}
          </div>

          {activeDay ? (
            <>
              <p className={styles.dateText}>{activeDay.date}</p>

              <div className={styles.stageToggle}>
                {activeDay.stages.map((stage) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                    className={
                      stage.id === activeStageId
                        ? `${styles.stageButton} ${styles.stageButtonActive}`
                        : styles.stageButton
                    }
                  >
                    {stage.name}
                  </button>
                ))}
              </div>

              {/* ステージごとの縦タイムテーブル */}
              {activeStage ? (
                <div className={styles.stageGrid}>
                  <section key={activeStage.id} className={styles.stageColumn}>
                    <h2 className={styles.stageTitle}>{activeStage.name}</h2>
                    <ul className={styles.eventList}>
                      {activeStage.events.map((ev, idx) => (
                        <li key={`${ev.title}-${idx}`} className={styles.eventItem}>
                          <div className={styles.eventTime}>
                            {ev.start}〜{ev.end}
                          </div>
                          <div className={styles.eventMain}>
                            <div className={styles.eventTitle}>{ev.title}</div>
                            <div className={styles.eventLocation}>{ev.location}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              ) : (
                <p>このステージのタイムテーブルはまだ登録されていません。</p>
              )}

              <p className={styles.notice}>
                ※ 内容や時間は変更になる場合があります。当日掲示板や公式Xなどもあわせてご確認ください。
              </p>
            </>
          ) : (
            <p>この日のタイムテーブルはまだ登録されていません。</p>
          )}
        </div>
      </main>
    </>
  );
}
