const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Ibnyahyah", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const Ridwan = await ethers.getContractFactory("Ibnyahyah");
    const ridwan = await Ridwan.deploy();
    await ridwan.deployed();

    const recipient = process.env.RINKEBY_PRIVATE_KEY;
    const metadataURI = "cid/test.png";

    let balance = await ridwan.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await ridwan.payToMint(recipient, metadataURI, {value: ethers.utils.parseEther('0.002')});

    // Wait util the transaction is mined
    await newlyMintedToken.wait();

    balance = await ridwan.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await ridwan.isContentOwned(metadataURI)).to.equal(true);
  });
});
