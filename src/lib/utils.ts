import type { APIUser, Guild, User } from "discord.js";

import {
  type ChatInputCommandSuccessPayload,
  type Command,
  type ContextMenuCommandSuccessPayload,
  type MessageCommandSuccessPayload,
  container
} from "@sapphire/framework";
import { cyan } from "colorette";

import { DOW_MAPPING } from "./constants";

export function logSuccessCommand(
  payload:
    | ContextMenuCommandSuccessPayload
    | ChatInputCommandSuccessPayload
    | MessageCommandSuccessPayload
): void {
  let successLoggerData: ReturnType<typeof getSuccessLoggerData>;

  if ("interaction" in payload) {
    successLoggerData = getSuccessLoggerData(
      payload.interaction.guild,
      payload.interaction.user,
      payload.command
    );
  } else {
    successLoggerData = getSuccessLoggerData(
      payload.message.guild,
      payload.message.author,
      payload.command
    );
  }

  container.logger.debug(
    `${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`
  );
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
  const shard = getShardInfo(guild?.shardId ?? 0);
  const commandName = getCommandInfo(command);
  const author = getAuthorInfo(user);
  const sentAt = getGuildInfo(guild);

  return { shard, commandName, author, sentAt };
}

function getShardInfo(id: number) {
  return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
  return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
  return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
  if (guild === null) return "Direct Messages";
  return `${guild.name}[${cyan(guild.id)}]`;
}

export function assertType<T>(_: unknown): asserts _ is T {
  //
}

function pad2Zero(num: number) {
  return num.toString().padStart(2, "0");
}
export function parseTime(dow: BuffBot.DayOfWeek, h: number, m: number) {
  return `\`${DOW_MAPPING[dow]} ${pad2Zero(h)}:${pad2Zero(m)}\``;
}
