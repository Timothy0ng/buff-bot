import "./lib/setup";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";

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

const main = async () => {
  try {
    client.logger.info("Logging in");
    await client.login();
    client.logger.info("logged in");
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

main();