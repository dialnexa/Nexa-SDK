package com.nexa.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

public class BatchCallsClient {
    private static final String DEFAULT_BASE_URL = "http://localhost:3005";

    private final String apiKey;
    private final String baseUrl;
    private final HttpClient http;
    private final ObjectMapper mapper;

    public BatchCallsClient(String apiKey) { this(apiKey, null); }

    public BatchCallsClient(String apiKey, String baseUrl) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = (baseUrl == null || baseUrl.isEmpty()) ? DEFAULT_BASE_URL : baseUrl.replaceAll("/+$", "");
        this.http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        this.mapper = new ObjectMapper();
    }

    public BatchCallsResponse createBatchCalls(
            File file,
            String title,
            String agentId,
            int agentVersionNumber,
            String xOrganizationId
    ) throws IOException, InterruptedException {
        if (file == null || !file.isFile()) throw new IllegalArgumentException("file must be a valid file");
        if (title == null || title.isEmpty()) throw new IllegalArgumentException("title is required");
        if (agentId == null || agentId.isEmpty()) throw new IllegalArgumentException("agentId is required");
        if (agentVersionNumber < 0) throw new IllegalArgumentException("agentVersionNumber must be >= 0");
        if (xOrganizationId == null || xOrganizationId.isEmpty()) throw new IllegalArgumentException("xOrganizationId is required");

        String boundary = "----NexaSDKBoundary" + UUID.randomUUID();
        byte[] body = buildMultipartBody(boundary, Map.of(
                "title", title,
                "agent_id", agentId,
                "agent_version_number", String.valueOf(agentVersionNumber)
        ), file);

        HttpRequest req = HttpRequest.newBuilder(URI.create(this.baseUrl + "/batch-calls"))
                .timeout(Duration.ofSeconds(60))
                .header("Authorization", "Bearer " + this.apiKey)
                .header("x-organization-id", xOrganizationId)
                .header("Accept", "application/json")
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                .build();

        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        ensureSuccess(resp);
        return mapper.readValue(resp.body(), BatchCallsResponse.class);
    }

    private static void ensureSuccess(HttpResponse<String> resp) throws IOException {
        int code = resp.statusCode();
        if (code < 200 || code >= 300) {
            throw new IOException("Request failed (" + code + "): " + resp.body());
        }
    }

    private static byte[] buildMultipartBody(String boundary, Map<String, String> fields, File file) throws IOException {
        String CRLF = "\r\n";
        StringBuilder sb = new StringBuilder();
        // Text fields
        for (Map.Entry<String, String> e : fields.entrySet()) {
            sb.append("--").append(boundary).append(CRLF)
              .append("Content-Disposition: form-data; name=\"").append(escapeQuotes(e.getKey())).append("\"").append(CRLF)
              .append(CRLF)
              .append(e.getValue()).append(CRLF);
        }
        // File field
        String filename = file.getName();
        String contentType = guessContentType(filename);
        sb.append("--").append(boundary).append(CRLF)
          .append("Content-Disposition: form-data; name=\"file\"; filename=\"").append(escapeQuotes(filename)).append("\"").append(CRLF)
          .append("Content-Type: ").append(contentType).append(CRLF)
          .append(CRLF);

        byte[] header = sb.toString().getBytes(StandardCharsets.UTF_8);
        byte[] fileBytes = Files.readAllBytes(file.toPath());
        byte[] footer = (CRLF + "--" + boundary + "--" + CRLF).getBytes(StandardCharsets.UTF_8);

        byte[] out = new byte[header.length + fileBytes.length + footer.length];
        System.arraycopy(header, 0, out, 0, header.length);
        System.arraycopy(fileBytes, 0, out, header.length, fileBytes.length);
        System.arraycopy(footer, 0, out, header.length + fileBytes.length, footer.length);
        return out;
    }

    private static String guessContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".csv")) return "text/csv";
        if (lower.endsWith(".xls")) return "application/vnd.ms-excel";
        if (lower.endsWith(".xlsx")) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        return "application/octet-stream";
    }

    private static String escapeQuotes(String s) {
        return s.replace("\"", "\\\"");
    }
}
