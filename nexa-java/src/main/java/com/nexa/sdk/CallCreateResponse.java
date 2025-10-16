package com.nexa.sdk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CallCreateResponse {
    private String status;
    @JsonProperty("call_id")
    private String callId;
    private String message;

    public CallCreateResponse() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCallId() { return callId; }
    public void setCallId(String callId) { this.callId = callId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

