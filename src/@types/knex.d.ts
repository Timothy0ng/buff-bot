import "knex";

declare module "knex/types/tables" {
  interface Log {
    id: string;
    user_id: string;
    channel_id: string;
    message_id: string;
  }

  interface Tables {
    log: Log;
  }
}
