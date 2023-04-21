import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { TextChannel } from "discord.js";

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
          option.setName("channel_id").setDescription("ID of the channel containing the message")
        )
        .addStringOption((option) =>
          option.setName("msg_id").setDescription("ID of the message").setRequired(true)
        )
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const channelId: string = interaction.options.getString("channel_id") || interaction.channelId;
    const messageId: string = interaction.options.getString("msg_id", true);

    const channel = interaction.guild?.channels.cache.get(channelId) as TextChannel;
    if (!channel) {
      return interaction.reply({
        content: "Could not find the specified channel",
        ephemeral: true
      });
    }

    const message = await channel.messages.fetch(messageId);
    if (!message) {
      return interaction.reply({
        content: "Could not find the specified message",
        ephemeral: true
      });
    }

    const content = message.content;
    const userId = message.author.id;
    return interaction.reply({
      content: `Well done! <@${userId}> has completed the following: \n ${content}`
    });
  }
}
