import {
  Button,
  Box,
  Center,
  HStack,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { Link as GatbsyLink } from 'gatsby';
import { SavedIcon, TwitterIcon, BookmarkIcon } from './Common/Icons';
import { dynamic } from '../state';

const NavLinks = ({ saveBlob,mint }) => {
  const toast = useToast();
  return (
    <Box px="10" pt="3">
      <Center>
        <HStack spacing="2px" fontSize="sm">
          <Box as={Text}>
            <Button
              variant="heavy"
              leftIcon={<BookmarkIcon fontSize="18px" />}
              aria-label="Save blob"
              onClick={async () => {
                localStorage.setItem('blobs',[]);
                saveBlob();
                await mint();
                toast({
                  render: () => (
                    <Box
                      bg="primary"
                      my="10"
                      py="3"
                      px="5"
                      rounded="lg"
                      color="white"
                      textAlign="center"
                      fontWeight="500"
                      shadow="xl"
                    >
                      Blob Saved!
                    </Box>
                  ),
                  duration: 2000,
                });
              }}
            >
              Mint
            </Button>
          </Box>

          <Box as={Text}>
            <Button
              href="/saved-blobs/"
              as={GatbsyLink}
              to="/saved-blobs"
              variant="heavy"
              leftIcon={<SavedIcon fontSize="18px" />}
              aria-label="Saved blobs"
            >
              Minted
            </Button>
          </Box>
          <Box as={Text}>
            <Button
              href="/all-saved-blobs/"
              as={GatbsyLink}
              to="/all-saved-blobs"
              variant="heavy"
              leftIcon={<SavedIcon fontSize="18px" />}
              aria-label="Saved blobs"
            >
              Blobs
            </Button>
          </Box>
          <Box as={Text}>
            <Button
              href="http://www.twitter.com/intent/tweet?url=https://blobs.app/&text=Generate%20beautiful%20blob%20shapes%20for%20web%20and%20flutter%20apps"
              target="_blank"
              as={Link}
              variant="heavy"
              leftIcon={<TwitterIcon fontSize="18px" />}
              aria-label="Share"
            >
              Share
            </Button>
          </Box>
        </HStack>
      </Center>
    </Box>
  );
};

export default dynamic(NavLinks);
