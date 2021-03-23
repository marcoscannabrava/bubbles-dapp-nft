import * as React from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import ReactDOMServer from 'react-dom/server';
import SEO from '../components/SEO';
import BlobSettingsSection from '../components/BlobSettingsSection';
import BlobActionBar from '../components/BlobActionBar';
import Logo from '../components/Common/Logo';
import BlobContainer from '../components/BlobContainer';
import NavLinks from '../components/NavLinks';
import Layout from '../components/Layout';
import Web3 from 'web3';
import IPFS from 'ipfs-http-client';
import ERC721 from '../contracts/ItemsERC721.json';
import Blob from '../components/Blob';

const Buffer = require('buffer').Buffer;
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});
class IndexPage extends React.Component {

  state = {

  }

  constructor(props){
    super(props);
    this.initWeb3 = this.initWeb3.bind(this);
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
      itoken: itoken,
      ipfs: ipfs
    });
  }

  mint = async () => {
    const blob = JSON.parse(localStorage.getItem('blobs'))[0];
    const blobSVG =  <Blob {...blob} />
    const ipfs = this.state.ipfs;
    const imgres = await ipfs.add(ReactDOMServer.renderToString(blobSVG));
    console.log(imgres)
    let metadata = {
        name: blob.name,
        image: `ipfs://${imgres.path}`,
        external_url: this.state.external_url,
        description: blob.description,
        attributes: [{
            trait_type: "Name",
            value: blob.name
          },
          {
            trait_type: "Date",
            value: new Date().getTime()
          },
          {
            trait_type: "Artist",
            value: this.state.coinbase
          }
        ]
    }
    const res = await ipfs.add(JSON.stringify(metadata));
    //const uri = res[0].hash;
    const uri = res.path;
    try{
      await this.state.itoken.methods.mint(this.state.coinbase, uri).send({
        from: this.state.coinbase,
        value: 10 ** 16
      });
    } catch(err){
      console.log(err)
    }
  }



  render(){
    return(
      <Layout>
        <SEO
          title="Bubbles - Generate and mint beautiful blob shapes as NFT"
          description="Mint customizable blobs as NFT. Create random or fixed blobs, loop, animate, clip them with ease"
        />
        <Flex wrap="wrap" flex="1">
          <Flex
            align="center"
            justify="center"
            direction="column"
            my="4"
            w="full"
            display={{ base: 'flex', lg: 'none' }}
          >
            <Logo />
            <Heading fontSize="3xl" variant="main">
              Generate blobs
            </Heading>
          </Flex>
          <Box
            w={{ base: '100%', lg: 8 / 12 }}
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            {
              (
                this.state.coinbase &&
                (
                  <p>Logged as {this.state.coinbase}</p>
                )
              )
            }
            <Box w={{ base: '100%', lg: 500 }} h={{ lg: 500 }}>
              <BlobContainer />
            </Box>
            <BlobActionBar />
          </Box>

          <Box
            flex="1"
            display="flex"
            alignItems="center"
            w={{ base: '100%', lg: 4 / 12 }}
          >
            <Box w="full">
              <Flex
                align="center"
                justify="center"
                direction="column"
                mb="8"
                display={{ base: 'none', lg: 'flex' }}
              >
                <Logo />
                <Heading fontSize="3xl" variant="main">
                  Generate blobs
                </Heading>
              </Flex>
              <BlobSettingsSection />
              <NavLinks mint={this.mint}/>
            </Box>
          </Box>
        </Flex>
      </Layout>
    )
  }
}


export default IndexPage;
