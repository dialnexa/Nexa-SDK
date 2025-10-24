from dialnexa import create_client


def main():
    client = create_client()

    # List all existing calls 
    client.calls.list()

    #  Create a new call
    new_call = client.calls.create(
        phone_number="+918873363790",
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
