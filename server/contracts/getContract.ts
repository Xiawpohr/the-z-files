import { GenericContractsDeclaration } from "../utils/fil-frame/contract";
import deployedContracts from "./deployedContracts";

export function getContract(chainId: number, name: string) {
  return (deployedContracts as GenericContractsDeclaration)?.[chainId]?.[name]
}
