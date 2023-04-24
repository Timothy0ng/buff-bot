import { Command, RegisterSubCommand } from "@kaname-png/plugin-subcommands-advanced";

import { REMINDERS } from ".";

type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type HhMm = `${number}:${number}`;
const dow_mapping: Record<DayOfWeek, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7
};

@RegisterSubCommand(REMINDERS, (subcommand) => {
  subcommand //
    .setName("add")
    .setDescription("Add a reminder")
    .addStringOption((option) =>
      option //
        .setName("time")
        .setDescription("<Day of week> <hh:mm>; e.g. Mon 16:00")
        .setRequired(true)
    );
  return subcommand;
})
export class SelfCommand extends Command {
  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    const time = interaction.options.getString("time", true);
    const [dow, hhmm] = time.split(" ") as [DayOfWeek, HhMm];
    const dow_num = dow_mapping[dow.toLowerCase() as DayOfWeek];
    if (!dow_num) return interaction.reply({ content: "Invalid day of week", ephemeral: true });

    const [hours, minutes] = hhmm.split(":").map((x) => parseInt(x));
    if (!Number.isInteger(hours) || (hours as number) < 0 || (hours as number) > 23)
      return interaction.reply({ content: "Invalid hour", ephemeral: true });
    if (!Number.isInteger(minutes) || (minutes as number) < 0 || (minutes as number) > 59)
      return interaction.reply({ content: "Invalid minute", ephemeral: true });

    return interaction.reply("Test");
  }
}
