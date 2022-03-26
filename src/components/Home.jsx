import WalletBalance from "./walletBalance";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import DummyImg from '../img/placeholder.svg';
import Ibnyahyah from "../contracts/Ibnyahyah.json";

const contractAddress = "0x4FB631e36D3915867671357AcE39625Af54C1Ae5";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, Ibnyahyah.abi, signer);

const Home = () => {
  const [totalMinted, setTotalMinted] = useState(0);

  const getCount = async () => {
    const count = await contract.count();
    setTotalMinted(parseInt(count));
  };

  useEffect(() => {
    getCount();
  }, []);
  return (
    <div className="container">
      <WalletBalance />
    <div className="row gap-1 mt-3">
      {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
          <div className="col-6-sm col-4-md col-3-lg" key={i}>
            <NFTImage tokenId={i} />
          </div>
        ))}
        </div>
    </div>
  );
};
export default Home;

function NFTImage({ tokenId, getCount }) {
  const contentId = "QmRFCc2ESH4y6GhBbnjiFYdw8yNTX3dDkdBRTYCXcwhJRU";
  const metadataURI = `${contentId}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  // const imageURI = `img/${tokenId}.png`;
  // const imageURI = `out/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.002"),
    });

    await result.wait();
    getMintedStatus();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
  }

  return (
        <div className="card bg-white">
          <img src={isMinted ? imageURI : DummyImg} />
          <div>
            <h5>ID #{tokenId}</h5>
            {!isMinted ? (
              <button className="btn-blue p-1 text-white" onClick={mintToken}>
                Mint
              </button>
            ) : (
              <button className="btn p-1" onClick={getURI}>
                Taken! Show URI
              </button>
            )}
          </div>
        </div>
  );
}
