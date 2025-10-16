import 'dotenv/config';
import { createAgent2, listAgents2, getAgent2ById, updateAgent2 } from "../../js/dist/agents2.js";

const apiKey = process.env.NEXA_API_KEY;
const baseUrl = process.env.NEXA_BASE_URL;
const xOrg = process.env.NEXA_ORGANIZATION_ID;

if (!apiKey) throw new Error("NEXA_API_KEY is required");
if (!xOrg) throw new Error("NEXA_ORGANIZATION_ID is required");

// Create
const createBody = {
  title: "Customer Support Agent",
  language: { id: null, details: { name: "", code: "en-" } },
  prompts: { prompt_text: "Hello, how can I assist you today?", conversation_start_type: "user", allow_interruptions: true },
  // llm: { id: "", settings: { temperature: 0.1, structured_output: true } },
};

function toVersionsArray(data) {
  try {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      if (Array.isArray(data.versions)) return data.versions;
      const looksLikeVersion = Object.prototype.hasOwnProperty.call(data, 'number') ||
        Object.prototype.hasOwnProperty.call(data, 'title') ||
        Object.prototype.hasOwnProperty.call(data, 'llm');
      if (looksLikeVersion) return [data];
    }
  } catch (_) {}
  return data;
}

const created = await createAgent2({ apiKey, baseUrl }, xOrg, createBody);
console.log("Created:", created.statusCode);
console.log(JSON.stringify(toVersionsArray(created.data), null, 2));

// List
const listed = await listAgents2({ apiKey, baseUrl }, xOrg);
console.log("List:", listed.statusCode);
console.log(JSON.stringify(listed.data, null, 2));

// Get one (by created id if present)
const createdId = created?.data?.id || created?.data?.agent_id || created?.data?._id;
if (createdId) {
  const one = await getAgent2ById({ apiKey, baseUrl }, createdId, xOrg);
  console.log("Get:", one.statusCode);
  console.log(JSON.stringify(one.data, null, 2));

  // Update
  const updated = await updateAgent2({ apiKey, baseUrl }, createdId, xOrg, {
    version_number: 1,
    title: "Updated Title",
    prompts: { prompt_text: "Updated greeting message", allow_interruptions: false },
  });
  console.log("Updated:", updated.statusCode);
  console.log(JSON.stringify(updated.data, null, 2));
}
