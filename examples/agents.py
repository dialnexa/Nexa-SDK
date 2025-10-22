from dialnexa import create_client


def main():
    client = create_client()

    # Define agent payload
    payload = {
        "title": "Customer Support Agent",
        "prompts": {
            "prompt_text": "Hello!",
            "welcome_message": "Welcome! I'm here to help.",
            "conversation_start_type": "user",
        },
    }

    # Create a new agent
    print("Creating agent:")
    client.agents.create(payload)

    # List all agents
    print("\nListing all agents:")
    client.agents.list()

    # Hardcoded agent ID for testing
    agent_id = "agent_mgunv5s8ikis3a"

    # Fetch details for the hardcoded agent
    print(f"\nFetching agent by ID: {agent_id}")
    client.agents.get(agent_id)

    # Define update payload
    update_payload = {
        "version_number": 0,
        "title": "Updated Title",
    }

    # Update the agent
    print(f"\nUpdating agent {agent_id}:")
    client.agents.update(agent_id, update_payload)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
