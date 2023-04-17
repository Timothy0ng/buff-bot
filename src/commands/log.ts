import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";

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
          option
            .setName("msg_id")
            .setDescription("Message ID of exercise")
            .setMinLength(16)
            .setMaxLength(20)
        )
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const messageId: string | null = interaction.options.getString("msg_id");

    if (!messageId) {
      return interaction.reply({ content: "Please provide a valid message ID", ephemeral: true });
    }

    const message = await interaction.channel?.messages.fetch(messageId);

    if (!message) {
      return interaction.reply({
        content: "Could not find the specified message",
        ephemeral: true
      });
    }

    const content = message.content;
    const userId = message.author.username;
    return interaction.reply({
      content: `Well done! @${userId} has completed the following: \n ${content}`
    });
  }
}
