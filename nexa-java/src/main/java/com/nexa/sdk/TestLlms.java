package com.nexa.sdk;

public class TestLlms {
    public static void main(String[] args) {
        try {
            String apiKey = System.getenv("NEXA_API_KEY");
            String baseUrl = System.getenv("NEXA_BASE_URL");
            if (apiKey == null || apiKey.isEmpty()) {
                System.err.println("NEXA_API_KEY is not set.");
                return;
            }

            LlmsClient client = (baseUrl == null || baseUrl.isEmpty())
                    ? new LlmsClient(apiKey)
                    : new LlmsClient(apiKey, baseUrl);

            Integer page = null;
            Integer limit = null;
            String sortBy = null;
            String sortOrder = null;
            if (args.length > 0 && !args[0].equalsIgnoreCase("null")) page = Integer.parseInt(args[0]);
            if (args.length > 1 && !args[1].equalsIgnoreCase("null")) limit = Integer.parseInt(args[1]);
            if (args.length > 2 && !args[2].equalsIgnoreCase("null")) sortBy = args[2];
            if (args.length > 3 && !args[3].equalsIgnoreCase("null")) sortOrder = args[3];

            // List LLMs (array)
            java.util.List<Llm> items = client.listLlmsArray(page, limit, sortBy, sortOrder);
            System.out.println("LLMs list:");
            if (items != null) {
                items.forEach(item -> System.out.println("- id=" + item.getId() + " props=" + item.any()));
            }

            // Optional: get one LLM by ID passed as last arg
            if (args.length > 4 && args[4] != null && !args[4].isEmpty() && !"null".equalsIgnoreCase(args[4])) {
                int id = Integer.parseInt(args[4]);
                Llm one = client.getLlmById(id);
                System.out.println("\nLLM details:");
                System.out.println("id=" + one.getId() + " props=" + one.any());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
