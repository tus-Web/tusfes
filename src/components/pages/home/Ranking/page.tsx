import styles from './page.module.css';
import { FaStar } from "react-icons/fa";


interface RankingProps{
    display_id :number;
    average :number;
    count: number;
    index : number;
}

export default function Ranking({ index, average, count }: RankingProps) {
    return (
            <div className={styles.rank_header}>
                <div className={styles.rank}>{index + 1}位</div>
                <div className={styles.ratingInfo}>
                    <div className={styles.average}><FaStar />{average.toFixed(2)}</div>
                    <div className={styles.count}>{count}件</div>
                </div>
            </div>
    );
}
