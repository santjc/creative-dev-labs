import Head from 'next/head';

import styles from './Layout.module.scss';

type Props = {
  children: React.ReactNode;
  title?: string;
};
export default function Layout({ children, title = 'Next App' }: Props) {
  return (
    <>
      <Head>
        <title>Santi&apos;s Labs</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.children}>{children}</div>
      </main>
    </>
  );
}
