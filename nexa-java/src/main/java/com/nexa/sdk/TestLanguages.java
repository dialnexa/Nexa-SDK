package com.nexa.sdk;

public class TestLanguages {
    public static void main(String[] args) {
        try {
            String apiKey = System.getenv("NEXA_API_KEY");
            String baseUrl = System.getenv("NEXA_BASE_URL");
            if (apiKey == null || apiKey.isEmpty()) {
                System.err.println("NEXA_API_KEY is not set.");
                return;
            }

            LanguagesClient client = (baseUrl == null || baseUrl.isEmpty())
                    ? new LanguagesClient(apiKey)
                    : new LanguagesClient(apiKey, baseUrl);

            // Optional filter from env var
            String voiceModelId = System.getenv("NEXA_VOICE_MODEL_ID");

            // List languages
            LanguagesResponse listResponse = client.listLanguages(voiceModelId);
            System.out.println("Languages list:");
            if (listResponse.getLanguages() != null) {
                listResponse.getLanguages().forEach(lang ->
                        System.out.println("- " + lang.getCode() + ": " + lang.getName())
                );
            }

            // Optional: get one language by ID passed as first arg
            if (args.length > 0 && args[0] != null && !args[0].isEmpty() && !"null".equalsIgnoreCase(args[0])) {
                String languageId = args[0];
                Language lang = client.getLanguageById(languageId);
                System.out.println("\nLanguage details:");
                System.out.println(lang.getCode() + " | " + lang.getName());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
