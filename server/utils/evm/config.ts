import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { filecoinCalibration } from 'viem/chains'

const privateKey = (process.env.KEY as `0x${string}`) || '0x'
 
export const account = privateKeyToAccount(privateKey)

export const chain = filecoinCalibration

export const publicClient = createPublicClient({
  chain: filecoinCalibration,
  transport: http()
})

export const walletClient = createWalletClient({
  account,
  chain: filecoinCalibration,
  transport: http()
})
