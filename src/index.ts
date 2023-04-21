import "./lib/setup";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import { scheduleJob } from "node-schedule";

import "./db/setup";
import reminderJob from "./reminder";

const client = new SapphireClient({
  logger: {
    level: LogLevel.Debug
  },
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ],
  loadMessageCommandListeners: false
});

const remind = scheduleJob("16 * * *", () => {
  reminderJob(client);
});

const main = async () => {
  try {
    client.logger.info("Logging in");
    await client.login();
    client.logger.info("logged in");

    remind.invoke();
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

main();
