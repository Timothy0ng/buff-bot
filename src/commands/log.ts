import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { Guild, TextChannel } from "discord.js";

import { db } from "../db";
import { BIGINT_22, BIGINT_22_BITS } from "../lib/constants";

@ApplyOptions<Command.Options>({
  description: "Log your exercise!"
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option.setName("msg_id").setDescription("ID of the message").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("channel_id").setDescription("ID of the channel containing the message")
        )
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: "This command can only be used in a server",
        ephemeral: true
      });
    }

    const channel_id: string = interaction.options.getString("channel_id") || interaction.channelId;
    const message_id: string = interaction.options.getString("msg_id", true);

    // Already checked for guild above
    const guild = interaction.guild as Guild;
    const channel = guild.channels.cache.get(channel_id) as TextChannel;
    if (!channel) {
      return interaction.reply({
        content: "Could not find the specified channel",
        ephemeral: true
      });
    }

    const message = await channel.messages.fetch(message_id);
    if (!message) {
      return interaction.reply({
        content: "Could not find the specified message",
        ephemeral: true
      });
    }

    const user_id = message.author.id;
    const id = BigInt(message.id);
    // First 42 bits of message ID
    const message_timestamp = id >> BIGINT_22;
    // Remaining bits
    const message_suffix = id & BIGINT_22_BITS;
    await db("log").insert({
      message_timestamp,
      message_suffix,
      user_id,
      channel_id
    });

    return interaction.reply({
      content: `<@${user_id}> has completed: https://discord.com/channels/${guild.id}/${channel_id}/${message_id}`
    });
  }
}
