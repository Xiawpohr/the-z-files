import {
  type HandlerContext,
  type MessageAbstracted,
} from "@xmtp/message-kit";

export interface MessageAttachment {
  content: {
    attachment?: {
      data: Uint8Array;
      filename: string;
      mimeType: string;
    };
  };
}

export interface HandlerContextFixed extends HandlerContext {
  message: MessageAbstracted & MessageAttachment;
}
