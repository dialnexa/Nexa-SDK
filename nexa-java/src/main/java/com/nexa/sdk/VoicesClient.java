package com.nexa.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.StringJoiner;

public class VoicesClient {
    private static final String DEFAULT_BASE_URL = "http://localhost:3005";

    private final String apiKey;
    private final String baseUrl;
    private final HttpClient http;
    private final ObjectMapper mapper;

    public VoicesClient(String apiKey) { this(apiKey, null); }

    public VoicesClient(String apiKey, String baseUrl) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = (baseUrl == null || baseUrl.isEmpty()) ? DEFAULT_BASE_URL : baseUrl.replaceAll("/+$$", "");
        this.http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        this.mapper = new ObjectMapper();
    }

    public VoicesResponse listVoices(
            String providerName,
            String accent,
            String gender,
            String name,
            Integer page,
            Integer limit
    ) throws IOException, InterruptedException {
        String url = this.baseUrl + "/voices";
        String query = buildQuery(new LinkedHashMap<>() {{
            put("provider_name", providerName);
            put("accent", accent);
            put("gender", gender);
            put("name", name);
            put("page", page);
            put("limit", limit);
        }});
        if (!query.isEmpty()) {
            url = url + "?" + query;
        }

        URI uri = URI.create(url);
        HttpRequest req = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        ensureSuccess(resp);
        return mapper.readValue(resp.body(), VoicesResponse.class);
    }

    public Voice getVoiceById(String id) throws IOException, InterruptedException {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("id is required");
        }
        URI uri = URI.create(this.baseUrl + "/voices/" + URLEncoder.encode(id, StandardCharsets.UTF_8));
        HttpRequest req = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        ensureSuccess(resp);
        return mapper.readValue(resp.body(), Voice.class);
    }

    private static String buildQuery(Map<String, ?> params) {
        StringJoiner joiner = new StringJoiner("&");
        for (Map.Entry<String, ?> e : params.entrySet()) {
            Object v = e.getValue();
            if (v == null) continue;
            String val = String.valueOf(v);
            if (val.isEmpty()) continue;
            joiner.add(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8) + "=" +
                    URLEncoder.encode(val, StandardCharsets.UTF_8));
        }
        return joiner.toString();
    }

    private static void ensureSuccess(HttpResponse<String> resp) throws IOException {
        int code = resp.statusCode();
        if (code < 200 || code >= 300) {
            String body = resp.body();
            throw new IOException("Request failed (" + code + "): " + body);
        }
    }
}

