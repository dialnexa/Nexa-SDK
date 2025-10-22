from dialnexa import create_client


def main():
    client = create_client()

    # List all existing calls 
    client.calls.list()

    # Fetch specific call by ID
    call_id = "call_mgtt225elfzbpN"
    client.calls.get(call_id)

    # Create a new call 
    client.calls.create(
        phone_number="+911234567890",
        agent_id="agent_mh0k898wyp12l5",
        agent_version_number=0,
        metadata={"name": "random"},
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
