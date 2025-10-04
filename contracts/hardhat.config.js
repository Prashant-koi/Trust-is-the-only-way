require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../.env" });

module.exports = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: process.env.ETHEREUM_RPC_URL,
      accounts: [process.env.ETHEREUM_PRIVATE_KEY],
      chainId: 80002,
    },
  },
};

