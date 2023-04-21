import { db } from ".";

(async function () {
  const has_log = await db.schema.hasTable("log");

  if (!has_log) {
    await db.schema.createTable("log", function (t) {
      t.bigInteger("message_timestamp").notNullable();
      t.bigInteger("message_suffix").notNullable();
      t.string("user_id").notNullable();
      t.string("channel_id").notNullable();
      t.primary(["message_timestamp", "message_suffix"]);
    });
  }
})();
