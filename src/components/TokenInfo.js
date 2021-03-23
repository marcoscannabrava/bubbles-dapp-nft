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
import Modal  from './Common/Modal';
import ERC721 from '../contracts/ItemsERC721.json';
import Web3 from 'web3';


class TokenInfo extends React.Component {

  state = {
    savedBlobs: [],
    modalOpen: false
  }

  constructor(props){
    super(props);
    this.initWeb3 = this.initWeb3.bind(this);
  }

  componentDidMount = async () => {
    await this.initWeb3();
  }

  close = () => {
    this.setState({
      modalOpen: false
    })
  }

  open = () => {
    this.setState({
      modalOpen: false
    })
  }

  initWeb3 = async () => {

    try{
      let web3 = new Web3("wss://goerli.infura.io/ws/v3/e105600f6f0a444e946443f00d02b8a9");
      if(window.ethereum){
        await window.ethereum.enable();
        web3 = new Web3(window.ethereum);
      }
      const itoken = new web3.eth.Contract(ERC721.abi, ERC721.goerli);
      const id = window.location.search.split('?tokenId=')[1];
      let uri = await itoken.methods.tokenURI(id);
      if(uri.includes("ipfs://ipfs/")){
        uri = uri.replace("ipfs://ipfs/", "")
      } else {
        uri = uri.replace("ipfs://", "");
      }
      const metadata = JSON.parse(await (await fetch(`https://ipfs.io/ipfs/${uri}`)).text());

      const obj = {
        blockNumber: res.blockNumber,
        timestamp: timestamp,
        returnValues: res.returnValues,
        metadata: metadata
      }

      this.setState({
        web3: web3,
        itoken: itoken,
        id: id,
        obj: obj
      });
    } catch(err){
      console.log(err)
    }

  }

  render(){
    return (
      <Box>
        {
          (
            !this.state.obj ?
            (
              <Modal isOpen={this.state.isOpen} onClose={this.close} onOpen={this.open} title="No token found" children={
                <p>No token found with that id</p>
              }/>
            ) : (
              <Modal isOpen={this.state.isOpen} title={obj.metadata.name} children={
                () => {
                  return(
                    <>
                    <center>
                    {
                      (
                        obj.metadata.image.includes('ipfs://') ?
                        (
                          <object
                          type="text/html"
                          data={`https://ipfs.io/ipfs/${obj.metadata.image.replace("ipfs://","")}`}
                          width="196px"
                          style={{borderRadius: "100px"}}>
                          </object>
                        ) :
                        (
                          <img src={obj.metadata.image} width='196px' alt="" />
                        )
                      )
                    }
                    </center>
                    <p>Creator:{obj.returnValues.to}</p>
                    <p>Name: {obj.metadata.name}</p>
                    <p>Description: {obj.metadata.description}</p>
                    <p>Date: {obj.metadata.attributes[1].value}</p>
                    </>
                  )
                }
              }/>
            )
          )
        }
      </Box>
    );
  }
}
export default dynamic(SavedBlobs, ['savedBlobs']);
