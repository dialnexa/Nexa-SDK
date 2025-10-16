package com.nexa.sdk;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class CallsClient {
    private static final String DEFAULT_BASE_URL = "http://localhost:3005";

    private final String apiKey;
    private final String baseUrl;
    private final HttpClient http;
    private final ObjectMapper mapper;

    public CallsClient(String apiKey) { this(apiKey, null); }

    public CallsClient(String apiKey, String baseUrl) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = (baseUrl == null || baseUrl.isEmpty()) ? DEFAULT_BASE_URL : baseUrl.replaceAll("/+$", "");
        this.http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        this.mapper = new ObjectMapper();
    }

    private static String buildUrl(String baseUrl, String path, Map<String, String> query) {
        StringBuilder sb = new StringBuilder();
        sb.append(baseUrl);
        if (!path.startsWith("/")) sb.append('/');
        sb.append(path);
        if (query != null && !query.isEmpty()) {
            String qs = query.entrySet().stream()
                    .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                    .map(e -> URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8) + "=" +
                              URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                    .collect(Collectors.joining("&"));
            if (!qs.isEmpty()) {
                sb.append("?").append(qs);
            }
        }
        return sb.toString();
    }

    private static Map<String, String> flattenHeaders(HttpResponse<?> resp) {
        Map<String, String> out = new HashMap<>();
        resp.headers().map().forEach((k, v) -> out.put(k, v == null ? null : String.join(", ", v)));
        return out;
    }

    public JsonNode listCalls(String organizationId, String agentId, String callId, String batchCallId, String from)
            throws IOException, InterruptedException {
        // Resolve org id directly from env if not provided
        if (organizationId == null || organizationId.isEmpty()) {
            String envOrg = System.getenv("NEXA_ORGANIZATION_ID");
            organizationId = (envOrg != null && !envOrg.isEmpty()) ? envOrg : null;
        }
        if (organizationId == null || organizationId.isEmpty()) {
            throw new IllegalArgumentException("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
        }
        Map<String, String> q = new HashMap<>();
        if (agentId != null) q.put("agent_id", agentId);
        if (callId != null) q.put("call_id", callId);
        if (batchCallId != null) q.put("batch_call_id", batchCallId);
        if (from != null) q.put("from", from);
        String url = buildUrl(this.baseUrl, "/calls", q);
        URI uri = URI.create(url);
        HttpRequest req = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .header("Organization-Id", organizationId)
                .header("X-Organization-Id", organizationId)
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        int code = resp.statusCode();
        String body = resp.body();
        if (code < 200 || code >= 300) {
            throw new IOException("Calls list failed (" + code + "): " + body);
        }
        return body != null && !body.isEmpty() ? mapper.readTree(body) : null;
    }

    public CallCreateResponse createCall(String organizationId, String phoneNumber, String agentId,
                                                      Integer agentVersionNumber, Map<String, Object> metadata)
            throws IOException, InterruptedException {
        if (organizationId == null || organizationId.isEmpty()) {
            String envOrg = System.getenv("NEXA_ORGANIZATION_ID");
            organizationId = (envOrg != null && !envOrg.isEmpty()) ? envOrg : null;
        }
        if (organizationId == null || organizationId.isEmpty()) {
            throw new IllegalArgumentException("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
        }
        if (phoneNumber == null || phoneNumber.isEmpty()) throw new IllegalArgumentException("phone_number is required");
        if (agentId == null || agentId.isEmpty()) throw new IllegalArgumentException("agent_id is required");
        if (metadata == null) throw new IllegalArgumentException("metadata is required");

        Map<String, Object> body = new HashMap<>();
        body.put("phone_number", phoneNumber);
        body.put("agent_id", agentId);
        body.put("metadata", metadata);
        if (agentVersionNumber != null) body.put("agent_version_number", agentVersionNumber);

        String url = this.baseUrl + "/calls";
        HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .header("Organization-Id", organizationId)
                .header("X-Organization-Id", organizationId)
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        int code = resp.statusCode();
        String b = resp.body();
        if (code < 200 || code >= 300) {
            throw new IOException("Create call failed (" + code + "): " + b);
        }
        return mapper.readValue(b, CallCreateResponse.class);
    }

    public JsonNode getCallById(String id) throws IOException, InterruptedException {
        if (id == null || id.isEmpty()) throw new IllegalArgumentException("id is required");
        String url = this.baseUrl + "/calls/" + URLEncoder.encode(id, StandardCharsets.UTF_8);
        HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        int code = resp.statusCode();
        String body = resp.body();
        if (code < 200 || code >= 300) {
            throw new IOException("Get call failed (" + code + "): " + body);
        }
        return body != null && !body.isEmpty() ? mapper.readTree(body) : null;
    }
}
