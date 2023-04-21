import "knex";

declare module "knex/types/tables" {
  interface Log {
    message_timestamp: bigint;
    message_suffix: bigint;
    channel_id: string;
    user_id: string;
  }

  interface Tables {
    log: Log;
  }
}
