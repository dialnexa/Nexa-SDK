package com.nexa.sdk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Voice {
    private String id;
    private String name;
    @JsonProperty("provider_name")
    private String providerName;
    private String accent;
    private String gender;

    public Voice() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName;}

    public String getAccent() { return accent; }
    public void setAccent(String accent) { this.accent = accent; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
