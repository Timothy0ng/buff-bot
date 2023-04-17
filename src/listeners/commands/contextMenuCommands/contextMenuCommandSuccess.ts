import type { Logger } from "@sapphire/plugin-logger";

import { type ContextMenuCommandSuccessPayload, Listener, LogLevel } from "@sapphire/framework";

import { logSuccessCommand } from "../../../lib/utils";

export class UserListener extends Listener {
  public run(payload: ContextMenuCommandSuccessPayload) {
    logSuccessCommand(payload);
  }

  public override onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
