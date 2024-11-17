import { frames } from "../frames";
import { transaction } from "frames.js/core";
import { domain, types, primaryType, getMessage } from '../typed-data';
import { chain } from "../../../utils/evm/config";

const handleRequest = frames(async (ctx) => {
  if (!ctx?.message) {
    throw new Error("Invalid frame message");
  }

  const { groupId } = ctx.searchParams;
  if (!groupId) {
    return Response.error();
  }

  const message = getMessage(groupId);

  return transaction({
    chainId: `eip155:${chain.id}`,
    method: "eth_signTypedData_v4",
    params: {
      domain,
      types,
      primaryType,
      message,
    },
  });
});

export const POST = handleRequest;
