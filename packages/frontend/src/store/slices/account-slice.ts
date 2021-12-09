import { ethers } from 'ethers';
import { BONDS, getAddresses } from '../../constants';
import { ContextTokenContract, StakedContextContract, DaiContract, StakingContract } from '../../abi/';
import { contractForBond, contractForReserve, setAll } from '../../helpers';

import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';

interface IState {
  [key: string]: any;
}

const initialState: IState = {
  loading: true,
};

interface IAccountProps {
  address: string;
  networkID: number;
  provider: JsonRpcProvider;
}

interface IUserBindDetails {
  bond?: string;
  allowance?: number;
  balance?: number;
  interestDue?: number;
  bondMaturationTime?: number;
  pendingPayout?: number;
}

export interface IAccount {
  balances: {
    dai: string;
    sCtxt: string;
    ctxt: string;
  };
  staking: {
    ctxtStake: number;
    sCtxtUnstake: number;
    warmup: string;
    canClaimWarmup: boolean;
  };
}

export const getBalances = createAsyncThunk(
  'account/getBalances',
  async ({ address, networkID, provider }: IAccountProps) => {
    const addresses = getAddresses(networkID);
    const sCtxtContract = new ethers.Contract(addresses.sCTXT_ADDRESS, StakedContextContract, provider);
    const sCTXTBalance = await sCtxtContract.balanceOf(address);
    const ctxtContract = new ethers.Contract(addresses.CTXT_ADDRESS, ContextTokenContract, provider);
    const CTXTBalance = await ctxtContract.balanceOf(address);
    return {
      balances: {
        sCTXT: ethers.utils.formatUnits(sCTXTBalance, 'gwei'),
        ctxt: ethers.utils.formatUnits(CTXTBalance, 'gwei'),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({ networkID, provider, address }: IAccountProps): Promise<IAccount> => {
    const addresses = getAddresses(networkID);

    const daiContract = new ethers.Contract(addresses.DAI_ADDRESS, DaiContract, provider);
    const ctxtContract = new ethers.Contract(addresses.CTXT_ADDRESS, ContextTokenContract, provider);
    const sCtxtContract = new ethers.Contract(addresses.sCTXT_ADDRESS, StakedContextContract, provider);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

    const [daiBalance, CTXTBalance, stakeAllowance, sCTXTBalance, unstakeAllowance, warmup, epoch] = await Promise.all([
      daiContract.balanceOf(address),
      ctxtContract.balanceOf(address),
      ctxtContract.allowance(address, addresses.STAKING_HELPER_ADDRESS),
      sCtxtContract.balanceOf(address),
      sCtxtContract.allowance(address, addresses.STAKING_ADDRESS),
      stakingContract.warmupInfo(address),
      stakingContract.epoch(),
    ]);

    const gons = warmup[1];
    const warmupBalance = await sCtxtContract.balanceForGons(gons);

    return {
      balances: {
        sCtxt: ethers.utils.formatUnits(sCTXTBalance, 'gwei'),
        ctxt: ethers.utils.formatUnits(CTXTBalance, 'gwei'),
        dai: ethers.utils.formatEther(daiBalance),
      },
      staking: {
        ctxtStake: +stakeAllowance,
        sCtxtUnstake: +unstakeAllowance,
        warmup: ethers.utils.formatUnits(warmupBalance, 9),
        canClaimWarmup: warmup[0].gt(0) && epoch[1].gte(warmup[2]),
      },
    };
  },
);

interface ICalculateUserBondDetails {
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const calculateUserBondDetails = createAsyncThunk(
  'bonding/calculateUserBondDetails',
  async ({ address, bond, networkID, provider }: ICalculateUserBondDetails): Promise<IUserBindDetails> => {
    if (!address) return {};

    const addresses = getAddresses(networkID);
    const bondContract = contractForBond(bond, networkID, provider);
    const reserveContract = contractForReserve(bond, networkID, provider);

    let interestDue, pendingPayout, bondMaturationTime;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTimestamp;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = '0';

    if (bond === BONDS.DAI) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.DAI);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    if (bond === BONDS.DAI_CTXT) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.DAI_CTXT);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, 'ether');
    }

    return {
      bond,
      allowance: Number(allowance),
      balance: Number(balance),
      interestDue,
      bondMaturationTime,
      pendingPayout: Number(ethers.utils.formatUnits(pendingPayout, 'gwei')),
    };
  },
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.status = 'idle';
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.status = 'loading';
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.status = 'idle';
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        //@ts-ignore
        const bond = action.payload.bond!;
        state[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: { account: IAccount }) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
