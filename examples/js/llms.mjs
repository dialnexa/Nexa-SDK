// Example usage for the JS SDK (LLMs)
// Run: (PowerShell)
//   $env:NEXA_API_KEY='your_key'
//   node examples/js/llms.mjs [page] [limit] [sortBy] [sortOrder] [id]
// Note: build the JS SDK first: cd js && npm run build
import 'dotenv/config';

import { listLlmsArray, getLlmById } from "../../js/dist/llms.js";

const apiKey = process.env.NEXA_API_KEY || "";
const baseUrl = process.env.NEXA_BASE_URL || undefined;

const page = process.argv[2] && process.argv[2] !== "null" ? Number(process.argv[2]) : undefined;
const limit = process.argv[3] && process.argv[3] !== "null" ? Number(process.argv[3]) : undefined;
const sortBy = process.argv[4] && process.argv[4] !== "null" ? process.argv[4] : undefined;
const sortOrder = process.argv[5] && process.argv[5] !== "null" ? process.argv[5] : undefined;
const id = process.argv[6] && process.argv[6] !== "null" ? Number(process.argv[6]) : undefined;

if (!apiKey) {
  console.error("NEXA_API_KEY is not set. Set it in your environment and retry.");
  process.exit(1);
}

try {
  const list = await listLlmsArray({ apiKey, baseUrl, page, limit, sortBy, sortOrder });
  console.log(JSON.stringify(list, null, 2));

  if (id !== undefined) {
    console.log(`\nFetching LLM by id: ${id}`);
    const one = await getLlmById({ apiKey, baseUrl, id });
    console.log(JSON.stringify(one, null, 2));
  }
} catch (err) {
  console.error("Error:", err?.message || err);
  process.exit(1);
}
