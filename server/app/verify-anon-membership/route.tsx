/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { verifySignature } from "./typed-data";
import { getAddress, isHex } from "viem";
import { type FrameActionDataParsed } from "frames.js";
import { Identity } from "@semaphore-protocol/identity"
import { appURL, createConverseGroupURL } from "../utils";
import { joinDealClientGroup } from "../../utils/evm/contract";
import { inmemoryCache } from "../../utils/cache/inmemory";

const handleRequest = frames(async (ctx) => {
  const { groupId } = ctx.searchParams;

  if (!groupId) {
    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">
          Group not found
        </div>
      ),
    };
  }

  const isValid = await isValidSignature(ctx.message);
  if (isValid) {
    const signature = ctx.message?.transactionId!;
    const address = ctx.message?.address!;
    
    inmemoryCache.set(address, { membershipChecked: true, signature, groupId });

    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          <p>MembershipChecked! You can upload a file.</p>
        </div>
      ),
    };
  }

  return {
    image: (
      <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">
        Generate a membership proof first and the upload a file.
      </div>
    ),
    buttons: [
      <Button action="tx" target="/signature-data" post_url="/">
        Sign
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;

function formatSignature(signature: string): `0x${string}`  {
  return isHex(signature) ? signature : `0x${signature}`;
};

async function isValidSignature(message?: FrameActionDataParsed) {
  if (!message || !message?.transactionId || !message?.address) {
    return false;
  }
  const signature = formatSignature(message?.transactionId);
  const address = getAddress(message?.address)
  const name = message?.inputText!;
  const isValid = await verifySignature({
    address,
    signature,
    name,
  });
  return isValid;
}
