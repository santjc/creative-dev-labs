import { getAllExperimentSlugs } from '@app/lib/utils';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';

import HyperLink from '@components/Icons/HyperLink';
import Layout from '@components/Layout';

import styles from '@styles/Home.module.scss';

export default function Home({
  experiments,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div className={styles.container}>
        <figure className={styles.logo}>
          <Image
            src="https://avatars.githubusercontent.com/u/43038138?v=4"
            alt="My Avatar"
            width={100}
            height={50}
          />
        </figure>
        <figure className={styles.welcome}>
          <p className={styles.welcomeText}>
            👋  Hi there.<br></br>
            You are on my lab, here I learn creating animations, 3D Visuals, and anything related to creative development.

          </p>
        </figure>
        <figure className={styles.experiments}>
          {experiments.map((exp: any) => {
            return (
              <a
                href={exp.href}
                key={exp.filename}
                className={styles.experiment}
              >
                <HyperLink className={styles.experimentIcon} />
                <p className={styles.experimentTitle}>{exp.title}</p>
              </a>
            );
          })}
        </figure>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allSlugs = await getAllExperimentSlugs();
  const modules = await Promise.all(
    allSlugs.map((slug) =>
      import(`/experiments/${slug}`).then((m) => [slug, m.default])
    )
  );
  let experiments = modules
    .map((exp) => {
      const title: string = exp[0].replace(/^\d+\./, '').replace(/\.tsx$/, '');

      return {
        filename: exp[0],
        title,
        href: `/experiments/${exp[0]}`,
      };
    })
    .sort((a, b) =>
      a.filename.localeCompare(b.filename, undefined, { numeric: true })
    );
  experiments = experiments.map((e, i) => ({
    ...e,
    number: i + 1,
  }));
  return {
    props: {
      experiments: experiments,
    },
  };
};
