import { Client } from "pg";

export async function handler() {
  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const res = await client.query(
    "SELECT messages.id, users.username, messages.text, messages.created_at \
     FROM messages JOIN users ON messages.user_id = users.id \
     ORDER BY messages.created_at ASC"
  );

  await client.end();

  return {
    statusCode: 200,
    body: JSON.stringify(res.rows)
  };
}