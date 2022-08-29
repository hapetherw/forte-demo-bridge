import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";
dotenv.config();

const chainIds = {
  mainnet: 1,
  rinkeby: 4,
  goerli: 5,
  mumbai: 80001,
  polygon: 137
};

const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
const PRIVATE_KEY = process.env.PK || "";
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      chainId: chainIds.goerli,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.25
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      chainId: chainIds.rinkeby,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.25
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      chainId: chainIds.mumbai,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.25
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: ETHERSCAN_KEY,
      rinkeby: ETHERSCAN_KEY,
      goerli: ETHERSCAN_KEY,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 30000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  }
};

export default config;
