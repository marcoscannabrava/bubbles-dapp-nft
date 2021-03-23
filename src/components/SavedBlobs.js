/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Divider,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { dynamic } from '../state';
import Blob from './Blob';
import { TrashIcon } from './Common/Icons';
import ERC721 from '../contracts/ItemsERC721.json';
import Web3 from 'web3';


class SavedBlobs extends React.Component {

  state = {
    savedBlobs: []
  }

  constructor(props){
    super(props);
    this.initWeb3 = this.initWeb3.bind(this);
    this.handleEvents = this.handleEvents.bind(this);
  }

  componentDidMount = async () => {
    await this.initWeb3();
  }

  initWeb3 = async () => {
    if (!window.ethereum) {
      alert("Please install metamask in your browser");
    }
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const itoken = new web3.eth.Contract(ERC721.abi, ERC721.goerli);
    const coinbase = await web3.eth.getCoinbase();
    this.setState({
      web3: web3,
      coinbase: coinbase,
      itoken: itoken
    });

    itoken.events.Transfer({
      filter: {
        from: '0x0000000000000000000000000000000000000000',
        to: coinbase
      },
      fromBlock: 0
    }, this.handleEvents);
  }

  handleEvents = async (err, res) => {
    //try {
      const web3 = this.state.web3;
      const timestamp = (await web3.eth.getBlock(res.blockNumber)).timestamp;
      let uri = await this.state.itoken.methods.tokenURI(res.returnValues.tokenId).call();
      console.log(uri)
      if(uri.includes("ipfs://ipfs/")){
        uri = uri.replace("ipfs://ipfs/", "")
      } else {
        uri = uri.replace("ipfs://", "");
      }
      console.log(uri)
      console.log(await (await fetch(`https://ipfs.io/ipfs/${uri}`)).text())
      const metadata = JSON.parse(await (await fetch(`https://ipfs.io/ipfs/${uri}`)).text());


      console.log(metadata)
      const obj = {
        blockNumber: res.blockNumber,
        timestamp: timestamp,
        returnValues: res.returnValues,
        metadata: metadata
      }
      if (!this.state.savedBlobs.includes(JSON.stringify(obj))) {
        this.state.savedBlobs.unshift(JSON.stringify(obj));
        await this.forceUpdate();
      }
    /*} catch (err) {
      console.log(err);
    }*/
  }
  render(){
    return (
      <Box>
        {
          (
            this.state.coinbase &&
            (
              <p>Logged as {this.state.coinbase}</p>
            )
          )
        }
        {this.state.savedBlobs?.length === 0 && (
          <Box textAlign="center">
            <Text my="20" fontSize="2xl">
              No saved blobs found!
            </Text>
          </Box>
        )}
        <SimpleGrid
          columns={{ sm: 2, md: 4 }}
          spacing="40px"
          mb="20"
          justifyContent="center"
        >
          {
            this.state.savedBlobs?.map((string) => {
              const blob = JSON.parse(string);
              return(
                <LinkBox
                  // h="200"
                  rounded="2xl"
                  p="5"
                  borderWidth="1px"
                  _hover={{ boxShadow: '2xl', background: this.state.cardHoverBg }}
                  role="group"
                >
                  <Text
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <LinkOverlay
                      style={{ textTransform: 'uppercase', fontWeight: 600 }}
                      href={blob.url}
                    >
                      {blob.metadata.name}
                    </LinkOverlay>
                    {
                      /*
                      <Button
                        variant="unstyled"
                        visibility="hidden"
                        h="auto"
                        _groupHover={{ visibility: 'visible' }}
                        onClick={() => {
                          deleteBlob(blob.id);
                        }}
                      >
                        <TrashIcon color="tomato" />
                      </Button>
                      */
                    }
                  </Text>
                  <Divider mt="4" />
                  {
                    (
                      blob.metadata.image.includes('ipfs://') ?
                      (
                        <center>
                          <object type="text/html"
                          data={`https://ipfs.io/ipfs/${blob.metadata.image.replace("ipfs://","")}`}
                          width="196px"
                          style={{borderRadius: "100px"}}>
                          </object>
                        </center>
                      ) :
                      (
                        <center>
                          <img src={blob.metadata.image} width='196px' alt=""  style={{borderRadius: "100px"}} />
                        </center>
                      )
                    )
                  }
                </LinkBox>
              )
            })
          }
        </SimpleGrid>
      </Box>
    );
  }
}
export default dynamic(SavedBlobs, ['savedBlobs']);
