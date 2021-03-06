const { ethers } = require('hardhat')

async function main() {
  const signer = await ethers.getSigner()
  const ContextBondDepository = await ethers.getContractFactory(
    'ContextBondDepository'
  )
  const bondType = 'lp'

  const bond = ContextBondDepository.attach(
    '0x9f11D17e3b971d7873efe2694E68B5d6CE365dE8'
  )

  const bcvCurrent = (await bond.terms())[0].toNumber()

  const add = false
  const adjustment = 1
  const bcvTarget = 38
  const buffer = 0
  const step = Math.ceil(Math.abs(bcvCurrent - bcvTarget) / adjustment) + 1

  console.log(
    `adjust bond ${bondType}: ` +
      JSON.stringify(
        {
          add,
          adjustment,
          bcvCurrent,
          bcvTarget,
          step,
          buffer,
        },
        null,
        2
      )
  )
  await (await bond.setAdjustment(add, adjustment, bcvTarget, buffer)).wait(2)

  console.log('adjusted')

  const nonce = await signer.getTransactionCount()
  const amount = bondType === 'dai' ? '0.6' : '0.000002'
  for (let i = 0; i < step; i++) {
    await bond.deposit(
      ethers.utils.parseEther(amount),
      ethers.utils.parseUnits('9999', 9),
      signer.address,
      { nonce: nonce + i }
    )
    console.log('adjust: ' + i)
  }

  console.log('done')
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
