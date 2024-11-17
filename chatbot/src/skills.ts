import { handler as tipping } from "./handler/tipping.js";
import { handler as transaction } from "./handler/transaction.js";
import { handler as games } from "./handler/game.js";
import { handler as help } from "./handler/helpers.js";
import { handler as file } from "./handler/file.js";
import type { SkillGroup } from "@xmtp/message-kit";

export const skills: SkillGroup[] = [
  {
    name: "Anon bot",
    tag: "@anonbot",
    description: "Anon bot for uploading files in a group.",
    skills: [
      {
        skill: "/start",
        triggers: ["/start"],
        examples: ["/start"],
        description: "Start a anonymous group.",
        handler: file,
        params: {},
      },
      {
        skill: "/create-anon-group [groupname]",
        triggers: ["/create-anon-group"],
        examples: ["/create-anon-group groupname"],
        description: "Create a anonymous group.",
        handler: file,
        params: {
          groupname: {
            default: "",
            type: "string",
          },
        },
      },
      {
        skill: "/anon-upload [groupname]",
        triggers: ["/anon-upload"],
        examples: ["/anon-upload"],
        description: "Upload a file to the anonymous group.",
        handler: file,
        params: {},
      },
      {
        skill: "/donate [amount] [token]",
        triggers: ["/donate"],
        examples: ["/donate 10 FIL"],
        handler: file,
        description: "donate to the anonymous group.",
        params: {
          amount: {
            default: 10,
            type: "number",
          },
          token: {
            default: "usdc",
            type: "string",
            values: ["FIL"],
          },
        },
      },


      {
        skill: "/tip [usernames] [amount] [token]",
        triggers: ["/tip"],
        examples: ["/tip @vitalik 10 usdc"],
        description: "Tip users in a specified token.",
        handler: tipping,
        params: {
          username: {
            default: "",
            plural: true,
            type: "username",
          },
          amount: {
            default: 10,
            type: "number",
          },
        },
      },
      {
        skill: "/send [amount] [token] [username]",
        triggers: ["/send"],
        examples: ["/send 10 usdc @vitalik"],
        description:
          "Send a specified amount of a cryptocurrency to a destination address.",
        handler: transaction,
        params: {
          amount: {
            default: 10,
            type: "number",
          },
          token: {
            default: "usdc",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokens
          },
          username: {
            default: "",
            type: "username",
          },
        },
      },
      {
        skill: "/swap [amount] [token_from] [token_to]",
        triggers: ["/swap"],
        examples: ["/swap 10 usdc eth"],
        description: "Exchange one type of cryptocurrency for another.",
        handler: transaction,
        params: {
          amount: {
            default: 10,
            type: "number",
          },
          token_from: {
            default: "usdc",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokens
          },
          token_to: {
            default: "eth",
            type: "string",
            values: ["eth", "dai", "usdc", "degen"], // Accepted tokenss
          },
        },
      },
      {
        skill: "/show",
        triggers: ["/show"],
        examples: ["/show"],
        handler: transaction,
        description: "Show the whole frame.",
        params: {},
      },
      {
        skill: "/game [game]",
        triggers: ["/game", "🔎", "🔍"],
        handler: games,
        description: "Play a game.",
        examples: ["/game wordle", "/game slot", "/game help"],
        params: {
          game: {
            default: "",
            type: "string",
            values: ["wordle", "slot", "help"],
          },
        },
      },
      {
        skill: "/help",
        triggers: ["/help"],
        examples: ["/help"],
        handler: help,
        description: "Get help with the bot.",
        params: {},
      },
      {
        skill: "/id",
        adminOnly: true,
        examples: ["/id"],
        handler: help,
        triggers: ["/id"],
        description: "Get the group ID.",
        params: {},
      },
    ],
  },
];
