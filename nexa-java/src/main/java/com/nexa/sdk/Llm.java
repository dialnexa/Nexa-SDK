package com.nexa.sdk;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Llm {
    @JsonProperty("id")
    private Integer id;

    private Map<String, Object> properties = new HashMap<>();

    public Llm() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    @JsonAnySetter
    public void set(String name, Object value) {
        if ("id".equals(name)) return; // already handled
        properties.put(name, value);
    }

    @JsonAnyGetter
    public Map<String, Object> any() { return properties; }
}