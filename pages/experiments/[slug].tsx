import { getAllExperimentSlugs } from '@app/lib/utils';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { Suspense, useEffect, useState } from 'react';

import Fallback from '@components/Fallback';
import Layout from '@components/Layout';

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
  useEffect(() => {
    import(`/experiments/${slug}`).then((Comp) => {
      setComponent(Comp.default);
    });
  }, [slug]);

  return (
    <Layout>
      <>
        <Link className={styles.goBack} href={'/'}>
          Home
        </Link>
        <Suspense fallback={<Fallback />}>
          {Component as React.ReactNode}
        </Suspense>
      </>
    </Layout>
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
