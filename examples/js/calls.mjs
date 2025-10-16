// Example usage for the JS SDK (Calls)
// Run: (PowerShell)
//   $env:NEXA_API_KEY='your_key'
//   $env:NEXA_ORGANIZATION_ID='org_xxx'
//   node examples/js/calls.mjs [callIdToGetOrNull] [createPhoneNumberOrNull]
// Note: build the JS SDK first: cd js && npm run build
import 'dotenv/config';

import { listCalls, createCall, getCallById } from "../../js/dist/calls.js";

const apiKey = process.env.NEXA_API_KEY || "";
const baseUrl = process.env.NEXA_BASE_URL || undefined;
const orgIdEnv = process.env.NEXA_ORGANIZATION_ID || "";

const callIdArg = process.argv[2] && process.argv[2] !== "null" ? process.argv[2] : undefined;
const phoneToCreate = process.argv[3] && process.argv[3] !== "null" ? process.argv[3] : undefined;

if (!apiKey) {
  console.error("NEXA_API_KEY is not set. Set it in your environment and retry.");
  process.exit(1);
}

// Log the Organization-Id being used (masked)
const maskedOrg = orgIdEnv ? `${orgIdEnv.slice(0, 6)}...${orgIdEnv.slice(-4)}` : "<not set>";
console.log(`Using NEXA_ORGANIZATION_ID from env: ${maskedOrg}`);

try {
  console.log("Listing calls (first page)");
  // Do not pass organizationId explicitly; SDK will read from env
  const list = await listCalls({ apiKey, baseUrl }, {});
  console.log(JSON.stringify(list, null, 2));

  if (phoneToCreate) {
    console.log(`\nCreating outbound call to: ${phoneToCreate}`);
    const created = await createCall(
      { apiKey, baseUrl },
      undefined,
      {
        phone_number: phoneToCreate,
        agent_id: process.env.NEXA_AGENT_ID || "agent_123",
        agent_version_number: process.env.NEXA_AGENT_VERSION ? Number(process.env.NEXA_AGENT_VERSION) : undefined,
        metadata: { source: "sdk-example", ts: Date.now() },
      }
    );
    console.log(JSON.stringify(created, null, 2));
  }

  if (callIdArg) {
    console.log(`\nFetching call by id: ${callIdArg}`);
    const one = await getCallById({ apiKey, baseUrl }, callIdArg);
    console.log(JSON.stringify(one, null, 2));
  }
} catch (err) {
  console.error("Error:", err?.message || err);
  process.exit(1);
}
