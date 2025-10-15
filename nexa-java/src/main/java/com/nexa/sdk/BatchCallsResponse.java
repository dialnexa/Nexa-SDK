package com.nexa.sdk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BatchCallsResponse {
    private int statusCode;
    private String message;
    private BatchCallsData data;

    public BatchCallsResponse() {}

    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public BatchCallsData getData() { return data; }
    public void setData(BatchCallsData data) { this.data = data; }
}

