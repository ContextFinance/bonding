import { ethers } from 'ethers';
import { getAddresses, BONDS } from '../constants';
import { ContextBond } from '../abi';

export const contractForBond = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const addresses = getAddresses(networkID);
  const contractAddress = bond === BONDS.DAI ? addresses.BONDS.DAI : addresses.BONDS.DAI_CTXT;
  return new ethers.Contract(contractAddress, ContextBond, provider);
};
