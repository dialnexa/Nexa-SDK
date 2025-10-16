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

public class Agents2Client {
    private static final String DEFAULT_BASE_URL = "http://localhost:3005";

    private final String apiKey;
    private final String baseUrl;
    private final HttpClient http;
    private final ObjectMapper mapper;

    public Agents2Client(String apiKey) { this(apiKey, null); }

    public Agents2Client(String apiKey, String baseUrl) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = (baseUrl == null || baseUrl.isEmpty()) ? DEFAULT_BASE_URL : baseUrl.replaceAll("/+$", "");
        this.http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        this.mapper = new ObjectMapper();
    }

    private static Map<String, String> flatHeaders(HttpResponse<?> resp) {
        Map<String, String> out = new HashMap<>();
        resp.headers().map().forEach((k, v) -> out.put(k, v == null ? null : String.join(", ", v)));
        return out;
    }

    private static String requireOrg(String org) {
        if (org == null || org.isEmpty()) {
            String env = System.getenv("NEXA_ORGANIZATION_ID");
            org = (env != null && !env.isEmpty()) ? env : null;
        }
        if (org == null || org.isEmpty()) {
            throw new IllegalArgumentException("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
        }
        return org;
    }

    public ApiResponse<JsonNode> createAgent(String organizationId, Map<String, Object> body) throws IOException, InterruptedException {
        String org = requireOrg(organizationId);
        if (body == null) throw new IllegalArgumentException("body is required");

        String url = this.baseUrl + "/agents2";
        HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .header("Organization-Id", org)
                .header("X-Organization-Id", org)
                .header("x-organization-id", org)
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        int code = resp.statusCode();
        String b = resp.body();
        if (code < 200 || code >= 300) {
            throw new IOException("Agents2 create failed (" + code + "): " + b);
        }
        JsonNode data = (b != null && !b.isEmpty()) ? mapper.readTree(b) : null;
        return new ApiResponse<>(code, flatHeaders(resp), data);
    }

    public ApiResponse<JsonNode> listAgents(String organizationId) throws IOException, InterruptedException {
        String org = requireOrg(organizationId);
        String url = this.baseUrl + "/agents2";
        HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .header("Organization-Id", org)
                .header("X-Organization-Id", org)
                .header("x-organization-id", org)
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        int code = resp.statusCode();
        String b = resp.body();
        if (code < 200 || code >= 300) {
            throw new IOException("Agents2 list failed (" + code + "): " + b);
        }
        JsonNode data = (b != null && !b.isEmpty()) ? mapper.readTree(b) : null;
        return new ApiResponse<>(code, flatHeaders(resp), data);
    }

    public ApiResponse<JsonNode> getAgentById(String id, String organizationId) throws IOException, InterruptedException {
        if (id == null || id.isEmpty()) throw new IllegalArgumentException("id is required");
        String org = requireOrg(organizationId);
        String url = this.baseUrl + "/agents2/" + URLEncoder.encode(id, StandardCharsets.UTF_8);
        HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .header("Organization-Id", org)
                .header("X-Organization-Id", org)
                .header("x-organization-id", org)
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        int code = resp.statusCode();
        String b = resp.body();
        if (code < 200 || code >= 300) {
            throw new IOException("Agents2 get failed (" + code + "): " + b);
        }
        JsonNode data = (b != null && !b.isEmpty()) ? mapper.readTree(b) : null;
        return new ApiResponse<>(code, flatHeaders(resp), data);
    }

    public ApiResponse<JsonNode> updateAgent(String id, String organizationId, Map<String, Object> body) throws IOException, InterruptedException {
        if (id == null || id.isEmpty()) throw new IllegalArgumentException("id is required");
        String org = requireOrg(organizationId);
        if (body == null) throw new IllegalArgumentException("body is required");
        String url = this.baseUrl + "/agents2/" + URLEncoder.encode(id, StandardCharsets.UTF_8);
        HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .header("Organization-Id", org)
                .header("X-Organization-Id", org)
                .header("x-organization-id", org)
                .method("PATCH", HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        int code = resp.statusCode();
        String b = resp.body();
        if (code < 200 || code >= 300) {
            throw new IOException("Agents2 update failed (" + code + "): " + b);
        }
        JsonNode data = (b != null && !b.isEmpty()) ? mapper.readTree(b) : null;
        return new ApiResponse<>(code, flatHeaders(resp), data);
    }
}

