// Example usage for the JS SDK
// Run: (PowerShell)
//   $env:NEXA_API_KEY='your_key'
//   node examples/js/languages.mjs [voiceModelId] [languageId]
// Note: build the JS SDK first: cd js && npm run build
import 'dotenv/config';

import { listLanguages, getLanguageById } from "../../js/dist/languages.js";

const apiKey = process.env.NEXA_API_KEY || "";
const baseUrl = process.env.NEXA_BASE_URL || undefined;
const voiceModelId = process.argv[2] && process.argv[2] !== "null" ? process.argv[2] : undefined;
const languageId = process.argv[3] && process.argv[3] !== "null" ? process.argv[3] : undefined;

if (!apiKey) {
  console.error("NEXA_API_KEY is not set. Set it in your environment and retry.");
  process.exit(1);
}

try {
  console.log("Listing languages", voiceModelId ? `(filtered by ${voiceModelId})` : "(all)");
  const list = await listLanguages({ apiKey, baseUrl, voiceModelId });
  console.log(JSON.stringify(list, null, 2));

  if (languageId) {
    console.log(`\nFetching language by id: ${languageId}`);
    const one = await getLanguageById({ apiKey, baseUrl, id: languageId });
    console.log(JSON.stringify(one, null, 2));
  }
} catch (err) {
  console.error("Error:", err?.message || err);
  process.exit(1);
}

