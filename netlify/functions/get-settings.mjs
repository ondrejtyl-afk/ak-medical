import { getStore } from "@netlify/blobs";

const DEFAULTS = {
  alert: { show: false, text: "" },
  hours: {
    days: [
      { day: "Pondělí", hours: "12:00 – 18:00", note: "18:00 – 19:00 (pouze telefonicky a e-mailem)" },
      { day: "Úterý", hours: "8:00 – 13:00", note: "13:00 – 14:00 (pouze telefonicky a e-mailem)" },
      { day: "Středa", hours: "8:00 – 13:00", note: "13:00 – 14:00 (pouze telefonicky a e-mailem)" },
      { day: "Čtvrtek", hours: "8:00 – 13:00", note: "13:00 – 14:00 (pouze telefonicky a e-mailem)" },
      { day: "Pátek", hours: "8:00 – 13:00", note: "13:00 – 14:00 (pouze telefonicky a e-mailem)" },
    ],
    footnote: "* Pouze telefonické a e-mailové konzultace",
    validFrom: "Platná od 1. 4. 2026",
  },
};

export default async (req) => {
  const store = getStore("settings");
  const keys = ["alert", "hours"];
  const result = {};

  for (const key of keys) {
    const raw = await store.get(key);
    result[key] = raw ? JSON.parse(raw) : DEFAULTS[key];
  }

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "CDN-Cache-Control": "no-store",
      "Netlify-CDN-Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const config = { path: "/api/settings" };
