import { createHmac } from "crypto";

function makeToken(secret) {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  const payload = String(expires);
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return payload + "." + sig;
}

export function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  if (sig !== expected) return false;
  if (Date.now() > Number(payload)) return false;
  return true;
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { user, pass } = await req.json();
  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASS;
  const secret = process.env.ADMIN_SECRET;

  if (!validUser || !validPass || !secret) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (user === validUser && pass === validPass) {
    return new Response(JSON.stringify({ token: makeToken(secret) }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Nesprávné přihlašovací údaje" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/auth" };
