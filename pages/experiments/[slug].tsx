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
  slugNumber,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [Component, setComponent] = useState<Module<Component>>();
  useEffect(() => {
    import(`/experiments/${slug}`).then((Comp) => {
      setComponent(Comp && <Comp.default />);
    });
  }, [slug]);

  return (
    <Layout title={`SantiLab | Experiment #${slugNumber}`} padding={false}>
      <Suspense fallback={<Fallback />}>
        <Link className={styles.goBack} href={'/'}>
          Home
        </Link>
        {Component as React.ReactNode}
      </Suspense>
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
  const slugNumber = params?.slug?.toString().split('.')[0] || '-';
  return {
    props: {
      slug: (params as ParsedUrlQuery).slug,
      slugNumber,
    },
  };
};
