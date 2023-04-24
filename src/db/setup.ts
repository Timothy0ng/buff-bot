import { db } from ".";

async function setupLog() {
  const has_log = await db.schema.hasTable("log");

  if (!has_log) {
    await db.schema.createTable("log", function (t) {
      t.string("id").primary().notNullable();
      t.string("user_id").notNullable();
      t.string("channel_id").notNullable();
      t.string("message_id").notNullable();
    });
  }
}

async function setupReminder() {
  const has_reminder = await db.schema.hasTable("reminder");

  if (!has_reminder) {
    await db.schema.createTable("reminder", function (t) {
      t.increments("id").unsigned();
      t.string("user_id").notNullable();
      t.string("guild_id").notNullable();
      t.tinyint("dow").unsigned().notNullable();
      t.tinyint("h").unsigned().notNullable();
      t.tinyint("m").unsigned().notNullable();
    });
  }
}

Promise.all([setupLog(), setupReminder()]);
