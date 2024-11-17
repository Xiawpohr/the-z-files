import { V3Client } from "@xmtp/message-kit";
import { type HandlerContextFixed } from "../types.js";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

// Handler function to process game-related
export async function handler(context: HandlerContextFixed) {
  const {
    client,
    skills,
    message: {
      sender,
      content: {
        skill,
        attachment,
      },
      typeId,
    },
    group,
  } = context;

  switch (skill) {
    case "start": {
      await context.send("Creating group...");
      const group = await createGroup(
        client,
        sender.address,
        client.accountAddress
      );

      await context.send(
        `Group created!\n- ID: ${group.id}\n- Invite URL: ${APP_URL}/join-anon-group?groupId=${group.id} \n- You can share the invite with your friends.`
      );
      // await context.send(
      //   `Group created!\n- ID: ${group.id}\n- Group Frame URL: https://converse.xyz/group/${group.id}: \n- This url will deelink to the group inside Converse\n- Once in the other group you can share the invite with your friends.`
      // );
      break;
    }
    case "anon-upload": {
      await context.send("Upload request received. Please check your DMs.");
      await context.sendTo(`${APP_URL}/upload-anon-membership`, [sender.address]);
      break;
    }
    case "donate": {
      console.log('donate')
      break;
    }
    default: {
      context.reply("Unknown skill. Use help to see all available skills.");
      return {
        code: 400,
        message: "Unknown skill. Use help to see all available skills.",
      };
    }
  }

}


async function createGroup(
  client: V3Client,
  senderAddress: string,
  clientAddress: string
) {
  let senderInboxId = "";
  const group = await client?.conversations.newConversation([
    senderAddress,
    clientAddress,
  ]);
  const members = await group.members();
  const senderMember = members.find((member) =>
    member.accountAddresses.includes(senderAddress.toLowerCase())
  );
  if (senderMember) {
    const senderInboxId = senderMember.inboxId;
    console.log("Sender's inboxId:", senderInboxId);
  } else {
    console.log("Sender not found in members list");
  }
  await group.addSuperAdmin(senderInboxId);
  console.log("Sender is superAdmin", await group.isSuperAdmin(senderInboxId));
  await group.send(`Welcome to the new group!`);
  await group.send(`You are now the admin of this group as well as the bot`);
  return group;
}
