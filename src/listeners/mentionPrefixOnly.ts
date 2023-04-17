import type { Events } from "@sapphire/framework";
import type { Message } from "discord.js";

import { Listener } from "@sapphire/framework";

export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
  public async run(message: Message) {
    const prefix = this.container.client.options.defaultPrefix;
    if (typeof prefix === "string")
      return message.channel.send(`My prefix in this guild is: \`${prefix}\``);
    else if (prefix instanceof Array)
      return message.channel.send(
        `My prefixes in this guild are: ${prefix.map((p) => `\`${p}\``).join(", ")}`
      );
    else return message.channel.send("Cannot find any Prefix for Message Commands.");
  }
}
