import { run } from "@xmtp/message-kit";
import { textGeneration, processMultilineResponse } from "@xmtp/message-kit";
import { agent_prompt } from "./lib/prompt.js";
import { getUserInfo } from "@xmtp/message-kit";
import { HandlerContextFixed } from "./types.js";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

run(async (context: HandlerContextFixed) => {
  const {
    message: {
      content: {
        text,
        params,
        attachment,
      },
      sender,
      typeId,
    },
    group,
  } = context;

  try {
    if (typeId === "remoteStaticAttachment" && attachment) {
      const blob = new Blob([attachment.data], { type: attachment.mimeType });
      const { txHash } = await uploadFile(sender.address, blob)
      await context.send(`File uploaded successfully. TxHash: ${txHash}`);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    await context.send((error as Error).message);
    return;
  }

  // try {
  //   let userPrompt = params?.prompt ?? text;
  //   const userInfo = await getUserInfo(sender.address);
  //   if (!userInfo) {
  //     console.log("User info not found");
  //     return;
  //   }
  //   const { reply } = await textGeneration(
  //     sender.address,
  //     userPrompt,
  //     await agent_prompt(userInfo),
  //   );
  //   await processMultilineResponse(sender.address, reply, context);
  // } catch (error) {
  //   console.error("Error during OpenAI call:", error);
  //   await context.send("An error occurred while processing your request.");
  // }
}, {
  experimental: true, //optional. default is false
  attachments: true, //optional. default is false
  memberChange: true, //optional. default is false
});

async function uploadFile(address: string, file: Blob) {
  const url = `${APP_URL}/upload-anon-file`;
  const formData = new FormData();
  formData.append("address", address);
  formData.append("file", file);
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Failed to upload file");
  }
}