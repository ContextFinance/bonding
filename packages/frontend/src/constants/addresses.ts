import { Networks } from './blockchain';

const FUJI = {
  sCTXT_ADDRESS: '0xcE13ab3cA4b6690FbA01c74288Cc6f0A7d718E04',
  CTXT_ADDRESS: '0x27c8D4290EC9Aedac3A70F774F41B12F3e7b5F14',
  DAI_ADDRESS: '0x2BD483421917e8Df5bE01Fd40D3b64D4e3b9C87a',
  TREASURY_ADDRESS: '0x0044933f9DE87D0230C3b7E1C974AC1322fad97d',
  CTXT_BONDING_CALC_ADDRESS: '0x0522ef097C26C578a3D250E1a7e0aa1744bb6862',
  STAKING_ADDRESS: '0xe4B94e678feaB78258454aCd348b2D9af1E5187b',
  STAKING_HELPER_ADDRESS: '0xbDdb5599701761FEbD7E2010777C37874de7dF48',
  RESERVES: {
    DAI: '0x2BD483421917e8Df5bE01Fd40D3b64D4e3b9C87a',
    DAI_CTXT: '0x83DEAD8d530E8F39B548Dac1346d334c3e4D3EcC',
  },
  BONDS: {
    DAI: '0x446e00F406E98125dd791b3f20fA1Ca840a690d3',
    DAI_CTXT: '0x9f11D17e3b971d7873efe2694E68B5d6CE365dE8',
  },
  CTXT_CIRCULATING_SUPPLY: '0x1746CA626850F82237D6f281E73e8c1D63Fa383a',
};

const MAINNET = {
  sCTXT_ADDRESS: '0x097673E62b24f08Dad62ACf3D691790Eb3FCC317',
  CTXT_ADDRESS: '0x03bDBC5E96F07A9bA53d088C4Ca51B63cc973a28',
  DAI_ADDRESS: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
  TREASURY_ADDRESS: '0x735BCf7E4502D155841bDAb96B31cc276DF3d0A4',
  CTXT_BONDING_CALC_ADDRESS: '0x4d03fF90E322CB85299D63378D08287D8bb968B1',
  STAKING_ADDRESS: '0x9c69f325969bd7468f0f01f1ea9aE009a850b547',
  STAKING_HELPER_ADDRESS: '0x3DDa3F515B5b2AbC313c2b196Db3CFF9545080ec',
  RESERVES: {
    DAI: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
    DAI_CTXT: '0x49Bd8BBf9e6daf44Da9F28a01734B88f3E88B03f',
  },
  BONDS: {
    DAI: '0x3ABE497e51279f348b6AaB617f09987EE90fc25d',
    DAI_CTXT: '0x81d78ed72f24118FCF2477E37AC07c89024173aa',
  },
  CTXT_CIRCULATING_SUPPLY: '0x8f926d03a62D8b379579936b769887b44E24347e',
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.FUJI) return FUJI;
  if (networkID === Networks.MAINNET) return MAINNET;

  throw new Error("Network don't support");
};
