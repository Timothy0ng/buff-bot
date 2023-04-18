import { SapphireClient } from "@sapphire/framework";
import { TextChannel, DMChannel } from "discord.js";

const reminderJob = async (client: SapphireClient) => {
  // This function will be executed at 11:00 AM every day
  console.log("Sending reminder...");
  // TODO: Add your code to send the reminder here

  const channel_id = "1097115078236577845";
  const channel = client.channels.cache.get(channel_id);

  if (channel instanceof TextChannel || channel instanceof DMChannel) {
    await channel.send("Have u exercised?");
  }
};

export default reminderJob;
