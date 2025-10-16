package com.nexa.sdk;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.HashMap;
import java.util.Map;

public class TestAgents2 {
    public static void main(String[] args) throws Exception {
        String apiKey = System.getenv("NEXA_API_KEY");
        String baseUrl = System.getenv("NEXA_BASE_URL");
        String orgId = System.getenv("NEXA_ORGANIZATION_ID");
        if (apiKey == null || apiKey.isEmpty()) throw new RuntimeException("NEXA_API_KEY is required");
        if (orgId == null || orgId.isEmpty()) throw new RuntimeException("NEXA_ORGANIZATION_ID is required");

        Agents2Client client = new Agents2Client(apiKey, baseUrl);

        Map<String, Object> create = new HashMap<>();
        create.put("title", "Customer Support Agent");
        Map<String, Object> language = new HashMap<>();
        language.put("id", "lng_en_us");
        Map<String, Object> langDetails = new HashMap<>();
        langDetails.put("name", "English");
        langDetails.put("code", "en-US");
        language.put("details", langDetails);
        create.put("language", language);
        Map<String, Object> llm = new HashMap<>();
        llm.put("id", "gpt-4o-mini");
        Map<String, Object> llmSettings = new HashMap<>();
        llmSettings.put("temperature", 0.1);
        llmSettings.put("structured_output", true);
        llm.put("settings", llmSettings);
        create.put("llm", llm);

        ApiResponse<JsonNode> created = client.createAgent(orgId, create);
        System.out.println("Created: " + created.getStatusCode());
        ObjectMapper mapper = new ObjectMapper();
        JsonNode normalized = normalizeAgentPayload(created.getData(), orgId);
        System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(normalized));

        ApiResponse<JsonNode> listed = client.listAgents(orgId);
        System.out.println("List: " + listed.getStatusCode());
        System.out.println(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(listed.getData()));

        String createdId = null;
        if (created.getData() != null) {
            JsonNode node = created.getData();
            if (node.has("id")) createdId = node.get("id").asText();
            else if (node.has("agent_id")) createdId = node.get("agent_id").asText();
            else if (node.has("_id")) createdId = node.get("_id").asText();
        }

        if (createdId != null) {
            ApiResponse<JsonNode> one = client.getAgentById(createdId, orgId);
            System.out.println("Get: " + one.getStatusCode());
            System.out.println(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(one.getData()));

            Map<String, Object> patch = new HashMap<>();
            patch.put("version_number", 1);
            patch.put("title", "Updated Title");
            ApiResponse<JsonNode> updated = client.updateAgent(createdId, orgId, patch);
            System.out.println("Updated: " + updated.getStatusCode());
            System.out.println(new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(updated.getData()));
        }
    }

    private static JsonNode normalizeAgentPayload(JsonNode data, String org) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            if (data == null) return null;
            if (data.isArray()) {
                ArrayNode arr = (ArrayNode) data;
                ObjectNode out = mapper.createObjectNode();
                String id = null;
                if (arr.size() > 0 && arr.get(0).isObject()) {
                    JsonNode first = arr.get(0);
                    if (first.hasNonNull("id")) id = first.get("id").asText();
                    else if (first.hasNonNull("agent_id")) id = first.get("agent_id").asText();
                    else if (first.hasNonNull("_id")) id = first.get("_id").asText();
                }
                out.put("id", id);
                out.put("organization_id", org);
                out.set("versions", arr);
                return out;
            }
            if (data.isObject()) {
                ObjectNode obj = (ObjectNode) data;
                if (obj.has("versions") && obj.get("versions").isArray()) {
                    return data; // already normalized
                }
                boolean looksLikeVersion = obj.has("number") || obj.has("title") || obj.has("llm");
                if (looksLikeVersion) {
                    String id = obj.hasNonNull("id") ? obj.get("id").asText() :
                            (obj.hasNonNull("agent_id") ? obj.get("agent_id").asText() :
                                    (obj.hasNonNull("_id") ? obj.get("_id").asText() : null));
                    String orgVal = obj.hasNonNull("organization_id") ? obj.get("organization_id").asText() : org;
                    ObjectNode out = mapper.createObjectNode();
                    out.put("id", id);
                    out.put("organization_id", orgVal);
                    ArrayNode versions = mapper.createArrayNode();
                    versions.add(obj);
                    out.set("versions", versions);
                    return out;
                }
            }
        } catch (Exception ignored) {}
        return data;
    }
}
