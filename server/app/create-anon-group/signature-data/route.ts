import { CHAIN_ID } from "../../../lib/constants";
import { frames } from "../frames";
import { transaction } from "frames.js/core";
import { domain, types, primaryType, getMessage } from '../typed-data';

const handleRequest = frames(async (ctx) => {
  if (!ctx?.message) {
    throw new Error("Invalid frame message");
  }

  const name = ctx.message.inputText ?? "";
  const message = getMessage(name);

  return transaction({
    chainId: `eip155:${CHAIN_ID}`,
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
