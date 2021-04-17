import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import {
  Button,
  Flex,
  Grid,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Avatar,
} from '@chakra-ui/react';
import { ProductWithCount } from '../src/types';
import api from '../src/utils/api';
import parseCurrency from '../src/utils/parseCurrency';
import ProductCard from '../src/components/ProductCard';

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

  const uniqueProductByCategory = Array.from(
    new Set(products.map((a) => a.category))
  ).map((category) => {
    return products.find((a) => a.category === category);
  });

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
        <Tabs isFitted variant="solid-rounded" colorScheme="red">
          <TabList mb="1em" px={4} py={2} overflowX="auto">
            <Tab>Todo</Tab>
            {Boolean(uniqueProductByCategory.length) &&
              uniqueProductByCategory.map((uniqueProduct) => (
                <Tab key={uniqueProduct?.category}>
                  <Avatar
                    size="sm"
                    name="Dan Abrahmov"
                    src={uniqueProduct?.image}
                    mr={4}
                  />
                  {uniqueProduct?.category}
                </Tab>
              ))}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid
                templateColumns="repeat(auto-fill, minmax(240px, 1fr))"
                gap={6}
              >
                {Boolean(products.length) &&
                  cart.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      handleIncreaseProductQuantity={
                        handleIncreaseProductQuantity
                      }
                      handleDecreaseProductQuantity={
                        handleDecreaseProductQuantity
                      }
                    />
                  ))}
              </Grid>
            </TabPanel>
            {Boolean(products.length) &&
              uniqueProductByCategory.map((uniqueProduct) => (
                <TabPanel key={uniqueProduct?.category}>
                  <Grid
                    templateColumns="repeat(auto-fill, minmax(240px, 1fr))"
                    gap={6}
                  >
                    {cart.map(
                      (product) =>
                        product.category === uniqueProduct?.category && (
                          <ProductCard
                            key={product.id}
                            product={product}
                            handleIncreaseProductQuantity={
                              handleIncreaseProductQuantity
                            }
                            handleDecreaseProductQuantity={
                              handleDecreaseProductQuantity
                            }
                          />
                        )
                    )}
                  </Grid>
                </TabPanel>
              ))}
          </TabPanels>
        </Tabs>

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
