package com.nexa.sdk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VoicesResponse {
    private List<Voice> voices;
    private Integer page;
    private Integer limit;
    private Integer total;

    public VoicesResponse() {}

    public List<Voice> getVoices() { return voices; }
    public void setVoices(List<Voice> voices) { this.voices = voices; }

    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }

    public Integer getLimit() { return limit; }
    public void setLimit(Integer limit) { this.limit = limit; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
}

