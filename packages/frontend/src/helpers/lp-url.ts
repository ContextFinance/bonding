import { BONDS } from '../constants';
import { getAddresses } from '../constants';

export const lpURL = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.DAI_CTXT) {
    return `https://quickswap.exchange/#/add/${addresses.DAI_ADDRESS}/${addresses.CTXT_ADDRESS}`;
  }

  throw Error(`LP url doesn't support: ${bond}`);
};
