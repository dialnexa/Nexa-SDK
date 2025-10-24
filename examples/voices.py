from dialnexa import NexaClient

def main():
    client = NexaClient(api_key="your_api_key_here", organization_id="your_org_id_here")

    # list voices
    client.voices.list()

    # Fetch specific voice by ID
    voice_id = "voice_mgtbgczc63028z"
    client.voices.get(voice_id)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
