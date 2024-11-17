import { verifyTypedData } from 'viem'
import { chain } from '../../utils/evm/config'

export const domain = {
  chainId: chain.id,
} as const

export const types = {
  Group: [
    { name: "name", type: "string" },
  ]
} as const

export const primaryType = 'Group'

export function getMessage(name: string) {
  return {
    name: name,
  }
}

export async function verifySignature({
  address,
  signature,
  name,
}: {
  address: `0x${string}`,
  signature: `0x${string}`,
  name: string,
}) {
  const message = getMessage(name)
  const isValid = await verifyTypedData({
    address,
    domain,
    types,
    primaryType,
    message,
    signature,
  })

  return isValid
}

