package com.nexa.sdk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BatchCallsData {
    @JsonProperty("campaign_id")
    private String campaignId;
    @JsonProperty("total_leads_imported")
    private int totalLeadsImported;
    @JsonProperty("campaign_status")
    private String campaignStatus;

    public BatchCallsData() {}

    public String getCampaignId() { return campaignId; }
    public void setCampaignId(String campaignId) { this.campaignId = campaignId; }

    public int getTotalLeadsImported() { return totalLeadsImported; }
    public void setTotalLeadsImported(int totalLeadsImported) { this.totalLeadsImported = totalLeadsImported; }

    public String getCampaignStatus() { return campaignStatus; }
    public void setCampaignStatus(String campaignStatus) { this.campaignStatus = campaignStatus; }
}

