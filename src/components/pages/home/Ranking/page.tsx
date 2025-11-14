import styles from './page.module.css';
import { FaStar } from "react-icons/fa";


interface RankingProps{
    display_id :number;
    average :number;
    index : number;
}

export default function Ranking({ index, average }: RankingProps) {
    return (
            <div className={styles.rank_header}>
                <div className={styles.rank}>{index + 1}位</div>
                <div className={styles.average}><FaStar />{average.toFixed(2)}</div>
            </div>
    );
}
