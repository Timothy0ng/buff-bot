import { Subcommand } from "@kaname-png/plugin-subcommands-advanced";

export const REMINDERS = "reminders";

export class ParentCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: REMINDERS,
      description: "Commands for Exercise Reminders",
      preconditions: []
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      builder.setName(this.name).setDescription(this.description);

      this.hooks.subcommands(this, builder);

      return builder;
    });
  }
}
