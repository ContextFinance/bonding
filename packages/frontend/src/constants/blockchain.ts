export const EPOCH_INTERVAL = 2200;
export const TOKEN_DECIMALS = 9;
export const BLOCK_RATE_SECONDS = 2;

export enum Networks {
  FUJI = 43113,
  MAINNET = 43114,
}

export const RPCURL = {
  FUJI: 'https://api.avax-test.network/ext/bc/C/rpc',
  MAINNET: 'https://api.avax.network/ext/bc/C/rpc',
};

// export const DEFAULT_NETWORK = Networks.MAINNET;
export const DEFAULT_NETWORK = Networks.FUJI;
