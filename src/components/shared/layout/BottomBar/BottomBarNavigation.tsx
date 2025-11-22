'use client';

import { useRouter } from 'next/navigation';
import BottomBar from './BottomBar';

type BottomBarTab = 'home' | 'map' | 'personal';

const tabToPath: Record<BottomBarTab, string> = {
  home: '/home',
  map: '/map',
  personal: '/personal',
};

interface BottomBarNavigationProps {
  activeTab: BottomBarTab;
}

const isBottomBarTab = (tab: string): tab is BottomBarTab =>
  tab === 'home' || tab === 'map' || tab === 'personal';

export default function BottomBarNavigation({ activeTab }: BottomBarNavigationProps) {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    if (isBottomBarTab(tab)) {
      router.push(tabToPath[tab]);
    }
  };

  return <BottomBar activeTab={activeTab} onTabChange={handleTabChange} />;
}
