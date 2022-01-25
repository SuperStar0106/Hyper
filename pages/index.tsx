import type { NextPage } from 'next'
import Head from 'next/head'

import { Collection } from '../interface/collection'
import { collections } from '../lib/collections'

import Banner from '../components/banner'
import Grid from '../components/grid'

export async function getStaticProps() {
  return {
    props: {
      collections,
    },
  }
}

type Props = {
  collections: Array<Collection>
}

const Home: NextPage<Props> = ({ collections }) => {
  let meta = {
    title: 'Open Source Tailwind CSS Components | HyperUI',
    description:
      'HyperUI is a free, open source library of Tailwind CSS components.',
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta property="og:title" content={meta.title} />
        <meta name="description" content={meta.description}></meta>
        <meta property="og:description" content={meta.description} />
      </Head>

      <Banner
        title="HyperUI"
        subtitle="An Open Source Tailwind CSS Component Library"
      />

      <div className="max-w-screen-xl px-4 py-8 mx-auto" id="componentGrid">
        <Grid
          className="gap-4 sm:grid-cols-2 md:grid-cols-4"
          blocks={collections}
        />
      </div>
    </>
  )
}

export default Home
