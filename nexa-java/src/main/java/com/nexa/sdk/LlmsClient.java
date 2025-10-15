package com.nexa.sdk;

import com.fasterxml.jackson.core.type.TypeReference;
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
import java.util.List;
import java.util.Collections;

public class LlmsClient {
    private static final String DEFAULT_BASE_URL = "http://localhost:3005";

    private final String apiKey;
    private final String baseUrl;
    private final HttpClient http;
    private final ObjectMapper mapper;

    public LlmsClient(String apiKey) {
        this(apiKey, null);
    }

    public LlmsClient(String apiKey, String baseUrl) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = (baseUrl == null || baseUrl.isEmpty()) ? DEFAULT_BASE_URL : baseUrl.replaceAll("/+$", "");
        this.http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        this.mapper = new ObjectMapper();
    }

    public LlmsResponse listLlms(Integer page, Integer limit, String sortBy, String sortOrder) throws IOException, InterruptedException {
        StringBuilder url = new StringBuilder(this.baseUrl + "/llms");
        String sep = "?";
        if (page != null) { url.append(sep).append("page=").append(page); sep = "&"; }
        if (limit != null) { url.append(sep).append("limit=").append(limit); sep = "&"; }
        if (sortBy != null && !sortBy.isEmpty()) { url.append(sep).append("sortBy=").append(URLEncoder.encode(sortBy, StandardCharsets.UTF_8)); sep = "&"; }
        if (sortOrder != null && !sortOrder.isEmpty()) { url.append(sep).append("sortOrder=").append(URLEncoder.encode(sortOrder, StandardCharsets.UTF_8)); }

        URI uri = URI.create(url.toString());
        HttpRequest req = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        ensureSuccess(resp);
        String body = resp.body();

        // Normalize: accept array or object with 'llms'
        JsonNode node = mapper.readTree(body);
        if (node.isArray()) {
            List<Llm> items = mapper.readValue(body, new TypeReference<List<Llm>>(){});
            LlmsResponse out = new LlmsResponse();
            out.setLlms(items);
            return out;
        }
        // Otherwise, try object mapping
        return mapper.readValue(body, LlmsResponse.class);
    }

    public List<Llm> listLlmsArray(Integer page, Integer limit, String sortBy, String sortOrder) throws IOException, InterruptedException {
        LlmsResponse r = listLlms(page, limit, sortBy, sortOrder);
        return r.getLlms() == null ? Collections.emptyList() : r.getLlms();
    }

    public Llm getLlmById(int id) throws IOException, InterruptedException {
        URI uri = URI.create(this.baseUrl + "/llms/" + URLEncoder.encode(String.valueOf(id), StandardCharsets.UTF_8));
        HttpRequest req = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Accept", "application/json")
                .GET()
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        ensureSuccess(resp);
        return mapper.readValue(resp.body(), Llm.class);
    }

    private static void ensureSuccess(HttpResponse<String> resp) throws IOException {
        int code = resp.statusCode();
        if (code < 200 || code >= 300) {
            String body = resp.body();
            throw new IOException("Request failed (" + code + "): " + body);
        }
    }
}
