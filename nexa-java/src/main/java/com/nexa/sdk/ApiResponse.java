package com.nexa.sdk;

import java.util.Map;

public class ApiResponse<T> {
    private int statusCode;
    private Map<String, String> headers;
    private T data;

    public ApiResponse() {}

    public ApiResponse(int statusCode, Map<String, String> headers, T data) {
        this.statusCode = statusCode;
        this.headers = headers;
        this.data = data;
    }

    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }

    public Map<String, String> getHeaders() { return headers; }
    public void setHeaders(Map<String, String> headers) { this.headers = headers; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}

