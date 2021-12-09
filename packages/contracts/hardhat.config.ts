import * as dotenv from 'dotenv'
dotenv.config()

import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
// import "hardhat-contract-sizer";
import '@nomiclabs/hardhat-etherscan'

// import "hardhat-gas-reporter";
import 'hardhat-tracer'
import { task, HardhatUserConfig } from 'hardhat/config'
import 'ts-node/register'

import './tasks/balance'

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.4',
      },
      {
        version: '0.7.5',
      },
      {
        version: '0.5.16', // for uniswap v2
      },
    ],
  },
  networks: {
    hardhat: {
      gasPrice: 470000000000,
      chainId: 43114,
      initialDate: '2020-10-10',

      accounts: {
        accountsBalance: '1000000000000000000000000000000',
        count: 50,
      },
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      // gasPrice: 470000000,
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY!],
    },
    mainnet: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 25000000000,
      chainId: 43114,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.SNOWTRACE_API_KEY,
  },
}

export default config
