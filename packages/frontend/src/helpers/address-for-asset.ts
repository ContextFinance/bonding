import { getAddresses, BONDS } from '../constants';

export const addressForAsset = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.DAI) {
    return addresses.RESERVES.DAI;
  }

  if (bond === BONDS.DAI_CTXT) {
    return addresses.RESERVES.DAI_CTXT;
  }

  throw Error(`Address for asset doesn't support: ${bond}`);
};
