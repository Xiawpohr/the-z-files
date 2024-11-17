import { NextRequest, NextResponse } from "next/server";
import { uploadToLighthouseDataDepot } from "./data-depot";
import dotenv from "dotenv";
import { makeDealProposal } from "../../utils/evm/contract";
import { inmemoryCache } from "../../utils/cache/inmemory";
import { Identity } from '@semaphore-protocol/identity';
import { Group } from "@semaphore-protocol/group";
import { generateProof, verifyProof } from "@semaphore-protocol/proof";
import { getMembersFromDealClient } from '../../utils/evm/contract';

dotenv.config();

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const address = form.get("address") as string;
    const file = form.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadToLighthouseDataDepot(file);
    const dealRequest = createDealRequest(result);

    const membershipData = inmemoryCache.get(address);
    if (!membershipData.membershipChecked) {
      return NextResponse.json({ error: "User not a member of any group" }, { status: 403 });
    }

    const { signature } = membershipData;

    const proof = await makeProof(signature);

    const txHash = await makeDealProposal(dealRequest, proof);

    return NextResponse.json({ txHash }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

function createDealRequest(dealParams: {
  carLink: string,
  carSize: number,
  pieceCid: string,
  pieceSize: number,
  mimeType: string,
  dealStartBlock?: number,
  dealEndBlock?: number,
}) {
  return {
    piece_cid: dealParams.pieceCid ?? "0x00",
    piece_size: dealParams?.pieceSize ?? 0,
    verified_deal: true,
    label: "",
    start_epoch: dealParams?.dealStartBlock ?? 0,
    end_epoch: dealParams?.dealEndBlock ?? 0,
    storage_price_per_epoch: 0,
    provider_collateral: 0,
    client_collateral: 0,
    extra_params_version: 1,
    extra_params: {
      location_ref: dealParams?.carLink ?? "",
      car_size: dealParams?.carSize ?? 0,
      skip_ipni_announce: false,
      remove_unsealed_copy: false,
    },
  }
}

async function makeProof(signature: string) {
  const identity = new Identity(signature);
  const group = await getGroups();
  const message = "";
  const scope = Date.now().toString();
  const proof = await generateProof(identity, group, message, scope)
  await verifyProof(proof)

  return proof
}

async function getGroups() {
  const members = await getMembersFromDealClient();
  const group = new Group(members)
  return group;
}
