import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import {
  Button,
  Flex,
  Grid,
  Link,
  Stack,
  Text,
  Heading,
  Box,
} from '@chakra-ui/react';
import { Image } from '../src/components/Image';
import { Product } from '../src/types';
import api from '../src/utils/api';
import parseCurrency from '../src/utils/parseCurrency';

interface Props {
  products: Product[];
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.getProducts();

  return {
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default function Home({ products }: Props) {
  const [cart, setCart] = React.useState<Product[]>([]);
  const text = React.useMemo(
    () =>
      cart
        .reduce(
          (message, product) =>
            message.concat(
              `* ${product.title} - ${parseCurrency(product.price)}\n`
            ),
          ``
        )
        .concat(
          `\nTotal: ${parseCurrency(
            cart.reduce((total, product) => total + product.price, 0)
          )}`
        ),
    [cart]
  );
  return (
    <>
      <Head>
        <title>La Cocina de Turitto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6}>
          {Boolean(products.length) &&
            products.map((product) => (
              <Stack
                key={product.id}
                spacing={3}
                borderRadius="3xl"
                backgroundColor="whiteAlpha.900"
              >
                <Image
                  borderRadius="3xl"
                  src={product.image}
                  alt={product.title}
                  dimensions={[400, 300]}
                  objectFit="cover"
                />

                <Stack padding={5}>
                  <Heading size="md">{product.title}</Heading>
                  <Text>{product.description}</Text>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Heading size="md" as="span" flexBasis={1}>
                      {parseCurrency(product.price)}
                    </Heading>
                    <Button
                      colorScheme="red"
                      borderRadius="full"
                      onClick={() => setCart((cart) => cart.concat(product))}
                    >
                      +
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            ))}
        </Grid>

        {Boolean(cart.length) && (
          <Flex
            alignItems="center"
            bottom={4}
            justifyContent="center"
            position="sticky"
          >
            <Button
              isExternal
              as={Link}
              colorScheme="whatsapp"
              href={`https://wa.me/584166868029?text=${encodeURIComponent(
                text
              )}`}
              width="fit-content"
            >
              Completar pedido ({cart.length} productos)
            </Button>
          </Flex>
        )}
      </main>
    </>
  );
}
