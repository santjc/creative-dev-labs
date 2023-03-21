import Head from 'next/head';

import styles from './Layout.module.scss';

type Props = {
  children: React.ReactNode;
  title?: string;
  padding?: boolean;
};
export default function Layout({
  children,
  title = 'Next App',
  padding = true,
}: Props) {
  return (
    <>
      <Head>
        <title>Santi&apos;s Labs</title>
      </Head>
      <main
        style={{ padding: !padding ? '0px' : '48px 24px' }}
        className={styles.main}
      >
        <div className={styles.children}>{children}</div>
      </main>
    </>
  );
}
