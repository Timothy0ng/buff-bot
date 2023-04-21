import "knex";

declare module "knex/types/tables" {
  interface Log {
    message_timestamp: string;
    message_suffix: string;
    channel_id: string;
    user_id: string;
  }

  interface Tables {
    log: Log;
  }
}
