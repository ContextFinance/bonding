// @dev. This script will deploy this V1.1 of Context. It will deploy the whole ecosystem.

const { ethers } = require('hardhat')
const UniswapV2ABI = require('./IUniswapV2Factory.json').abi

async function main() {
  const [deployer] = await ethers.getSigners()
  const daoAddr = '0x929A27c46041196e1a49C7B459d63eC9A20cd879'
  console.log('Deploying contracts with the account: ' + deployer.address)

  // Initial staking index
  const initialIndex = '1000000000'

  const { provider } = deployer
  const firstEpochTime = 1635897600 // 2021-11-3 00:00 UTC
  console.log('First epoch timestamp: ' + firstEpochTime)

  // What epoch will be first epoch
  const firstEpochNumber = '1'

  // How many seconds are in each epoch
  const epochLengthInSeconds = 86400 / 3
  // const epochLengthInSeconds = 60*10

  // Initial reward rate for epoch
  const initialRewardRate = '5000'

  // Ethereum 0 address, used when toggling changes in treasury
  const zeroAddress = '0x0000000000000000000000000000000000000000'

  // MAI bond BCV
  const maiBondBCV = '300'

  // Bond vesting length in seconds.
  const bondVestingLength = 5 * 24 * 3600

  // Min bond price
  const minBondPrice = '600'

  // Max bond payout, 1000 = 1% of CTXT total supply
  const maxBondPayout = '1000'

  // DAO fee for bond
  const bondFee = '10000'

  // Max debt bond can take on
  const maxBondDebt = '8000000000000000'

  // Initial Bond debt
  const initialBondDebt = '0'

  const warmupPeriod = '3'

  const chainId = (await provider.getNetwork()).chainId
  const quickswapFactoryAddr =
    chainId === 80001
      ? '0x69004509291F4a4021fA169FafdCFc2d92aD02Aa'
      : '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
  const maiAddr = '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1'

  // Deploy CTXT
  const CTXT = await ethers.getContractFactory('ContextERC20')
  const clam = CTXT.attach('0x4d6A30EFBE2e9D7A9C143Fce1C5Bb30d9312A465')
  // const clam = await CTXT.deploy()
  // console.log('CTXT deployed: ' + clam.address)

  const uniswapFactory = new ethers.Contract(
    quickswapFactoryAddr,
    UniswapV2ABI,
    deployer
  )
  // await (await uniswapFactory.createPair(clam.address, maiAddr)).wait()
  const lpAddress = await uniswapFactory.getPair(clam.address, maiAddr)
  console.log('LP: ' + lpAddress)

  // Deploy bonding calc
  const BondingCalculator = await ethers.getContractFactory(
    'ContextBondingCalculator'
  )
  // const bondingCalculator = await BondingCalculator.deploy(clam.address)
  const bondingCalculator = BondingCalculator.attach(
    '0x47655e27667E5B4EC9EB70799f281524d031381c'
  )

  // Deploy treasury
  const Treasury = await ethers.getContractFactory('ContextTreasury')
  const treasury = await Treasury.attach(
    '0xab328Ca61599974b0f577d1F8AB0129f2842d765'
  )
  // const treasury = await Treasury.deploy(
  //   clam.address,
  //   maiAddr,
  //   lpAddress,
  //   bondingCalculator.address,
  //   '43200'
  // )
  // console.log('treasury deployed: ' + treasury.address)

  // Deploy staking distributor
  const StakingDistributor = await ethers.getContractFactory(
    'ContextStakingDistributor'
  )
  const stakingDistributor = StakingDistributor.attach(
    '0xD42938418E648b981bA2814b0C8b4F6f35CE61B8'
  )
  // const stakingDistributor = await StakingDistributor.deploy(
  //   treasury.address,
  //   clam.address,
  //   epochLengthInSeconds,
  //   firstEpochTime
  // )
  // await stakingDistributor.deployTransaction.wait()

  // Deploy sCTXT
  const StakedCTXT = await ethers.getContractFactory('StakedContextERC20')
  const sCTXT = StakedCTXT.attach('0x3949F058238563803b5971711Ad19551930C8209')
  // const sCTXT = await StakedCTXT.deploy()
  // await sCTXT.deployTransaction.wait()

  // Deploy Staking
  const Staking = await ethers.getContractFactory('ContextStaking')
  const staking = await Staking.attach(
    '0xcF2A11937A906e09EbCb8B638309Ae8612850dBf'
  )
  // const staking = await Staking.deploy(
  //   clam.address,
  //   sCTXT.address,
  //   epochLengthInSeconds,
  //   firstEpochNumber,
  //   firstEpochTime
  // )
  // await staking.deployTransaction.wait()

  // Deploy staking warmpup
  const StakingWarmup = await ethers.getContractFactory('ContextStakingWarmup')
  const stakingWarmup = StakingWarmup.attach(
    '0x314de54E2B64E36F4B0c75079C7FB7f894750014'
  )
  // const stakingWarmup = await StakingWarmup.deploy(
  //   staking.address,
  //   sCTXT.address
  // )
  // await stakingWarmup.deployTransaction.wait()

  // Deploy staking helper
  const StakingHelper = await ethers.getContractFactory('ContextStakingHelper')
  const stakingHelper = StakingHelper.attach(
    '0x22F587EcF472670c61aa4715d0b76D2fa40A9798'
  )
  // const stakingHelper = await StakingHelper.deploy(
  //   staking.address,
  //   clam.address
  // )
  // await stakingHelper.deployTransaction.wait()

  // Deploy MAI bond
  const MAIBond = await ethers.getContractFactory('ContextBondDepository')
  const maiBond = MAIBond.attach('0x28077992bFA9609Ae27458A766470b03D43dEe8A')
  // const maiBond = await MAIBond.deploy(
  //   clam.address,
  //   maiAddr,
  //   treasury.address,
  //   daoAddr,
  //   zeroAddress
  // )
  // await maiBond.deployTransaction.wait()

  const MaiClamBond = await ethers.getContractFactory('ContextBondDepository')
  // const maiClamBond = MaiClamBond.attach(
  //   '0x79B47c03B02019Af78Ee0de9B0b3Ac0786338a0d'
  // )
  const maiClamBond = await MaiClamBond.deploy(
    clam.address,
    lpAddress,
    treasury.address,
    daoAddr,
    bondingCalculator.address
  )
  await maiClamBond.deployTransaction.wait()

  console.log(
    JSON.stringify({
      sCTXT_ADDRESS: sCTXT.address,
      CTXT_ADDRESS: clam.address,
      DAI_ADDRESS: maiAddr,
      TREASURY_ADDRESS: treasury.address,
      CTXT_BONDING_CALC_ADDRESS: bondingCalculator.address,
      STAKING_ADDRESS: staking.address,
      STAKING_HELPER_ADDRESS: stakingHelper.address,
      RESERVES: {
        MAI: maiAddr,
        DAI_CTXT: lpAddress,
      },
      BONDS: {
        MAI: maiBond.address,
        DAI_CTXT: maiClamBond.address,
      },
    })
  )

  // queue and toggle MAI reserve depositor
  // await (await treasury.queue('0', maiBond.address)).wait()

  // queue and toggle MAI-CTXT liquidity depositor
  // await (await treasury.queue('4', maiClamBond.address)).wait()

  // Set bond terms
  await maiBond.initializeBondTerms(
    maiBondBCV,
    bondVestingLength,
    minBondPrice,
    maxBondPayout,
    bondFee,
    maxBondDebt,
    initialBondDebt
  )
  // await (await maiClamBond.initializeBondTerms(
  //   '40',
  //   bondVestingLength,
  //   minBondPrice,
  //   maxBondPayout,
  //   bondFee,
  //   maxBondDebt,
  //   initialBondDebt
  // )).wait()

  // Set staking for bonds
  // await (await maiBond.setStaking(stakingHelper.address, true)).wait()
  await (await maiClamBond.setStaking(stakingHelper.address, true)).wait()

  // Initialize sCTXT and set the index
  // await (await sCTXT.initialize(staking.address)).wait()
  // await (await sCTXT.setIndex(initialIndex)).wait()

  // set distributor contract and warmup contract
  // await (await staking.setContract('0', stakingDistributor.address)).wait()
  // await (await staking.setContract('1', stakingWarmup.address)).wait()
  // await (await staking.setWarmup(warmupPeriod)).wait()

  // Set treasury for CTXT token
  // await (await clam.setVault(treasury.address)).wait()

  // Add staking contract as distributor recipient
  // await (await stakingDistributor.addRecipient(staking.address, initialRewardRate)).wait()

  // queue and toggle reward manager
  // await (await treasury.queue('8', stakingDistributor.address)).wait()

  // TODO: toggle after 43200 blocks
  //  await treasury.toggle('0', maiBond.address, zeroAddress)
  //  await (await treasury.toggle('4', maiClamBond.address, zeroAddress)).wait()
  //  await treasury.toggle('8', stakingDistributor.address, zeroAddress)
  // await treasury.queue('9', sCTXT.address)
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
