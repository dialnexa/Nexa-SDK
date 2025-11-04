from dialnexa import NexaClient


def main():
    client = NexaClient(api_key="your_api_key_here")

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
    created_agent = client.agents.create(payload)
    agent_id = created_agent.get("id")
    print(f"Created agent ID: {agent_id}")

    # List all agents
    print("\nListing all agents:")
    client.agents.list()

    # Fetch details for the created agent
    print(f"\nFetching agent by ID: {agent_id}")
    client.agents.get(agent_id)

    # Define update payload
    update_payload = {
        "version_number": 0,
        "title": "Updated Title",
    }

    # Update the created agent
    print(f"\nUpdating agent {agent_id}:")
    client.agents.update(agent_id, update_payload)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
