import { run } from "@xmtp/message-kit";

let runner: any;

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      if (!runner) {
        console.log("Starting runner");
        runner = await run(async (context) => {
          const {
            message: {
              typeId,
              content: { content: text },
            },
          } = context;
          if (typeId !== "text") return;

          res.status(200).json({ message: `New message received: ${text}` });
          await context.send("gm");
        });

        // Add a listener to reset the runner when it stops
        runner.on("end", () => {
          console.log("Runner stopped");
          runner = null; // Reset runner
        });
        // Ensure the runner is stopped when the process exits
        process.on("exit", () => {
          if (runner) {
            console.log("Stopping runner on process exit");
            runner.stop(); // Assuming runner has a stop method
            runner = null;
          }
        });
      } else {
        res.status(200).json({ message: "Runner is already running" });
      }
    } catch (error) {
      console.error("Error starting runner:", error);
      res
        .status(500)
        .json({ error: "Failed to start runner", details: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}