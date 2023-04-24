import { Command, RegisterSubCommand } from "@kaname-png/plugin-subcommands-advanced";

import { db } from "../../db";

import { REMINDERS } from ".";

@RegisterSubCommand(REMINDERS, (subcommand) => {
  subcommand //
    .setName("remove")
    .setDescription("Remove a reminder")
    .addIntegerOption((option) =>
      option //
        .setName("id")
        .setDescription("ID of reminder to remove; use `/reminders list` to see your reminders")
        .setRequired(true)
        .setMinValue(1)
    );
  return subcommand;
})
export class SelfCommand extends Command {
  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: "This command can only be used in a server",
        ephemeral: true
      });
    }

    const id = interaction.options.getInteger("id", true);

    const guild_id = interaction.guildId;
    const user_id = interaction.user.id;
    const result = await db("reminder").where({ guild_id, user_id, id }).delete();
    console.log(result);
    if (!result)
      return interaction.reply({ content: `Failed to remove Reminder ${id}`, ephemeral: true });

    return interaction.reply({
      content: `Removed Reminder \`${id}\``,
      ephemeral: true
    });
  }
}
