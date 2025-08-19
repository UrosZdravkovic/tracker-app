import styles from "./SummaryCards.module.css";

type CardProps = {
    title: string;
    value: string;
};

export default function Card({title, value}: CardProps) {

    return (
        <div className={styles.card}>
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.value}>{value}</p>
        </div>
    );
}
