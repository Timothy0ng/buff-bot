import type { GuildTextBasedChannel } from "discord.js";

import { Command, RegisterSubCommand } from "@kaname-png/plugin-subcommands-advanced";
import { RecurrenceRule, scheduleJob } from "node-schedule";

import { db } from "../../db";
import { DOW_MAPPING, REMINDERS } from "../../lib/constants";
import { assertType, parseTime } from "../../lib/utils";

type ScheduleReminderParams = {
  interaction: Command.ChatInputInteraction;
  user_id: string;
};
function scheduleReminder({ interaction, user_id }: ScheduleReminderParams) {
  return async function () {
    const channel = (await interaction.client.channels.fetch(
      interaction.channelId
    )) as GuildTextBasedChannel;
    await channel.send({ content: `<@${user_id}> Exercise!` });
  };
}

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
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: "This command can only be used in a server",
        ephemeral: true
      });
    }

    const time = interaction.options.getString("time", true);

    const [dow_str, hhmm] = time.split(" ");
    if (!dow_str || !hhmm) return interaction.reply({ content: "Invalid time", ephemeral: true });

    const dow = DOW_MAPPING[dow_str.toLowerCase() as BuffBot.DayOfWeekStr] as BuffBot.DayOfWeek;
    if (!dow) return interaction.reply({ content: "Invalid day of week", ephemeral: true });

    const [h, m] = hhmm.split(":").map((x) => parseInt(x));
    assertType<number>(h);
    assertType<number>(m);
    if (!Number.isInteger(h) || h < 0 || h > 23)
      return interaction.reply({ content: "Invalid hour", ephemeral: true });
    if (!Number.isInteger(m) || m < 0 || m > 59)
      return interaction.reply({ content: "Invalid minute", ephemeral: true });

    const guild_id = interaction.guildId;
    const user_id = interaction.user.id;
    const result = (await db("reminder")
      .returning("id")
      .insert({ guild_id, user_id, dow, h, m })) as { id: number }[];
    const id = result[0]?.id;
    if (!id) return interaction.reply({ content: "Failed to add reminder", ephemeral: true });

    const rule = new RecurrenceRule();
    rule.hour = h;
    rule.minute = m;
    rule.dayOfWeek = dow;
    scheduleJob(rule, scheduleReminder({ interaction, user_id }));

    return interaction.reply({
      content: `Added Reminder ${id}: ${parseTime(dow, h, m)}`,
      ephemeral: true
    });
  }
}
