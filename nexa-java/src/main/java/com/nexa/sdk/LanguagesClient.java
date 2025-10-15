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

public class LanguagesClient {
    private static final String DEFAULT_BASE_URL = "http://localhost:3005";

    private final String apiKey;
    private final String baseUrl;
    private final HttpClient http;
    private final ObjectMapper mapper;

    public LanguagesClient(String apiKey) {
        this(apiKey, null);
    }

    public LanguagesClient(String apiKey, String baseUrl) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = (baseUrl == null || baseUrl.isEmpty()) ? DEFAULT_BASE_URL : baseUrl.replaceAll("/+$", "");
        this.http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        this.mapper = new ObjectMapper();
    }

    public LanguagesResponse listLanguages(String voiceModelId) throws IOException, InterruptedException {
        String url = this.baseUrl + "/languages";
        if (voiceModelId != null && !voiceModelId.isEmpty()) {
            String query = "voice_model_id=" + URLEncoder.encode(voiceModelId, StandardCharsets.UTF_8);
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
        return mapper.readValue(resp.body(), LanguagesResponse.class);
    }

    public Language getLanguageById(String id) throws IOException, InterruptedException {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("id is required");
        }
        URI uri = URI.create(this.baseUrl + "/languages/" + URLEncoder.encode(id, StandardCharsets.UTF_8));
        HttpRequest req = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        ensureSuccess(resp);
        return mapper.readValue(resp.body(), Language.class);
    }

    private static void ensureSuccess(HttpResponse<String> resp) throws IOException {
        int code = resp.statusCode();
        if (code < 200 || code >= 300) {
            String body = resp.body();
            throw new IOException("Request failed (" + code + "): " + body);
        }
    }
}
