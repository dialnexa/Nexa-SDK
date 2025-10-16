package com.nexa.sdk;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.HashMap;
import java.util.Map;

public class TestCalls {
    public static void main(String[] args) {
        try {
            String apiKey = System.getenv("NEXA_API_KEY");
            String baseUrl = System.getenv("NEXA_BASE_URL");
            String orgId = System.getenv("NEXA_ORGANIZATION_ID");
            if (apiKey == null || apiKey.isEmpty()) {
                System.err.println("NEXA_API_KEY is not set.");
                return;
            }
            if (orgId == null || orgId.isEmpty()) {
                System.err.println("NEXA_ORGANIZATION_ID is not set.");
                return;
            }

            CallsClient client = (baseUrl == null || baseUrl.isEmpty())
                    ? new CallsClient(apiKey)
                    : new CallsClient(apiKey, baseUrl);

            // List calls
            JsonNode list = client.listCalls(orgId, null, null, null, null);
            System.out.println(list);

            // Optionally create a call if phone passed as first arg
            if (args.length > 0 && args[0] != null && !args[0].isEmpty() && !"null".equalsIgnoreCase(args[0])) {
                String phone = args[0];
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("source", "sdk-example");
                metadata.put("ts", System.currentTimeMillis());
                String agentId = System.getenv().getOrDefault("NEXA_AGENT_ID", "agent_123");
                Integer agentVersion = null;
                try {
                    String av = System.getenv("NEXA_AGENT_VERSION");
                    if (av != null && !av.isEmpty()) agentVersion = Integer.parseInt(av);
                } catch (Exception ignored) {}
                CallCreateResponse created = client.createCall(orgId, phone, agentId, agentVersion, metadata);
                System.out.println("call_id=" + created.getCallId());
            }

            // Optionally get by id if second arg present
            if (args.length > 1 && args[1] != null && !args[1].isEmpty() && !"null".equalsIgnoreCase(args[1])) {
                String callId = args[1];
                JsonNode one = client.getCallById(callId);
                System.out.println(one);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
