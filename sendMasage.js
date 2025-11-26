import { Client } from "pg";

export async function handler(event) {
  const { userId, text } = JSON.parse(event.body);

  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  await client.query(
    "INSERT INTO messages (user_id, text) VALUES ($1, $2)",
    [userId, text]
  );

  await client.end();

  return { statusCode: 200, body: "Nachricht gespeichert" };
}