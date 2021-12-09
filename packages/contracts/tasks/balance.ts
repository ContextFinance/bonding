import '@nomiclabs/hardhat-waffle'
import { task } from 'hardhat/config'

task('address', 'Address of the signer').setAction(async (args, hre) => {
  const [signer] = await hre.ethers.getSigners()

  console.log(await signer.getAddress())
  console.log(hre.ethers.utils.formatEther(await signer.getBalance()))
})
