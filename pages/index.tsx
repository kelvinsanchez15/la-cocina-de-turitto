import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Product } from '../src/types';
import api from '../src/utils/api';

interface Props {
  products: Product[];
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.getProducts();
  console.log(products);
  return {
    props: {
      products,
    },
  };
};

export default function Home({ products }: Props) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Basic Boilerplate</h1>
        <ul>
          {Boolean(products.length) &&
            products.map((product) => (
              <li key={product.id}>{product.title}</li>
            ))}
        </ul>
      </main>
    </>
  );
}
