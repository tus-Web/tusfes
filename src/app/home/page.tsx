'use client';
import { useRouter } from 'next/navigation';
import BottomBar from "@/src/components/shared/layout/BottomBar/BottomBar";

export default function Home() {
    const router = useRouter();
    const onBottomBarPressed = (id: string) => {
        router.push(`/${id}`);
    };

    return(
    <div>
        <h1>Here is HomePage</h1>
        <BottomBar activeTab="home" onTabChange={onBottomBarPressed} />
    </div>
    );
}
