import { openframes } from "frames.js/middleware";
import { createFrames } from "frames.js/next";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";
import { appURL } from "../utils";

export const frames = createFrames({
  basePath: "/verify-anon-membership",
  baseUrl: appURL(),
  debug: process.env.NODE_ENV === "development",
  middleware: [
    openframes({
      clientProtocol: {
        id: "xmtp",
        version: "vNext",
      },
      handler: {
        isValidPayload: (body) => isXmtpFrameActionPayload(body),
        getFrameMessage: async (body) => {
          if (!isXmtpFrameActionPayload(body)) {
            return undefined;
          }
          const result = await getXmtpFrameMessage(body);

          return { ...result };
        },
      },
    }),
    openframes(), // enables anonymous access
  ],
});
