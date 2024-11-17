/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { verifySignature } from "./typed-data";
import { getAddress, isHex } from "viem";
import { type FrameActionDataParsed } from "frames.js";
import { Identity } from "@semaphore-protocol/identity"
import { appURL, createConverseGroupURL, createTransactionURL } from "../utils";
import { joinDealClientGroup } from "../../utils/evm/contract";
import { transaction } from 'frames.js/core';

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

    const identity = new Identity(Buffer.from(signature, "hex"));
    const commitment = identity.commitment;

    const txHash = await joinDealClientGroup(commitment);

    await joinGroup(groupId, address);

    const groupURL = createConverseGroupURL(groupId);
    const transactionURL = createTransactionURL(txHash);

    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          <p>Welcome to join the z-files group!</p>
          <p>{txHash}</p>
        </div>
      ),
      buttons: [
        <Button action="link" target={groupURL}>
          Go to the z-files group
        </Button>,
        <Button action='link' target={transactionURL}>
          Go to Blockscout
        </Button>
      ],
      title: "Join a group",
    };
  }

  return {
    image: (
      <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">
        Join a group with a commitment
      </div>
    ),
    buttons: [
      <Button action="tx" target="/signature-data" post_url="/">
        Sign
      </Button>,
    ],
    title: "Join a group",
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


async function joinGroup(groupId: string, address: string) {
  const url = new URL("/api/join-group", appURL());
  const resposne = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupId, address }),
  })

  if (resposne.ok) {
    return resposne.json();
  } else {
    throw new Error("Failed to join group");
  }
}

