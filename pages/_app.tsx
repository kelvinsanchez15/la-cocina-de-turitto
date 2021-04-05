import {
  ChakraProvider,
  Container,
  VStack,
  Heading,
  Text,
  Divider,
} from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { Image } from '../src/components/Image';
import theme from '../src/styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.lg" padding={4}>
        <VStack>
          <Image
            src="/logo.png"
            alt="Logo"
            borderRadius="full"
            dimensions={[128, 128]}
          />

          <Heading>La Cocina de Turitto</Heading>
          <Text textAlign="center">
            ❤️ Comida Italo-Venezolana ❤️ Panadería Artesanal ❤️ Postres ❤️
            Encurtidos ❤️ Variedades y mucho más
          </Text>
        </VStack>
        <Divider marginY={4} />
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}
export default MyApp;
