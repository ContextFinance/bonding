import { BONDS } from '../constants';

export const bondName = (bond: string): string => {
  if (bond === BONDS.DAI) return 'DAI';
  if (bond === BONDS.DAI_CTXT) return 'CTXT-DAI LP';

  throw Error(`Bond name doesn't support: ${bond}`);
};
