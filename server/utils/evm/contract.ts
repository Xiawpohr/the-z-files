import { slice } from "viem"
import { getContract } from "../../contracts/getContract"
import { account, chain, publicClient, walletClient } from "./config"
import { SemaphoreProof } from "@semaphore-protocol/proof"
import { DealRequest } from "../filecoin/types"
import { getParsedContractFunctionArgs } from "./helpers"

export async function joinDealClientGroup(identityCommitment: bigint) {
  const contractData = getContract(chain.id, 'DealClient')

  const { request } = await publicClient.simulateContract({
    ...contractData,
    functionName: 'joinGroup',
    args: [identityCommitment],
    account,
  })
  
  const txHash = await walletClient.writeContract(request)
  
  return txHash
}

export async function makeDealProposal(
  dealRequest: DealRequest,
  proof: SemaphoreProof,
) {
  const contractData = getContract(chain.id, 'DealClient')
  const { request } = await publicClient.simulateContract({
    ...contractData,
    functionName: 'makeDealProposal',
    args: [getParsedContractFunctionArgs(dealRequest), proof],
    account,
  })
  const txHash = await walletClient.writeContract(request)
  return txHash
}

export async function getMembersFromDealClient() {
  const contractData = getContract(chain.id, 'DealClient')
  if (!contractData) {
    throw new Error('Contract not found')
  }
  
  const logs = await publicClient.getContractEvents({ 
    address: contractData.address,
    abi: contractData.abi,
    eventName: 'MemberAdded',
  })

  const members = logs.map((log) => {
    const identityCommitment = slice(log.data, 64, 128)
    return identityCommitment
  })

  return members
}
