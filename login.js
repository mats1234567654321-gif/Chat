import { Client } from "pg";
import bcrypt from "bcryptjs";

export async function handler(event) {
  const { username, password } = JSON.parse(event.body);

  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const res = await client.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  await client.end();

  if (res.rows.length === 0) {
    return { statusCode: 401, body: "Nutzer nicht gefunden" };
  }

  const user = res.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return { statusCode: 401, body: "Falsches Passwort" };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ id: user.id, role: user.role })
  };
}