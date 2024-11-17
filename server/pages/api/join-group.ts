import type { NextApiRequest, NextApiResponse } from 'next'

import { xmtpClient } from "@xmtp/message-kit";

const KEY = process.env.KEY ?? "";

async function createClient() {
  const { client } = await xmtpClient({
    privateKey: KEY,
    experimental: true,
    hideInitLogMessage: true,
    attachments: true,
    memberChange: true,
  });

  return client;
}

async function joinGroup(
  groupId: string,
  senderAddress: string,
) {
  const client = await createClient();

  const group = await client.conversations.getConversationById(groupId)
  if (!group) {
    throw new Error("Group not found");
  }

  group.addMembers([senderAddress]);

  await group.send(`Welcome to the z-files group!`);
  await group.send(`Prompt /upload and then bot will DM you with a link to upload your files`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { groupId, address } = req.body;
      await joinGroup(groupId, address);
      res.status(200).json({ message: "Group joined successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to join a group", details: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
