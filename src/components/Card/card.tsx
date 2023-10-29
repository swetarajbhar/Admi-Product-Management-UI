import styles from './Card.module.scss';

interface CardProps {
  title: string;
  value: number | string;
  remaining?: number;
  description?: string;
}
const Card = ({ title, value, remaining, description }: CardProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.center}>
        <div className={styles.text}>
          <b>{value}</b>
        </div>
      </div>
    </div>
  );
};

export default Card;
