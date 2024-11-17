/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { verifySignature } from "./typed-data";
import { getAddress, isHex } from "viem";
import { type FrameActionDataParsed } from "frames.js";

const handleRequest = frames(async (ctx) => {
  const isValid = await isValidSignature(ctx.message);
  if (isValid) {
    const address = ctx.message?.address!;
    const name = ctx.message?.inputText!;

    await createGroup(name, address);

    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          Signature submitted! {name}
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Reset
        </Button>,
      ],
    };
  }

  return {
    image: (
      <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">
        Sign data using your wallet
      </div>
    ),
    textInput: "Group name",
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

async function createGroup(name: string, address: string) {
  const url = new URL("/api/create-group", "http://localhost:3000");
  const resposne = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, address }),
  })

  if (resposne.ok) {
    return resposne.json();
  } else {
    throw new Error("Failed to create group");
  }
}
