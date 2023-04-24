import "knex";

declare module "knex/types/tables" {
  interface Log {
    id: string;
    user_id: string;
    channel_id: string;
    message_id: string;
  }

  interface Reminder {
    id: number;
    user_id: string;
    guild_id: string;
    dow: number;
    h: number;
    m: number;
  }

  interface Tables {
    log: Log;
    reminder: Reminder;
  }
}
