// Example usage for Batch Calls (JS)
// PowerShell:
//   $env:NEXA_API_KEY='your_key'
//   $env:NEXA_ORGANIZATION_ID='encrypted_org_id_base64_string'
//   node examples/js/batch-calls.mjs path/to/leads.csv "My Campaign" agent_123 1
import 'dotenv/config';
import { createBatchCalls } from "../../js/dist/batchCalls.js";
import fs from 'fs';

const apiKey = process.env.NEXA_API_KEY || "";
const baseUrl = process.env.NEXA_BASE_URL || undefined;
const xOrg = process.env.NEXA_ORGANIZATION_ID || "";

const filePath = process.argv[2];
const title = process.argv[3];
const agentId = process.argv[4];
const agentVersionNumber = Number(process.argv[5]);

if (!apiKey) {
  console.error("NEXA_API_KEY is not set");
  process.exit(1);
}
if (!xOrg) {
  console.error("NEXA_ORGANIZATION_ID is not set");
  process.exit(1);
}
if (!filePath || !title || !agentId || !Number.isFinite(agentVersionNumber)) {
  console.error("Usage: node examples/js/batch-calls.mjs <file_path> <title> <agent_id> <agent_version_number>");
  process.exit(1);
}

// Use a ReadStream for Node to ensure proper multipart handling
const stream = fs.createReadStream(filePath);

try {
  const resp = await createBatchCalls({
    apiKey,
    xOrganizationId: xOrg,
    file: stream,
    filename: filePath.split(/[/\\]/).pop(),
    title,
    agentId,
    agentVersionNumber,
    baseUrl,
  });
  console.log(JSON.stringify(resp, null, 2));
} catch (err) {
  console.error("Error:", err?.message || err);
  process.exit(1);
}
