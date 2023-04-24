import { db } from ".";

(async function () {
  const has_log = await db.schema.hasTable("log");

  if (!has_log) {
    await db.schema.createTable("log", function (t) {
      t.string("id").primary().notNullable();
      t.string("user_id").notNullable();
      t.string("channel_id").notNullable();
      t.string("message_id").notNullable();
    });
  }
})();
