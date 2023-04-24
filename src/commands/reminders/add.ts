import type { GuildTextBasedChannel } from "discord.js";

import { Command, RegisterSubCommand } from "@kaname-png/plugin-subcommands-advanced";
import { RecurrenceRule, scheduleJob } from "node-schedule";

import { db } from "../../db";
import { assertType } from "../../lib/utils";

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

    const [dow_str, hhmm] = time.split(" ") as [DayOfWeek, HhMm];
    const dow = dow_mapping[dow_str.toLowerCase() as DayOfWeek];
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
      content: `Reminder \`${id}\` added for \`${time}\``,
      ephemeral: true
    });
  }
}
