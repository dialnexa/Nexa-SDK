// Example usage for the JS Voices SDK
// Run: (PowerShell)
//   $env:NEXA_API_KEY='your_key'
//   node examples/js/voices.mjs [voiceId]
// Optional filters via env vars: NEXA_PROVIDER_NAME, NEXA_ACCENT, NEXA_GENDER, NEXA_VOICE_NAME, NEXA_PAGE, NEXA_LIMIT
// Note: build the JS SDK first: cd js && npm run build
import 'dotenv/config';

import { listVoices, getVoiceById } from "../../js/dist/voices.js";

const apiKey = process.env.NEXA_API_KEY || "";
const baseUrl = process.env.NEXA_BASE_URL || undefined;

const provider_name = process.env.NEXA_PROVIDER_NAME || undefined;
const accent = process.env.NEXA_ACCENT || undefined;
const gender = process.env.NEXA_GENDER || undefined;
const name = process.env.NEXA_VOICE_NAME || undefined;
const page = process.env.NEXA_PAGE ? Number(process.env.NEXA_PAGE) : undefined;
const limit = process.env.NEXA_LIMIT ? Number(process.env.NEXA_LIMIT) : undefined;

const voiceId = process.argv[2] && process.argv[2] !== "null" ? process.argv[2] : undefined;

if (!apiKey) {
  console.error("NEXA_API_KEY is not set. Set it in your environment and retry.");
  process.exit(1);
}

try {
  console.log("Listing voices with filters:", { provider_name, accent, gender, name, page, limit });
  const list = await listVoices({ apiKey, baseUrl, provider_name, accent, gender, name, page, limit });
  console.log(JSON.stringify(list, null, 2));

  if (voiceId) {
    console.log(`\nFetching voice by id: ${voiceId}`);
    const one = await getVoiceById({ apiKey, baseUrl, id: voiceId });
    console.log(JSON.stringify(one, null, 2));
  }
} catch (err) {
  console.error("Error:", err?.message || err);
  process.exit(1);
}

