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

async function createGroup(
  name: string,
  senderAddress: string,
) {
  const client = await createClient();

  const group = await client?.conversations.newConversation([
    senderAddress,
    client.accountAddress,
  ]);

  const members = await group.members();
  const senderMember = members.find((member) =>
    member.accountAddresses.includes(senderAddress.toLowerCase())
  );
  const senderInboxId = senderMember?.inboxId ?? "";
  await group.addSuperAdmin(senderInboxId);
  await group.updateName(name);

  await group.send(`Welcome to the new group!`);
  await group.send(`You are now the admin of this group as well as the bot`);
  return group;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, address } = req.body;
      const group = await createGroup(name, address);
      res.status(200).json({ message: "Group created successfully", group: group.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to create group", details: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
