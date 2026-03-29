import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const identity = context.clientContext?.identity;
  const user = context.clientContext?.user;
  if (!identity || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const store = getStore("settings");
  const allowed = ["alert", "hours"];

  for (const key of allowed) {
    if (body[key] !== undefined) {
      await store.set(key, JSON.stringify(body[key]));
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const config = { path: "/api/save-settings" };
