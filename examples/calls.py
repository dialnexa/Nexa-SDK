from dialnexa import NexaClient


def main():
    client = NexaClient(api_key="your_api_key_here")

    # List existing calls with pagination (defaults are page=1, limit=30)
    client.calls.list(page=1, limit=30)

    #  Create a new call
    new_call = client.calls.create(
        phone_number="+912136547890",
        agent_id="agent_mh0k898wyp12l5",
        agent_version_number=0, # pubished version number 
        metadata={"name": "random"},
    )
    call_id = new_call.get("id")

    # Fetch call by ID
    fetched_call = client.calls.get(call_id)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
