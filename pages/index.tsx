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

interface ProductWithCount extends Product {
  quantity: number;
}

interface Props {
  products: ProductWithCount[];
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
  const initialState = products.map((product) => {
    return { ...product, quantity: 0 };
  });
  const [cart, setCart] = React.useState<ProductWithCount[]>(initialState);

  const handleIncreaseProductQuantity = (id: string) => {
    let updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  const handleDecreaseProductQuantity = (id: string) => {
    let updatedCart = cart.map((item) => {
      if (item.id === id) {
        if (item.quantity == 0) return item;
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const filteredCart = React.useMemo(
    () => cart.filter((product) => product.quantity > 0),
    cart
  );

  const text = React.useMemo(() => {
    return filteredCart
      .reduce(
        (message, product) =>
          message.concat(
            `* (${product.quantity}) ${product.title} - ${parseCurrency(
              product.price
            )}\n`
          ),
        ``
      )
      .concat(
        `\nTotal: ${parseCurrency(
          filteredCart.reduce(
            (total, product) => total + product.price * product.quantity,
            0
          )
        )}`
      );
  }, [filteredCart]);

  return (
    <>
      <Head>
        <title>La Cocina de Turitto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6}>
          {Boolean(products.length) &&
            cart.map((product) => (
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
                      onClick={() => handleDecreaseProductQuantity(product.id)}
                    >
                      -
                    </Button>
                    <Text>{product.quantity}</Text>
                    <Button
                      colorScheme="red"
                      borderRadius="full"
                      onClick={() => handleIncreaseProductQuantity(product.id)}
                    >
                      +
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            ))}
        </Grid>

        {Boolean(filteredCart.length) && (
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
              Completar pedido ({filteredCart.length} productos)
            </Button>
          </Flex>
        )}
      </main>
    </>
  );
}
