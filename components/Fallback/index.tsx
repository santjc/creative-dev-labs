import styles from './Fallback.module.scss';

export default function Fallback() {
  return (
    <main className={styles.main}>
      <h1>Loading...</h1>
    </main>
  );
}
