import { getAllExperimentSlugs } from '@app/lib/utils';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { Suspense, useEffect, useState } from 'react';

import Fallback from '@components/Fallback';

import styles from '@styles/Experiment.module.scss';

type Module<P> = {
  default: P;
};

type Component = {
  default: React.FC;
};
export default function Experiment({
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [Component, setComponent] = useState<Module<Component>>();
  const [slugNumber, setSlugNumber] = useState('');
  useEffect(() => {
    import(`/experiments/${slug}`).then((Comp) => {
      setComponent(Comp && <Comp.default />);
    });
    setSlugNumber(slug[0]);
  }, [slug]);

  return (
    <Suspense fallback={<Fallback />}>
      <Head>
        <title>SantiLab | Experiment #{slugNumber}</title>
      </Head>
      <Link className={styles.goBack} href={'/'}>
        Home
      </Link>
      {Component as React.ReactNode}
    </Suspense>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const allSlugs = await getAllExperimentSlugs();

  const paths = allSlugs.map((exp) => {
    return {
      params: {
        slug: exp,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  return {
    props: {
      slug: (params as ParsedUrlQuery).slug,
    },
  };
};
