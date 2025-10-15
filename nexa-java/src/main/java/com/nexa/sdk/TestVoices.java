package com.nexa.sdk;

public class TestVoices {
    public static void main(String[] args) {
        try {
            String apiKey = System.getenv("NEXA_API_KEY");
            String baseUrl = System.getenv("NEXA_BASE_URL");
            if (apiKey == null || apiKey.isEmpty()) {
                System.err.println("NEXA_API_KEY is not set.");
                return;
            }

            VoicesClient client = (baseUrl == null || baseUrl.isEmpty())
                    ? new VoicesClient(apiKey)
                    : new VoicesClient(apiKey, baseUrl);

            // Optional filters via env vars
            String providerName = System.getenv("NEXA_PROVIDER_NAME");
            String accent = System.getenv("NEXA_ACCENT");
            String gender = System.getenv("NEXA_GENDER");
            String name = System.getenv("NEXA_VOICE_NAME");
            Integer page = null;
            Integer limit = null;
            try { if (System.getenv("NEXA_PAGE") != null) page = Integer.parseInt(System.getenv("NEXA_PAGE")); } catch (Exception ignored) {}
            try { if (System.getenv("NEXA_LIMIT") != null) limit = Integer.parseInt(System.getenv("NEXA_LIMIT")); } catch (Exception ignored) {}

            VoicesResponse list = client.listVoices(providerName, accent, gender, name, page, limit);
            System.out.println("Voices list:");
            if (list.getVoices() != null) {
                for (Voice v : list.getVoices()) {
                    System.out.println("- " + v.getId() + ": " + v.getName());
                }
            }

            if (args.length > 0 && args[0] != null && !args[0].isEmpty() && !"null".equalsIgnoreCase(args[0])) {
                String voiceId = args[0];
                Voice one = client.getVoiceById(voiceId);
                System.out.println("\nVoice details:");
                System.out.println(one.getId() + " | " + one.getName());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}