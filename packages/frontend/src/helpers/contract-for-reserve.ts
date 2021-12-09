import { ethers } from 'ethers';
import { getAddresses, BONDS } from 'src/constants';
import { MimReserveContract, MimTimeReserveContract } from '../abi';

export const contractForReserve = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
) => {
  const addresses = getAddresses(networkID);
  if (bond === BONDS.DAI) {
    return new ethers.Contract(addresses.RESERVES.DAI, MimReserveContract, provider);
  }

  if (bond === BONDS.DAI_CTXT) {
    return new ethers.Contract(addresses.RESERVES.DAI_CTXT, MimTimeReserveContract, provider);
  }

  throw Error(`Contract for reserve doesn't support: ${bond}`);
};
