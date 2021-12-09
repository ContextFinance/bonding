import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { IReduxState } from '../store/slices/state.interface';

export const makeBondsArray = (daiBondDiscount?: string | number, daiCtxtBondDiscount?: string | number) => {
  return [
    {
      name: 'DAI',
      value: 'DAI',
      discount: Number(daiBondDiscount),
    },
    {
      name: 'CTXT-DAI LP',
      value: 'DAI_CTXT_LP',
      discount: Number(daiCtxtBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();

export const useBonds = () => {
  const daiBondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['DAI'] && state.bonding['DAI'].bondDiscount;
  });

  const daiContextDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['DAI_CTXT_LP'] && state.bonding['DAI_CTXT_LP'].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(daiBondDiscount, daiContextDiscount);
    const mostProfitableBonds = orderBy(bondValues, 'discount', 'desc');
    setBonds(mostProfitableBonds);
  }, [daiBondDiscount, daiContextDiscount]);

  return bonds;
};
