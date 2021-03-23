import * as React from 'react';
import { Link } from 'gatsby';

import { Box, Center, Heading, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import SEO from '../components/SEO';

import Logo from '../components/Common/Logo';
import SavedBlobs from '../components/AllSavedBlobs';
import Layout from '../components/Layout';
import TokenInfo from '../components/TokenInfo';
const SecondPage = () => (
  <Layout>
    <SEO
      title="Save blobs locally and access them anytime even when in offline"
      description="Customizable blobs as SVG and Flutter Widget. Create random or fixed blobs, loop, animate, clip them with ease"
    />
    <Box my="10" textAlign="center">
      <Logo />
      <Heading
        size="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        variant="main"
      >
        Browse minted blobs
      </Heading>
      <Text my="2" variant="subtle">
        Click on the any blob card to navigate to token info
      </Text>
    </Box>
    <SavedBlobs />
    <Center>
      <Link to="/">
        {' '}
        <ArrowBackIcon />
        Go back to the homepage
      </Link>
    </Center>
  </Layout>
);

export default SecondPage;
