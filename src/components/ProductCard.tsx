import { Button } from '@chakra-ui/button';
import { Box, Heading, Stack, Text } from '@chakra-ui/layout';
import { ProductWithCount } from '../types';
import parseCurrency from '../utils/parseCurrency';
import { Image } from './Image';

interface Props {
  product: ProductWithCount;
  handleIncreaseProductQuantity: (id: string) => void;
  handleDecreaseProductQuantity: (id: string) => void;
}

export default function ProductCard({
  product,
  handleIncreaseProductQuantity,
  handleDecreaseProductQuantity,
}: Props) {
  return (
    <Stack
      key={product.id}
      borderRadius="3xl"
      backgroundColor="whiteAlpha.900"
      boxShadow="md"
    >
      <Image
        borderRadius="3xl"
        src={product.image}
        alt={product.title}
        dimensions={[400, 300]}
        objectFit="cover"
      />

      <Stack padding={5}>
        <Box minH={100}>
          <Heading size="lg">{product.title}</Heading>
          <Text color="GrayText">{product.description}</Text>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Text fontSize="md" fontWeight="bold">
            Precio
          </Text>
          <Text fontSize="md" fontWeight="bold">
            Cantidad
          </Text>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg" as="span" flexBasis={1}>
            {parseCurrency(product.price)}
          </Heading>

          <Box display="flex" alignItems="center">
            <Button
              colorScheme="blackAlpha"
              borderRadius="full"
              onClick={() => handleDecreaseProductQuantity(product.id)}
            >
              -
            </Button>
            <Text fontWeight="bold" paddingX={3}>
              {product.quantity}
            </Text>
            <Button
              colorScheme="red"
              borderRadius="full"
              onClick={() => handleIncreaseProductQuantity(product.id)}
            >
              +
            </Button>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
