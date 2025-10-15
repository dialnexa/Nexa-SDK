package com.nexa.sdk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LlmsResponse {
    private List<Llm> llms;
    private Integer page;
    private Integer limit;
    private Integer total;

    public LlmsResponse() {}

    public List<Llm> getLlms() { return llms; }
    public void setLlms(List<Llm> llms) { this.llms = llms; }

    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }

    public Integer getLimit() { return limit; }
    public void setLimit(Integer limit) { this.limit = limit; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
}