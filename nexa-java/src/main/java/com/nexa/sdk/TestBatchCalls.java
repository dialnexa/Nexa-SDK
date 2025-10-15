package com.nexa.sdk;

import java.io.File;

public class TestBatchCalls {
    public static void main(String[] args) throws Exception {
        if (args.length < 4) {
            System.err.println("Usage: <file_path> <title> <agent_id> <agent_version_number>");
            System.exit(1);
        }
        String filePath = args[0];
        String title = args[1];
        String agentId = args[2];
        int agentVersion = Integer.parseInt(args[3]);

        String apiKey = System.getenv("NEXA_API_KEY");
        String baseUrl = System.getenv("NEXA_BASE_URL");
        String xOrg = System.getenv("NEXA_ORGANIZATION_ID");
        if (apiKey == null || apiKey.isEmpty()) { System.err.println("NEXA_API_KEY is not set"); System.exit(1);}        
        if (xOrg == null || xOrg.isEmpty()) { System.err.println("NEXA_ORGANIZATION_ID is not set"); System.exit(1);}        

        BatchCallsClient client = new BatchCallsClient(apiKey, baseUrl);
        BatchCallsResponse resp = client.createBatchCalls(new File(filePath), title, agentId, agentVersion, xOrg);
        System.out.println("statusCode=" + resp.getStatusCode());
        System.out.println("message=" + resp.getMessage());
        if (resp.getData() != null) {
            System.out.println("campaign_id=" + resp.getData().getCampaignId());
            System.out.println("total_leads_imported=" + resp.getData().getTotalLeadsImported());
            System.out.println("campaign_status=" + resp.getData().getCampaignStatus());
        }
    }
}

