package com.nexa.sdk;

import java.util.List;

public class TestLanguages {
    public static void main(String[] args) {
        try {
            String apiKey = System.getenv("NEXA_API_KEY");
            if (apiKey == null || apiKey.isEmpty()) {
                System.err.println("NEXA_API_KEY is not set.");
                return;
            }

            LanguagesClient client = new LanguagesClient(apiKey);

            // List languages
            LanguagesResponse listResponse = client.listLanguages("voice_model_123");
            System.out.println("Languages list:");
            listResponse.getLanguages().forEach(lang -> 
                System.out.println("- " + lang.getId() + ": " + lang.getName())
            );

            // Get one language by ID
            if (!listResponse.getLanguages().isEmpty()) {
                String firstId = listResponse.getLanguages().get(0).getId();
                Language lang = client.getLanguageById(firstId);
                System.out.println("\nFirst language details:");
                System.out.println(lang.getName() + " | " + lang.getDescription());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
