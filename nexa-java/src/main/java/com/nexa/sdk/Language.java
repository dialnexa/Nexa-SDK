package com.nexa.sdk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Language {
    private String code;
    private String name;
    @JsonProperty("nativeName")
    private String nativeName;

    public Language() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNativeName() { return nativeName; }
    public void setNativeName(String nativeName) { this.nativeName = nativeName; }
}

