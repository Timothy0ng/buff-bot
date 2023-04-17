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
    const username = interaction.user.username;
    return interaction.reply({
      content: `Well done! @${username} has just completed the following: \n`
    });
  }
}
