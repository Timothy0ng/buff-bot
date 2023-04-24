import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { ApplicationCommandType } from "discord.js";

import { db } from "../db";

@ApplyOptions<Command.Options>({
  description: "Log your exercise!"
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerContextMenuCommand((builder) =>
      builder //
        .setName("Log Exercise")
        .setType(ApplicationCommandType.Message)
    );
  }

  public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: "This command can only be used in a server",
        ephemeral: true
      });
    }

    if (interaction.isMessageContextMenuCommand()) {
      await interaction.deferReply();

      const { guildId, id, targetMessage } = interaction;
      const user_id = targetMessage.author.id;
      const channel_id = targetMessage.channelId;
      const message_id = targetMessage.id;
      await db("log").insert({
        id,
        user_id,
        channel_id,
        message_id
      });

      return interaction.editReply({
        content: `<@${user_id}> has completed: https://discord.com/channels/${guildId}/${channel_id}/${message_id}`
      });
    }
  }
}
