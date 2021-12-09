const MAINNET = {
  sCTXT_ADDRESS: '0xAAc144Dc08cE39Ed92182dd85ded60E5000C9e67',
  CTXT_ADDRESS: '0xC250e9987A032ACAC293d838726C511E6E1C029d',
  OLD_CTXT_ADDRESS: '0x4d6A30EFBE2e9D7A9C143Fce1C5Bb30d9312A465',
  OLD_SCTXT_ADDRESS: '0x3949F058238563803b5971711Ad19551930C8209',
  DAI_ADDRESS: '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1',
  TREASURY_ADDRESS: '0x8ce47D56EAa1299d3e06FF3E04637449fFb01C9C',
  OLD_TREASURY: '0xab328Ca61599974b0f577d1F8AB0129f2842d765',
  CTXT_BONDING_CALC_ADDRESS: '0x651125e097D7e691f3Df5F9e5224f0181E3A4a0E',
  STAKING_ADDRESS: '0xC8B0243F350AA5F8B979b228fAe522DAFC61221a',
  OLD_STAKING_ADDRESS: '0xcF2A11937A906e09EbCb8B638309Ae8612850dBf',
  STAKING_HELPER_ADDRESS: '0x76B38319483b570B4BCFeD2D35d191d3c9E01691',
  MIGRATOR: '0xDaa1f5036eC158fca9E5ce791ab3e213cD1c41df',
  RESERVES: {
    MAI: '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1',
    OLD_DAI_CTXT: '0x8094f4C9a4C8AD1FF4c6688d07Bd90f996C7CA21',
    DAI_CTXT: '0x1581802317f32A2665005109444233ca6E3e2D68',
  },
  BONDS: {
    MAI: '0x603A74Fd527b85E0A1e205517c1f24aC71f5C263',
    DAI_CTXT: '0x706587BD39322A6a78ddD5491cDbb783F8FD983E',
    OLD_MAI: '0x28077992bFA9609Ae27458A766470b03D43dEe8A',
    OLD_DAI_CTXT: '0x79B47c03B02019Af78Ee0de9B0b3Ac0786338a0d',
    OLD_DAI_CTXT_V2: '0x64c766f9A4936c3a4b51C55Ea5C4854E19766035',
  },
  CTXT_CIRCULATING_SUPPLY: '0x99ee91871cf39A44E3Fc842541274d7eA05AE4b3',
  IDO: '0x7f637ea843405dff10592f894292a8f1188166f9',
}

const FUJI = {
  sCTXT_ADDRESS: '0x19a41AdAB9b1D1febCC27Fc278847efd013c28c2',
  CTXT_ADDRESS: '0x437D943931903057673618FCA772E8Ff21069D66',
  DAI_ADDRESS: '0x19907af68A173080c3e05bb53932B0ED541f6d20',
  TREASURY_ADDRESS: '0x8F2FA71aa0BC9CEde830e0A2410a06cDDaff20D4',
  CTXT_BONDING_CALC_ADDRESS: '0xbb769C76DA48BD1e3a7270b291fB1625bdCb71C7',
  STAKING_ADDRESS: '0x96df4a396b11BDEc19dB90A239cf51ce4D582268',
  STAKING_HELPER_ADDRESS: '0xaA37cd555c7046b1F45657666eA109AE03e7F5F1',
  RESERVES: {
    MAI: '0x19907af68A173080c3e05bb53932B0ED541f6d20',
    DAI_CTXT: '0x578cEa575734D4d3A3Fb68872e41535746E375bE',
  },
  BONDS: {
    MAI: '0x049bf8be5033624aFA213F821116a4E80445864c',
    DAI_CTXT: '0x7091cEEB04A1574eBBA2B75F7E78b16aa39CA9b8',
    DAI_CTXT_V2: '0x7091cEEB04A1574eBBA2B75F7E78b16aa39CA9b8',
  },
  IDO: '0x64a2062A7C8f52bAE36dAB54bdd943e5Ba680d11',
  CTXT_CIRCULATING_SUPPLY: '0x80F32748C33aCE06c2B6d881bf3Ad543A19031b0',
}

function getAddresses(networkID) {
  if (networkID === 137) return MAINNET
  if (networkID === 80001) return FUJI
  if (networkID === 31337) return MAINNET

  throw new Error("Network don't support")
}

const FUJI_CHAIN_ID = 43113
const MAINNET_CHAIN_ID = 43114

function getContextExchangeAddresses(chainId) {
  if (chainId === FUJI_CHAIN_ID) {
    return {
      factory: `0x9F3DE8b67d28b2fD5B2e7BB76Cd5930D09f358FD`,
      router: `0x087e48D8afC7E637e4dc108c4868e3b0E1444F21`,
    }
  }

  return {
    factory: '0x9F0e80Ac5E09Dd1E37b40E8CDd749768FEAD43EB',
    router: '0x27c8D4290EC9Aedac3A70F774F41B12F3e7b5F14',
  }
}

module.exports = {
  getAddresses,
  getContextExchangeAddresses,

  FUJI,
  MAINNET,
}