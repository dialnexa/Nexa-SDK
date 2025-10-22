Nexa Python SDK
================

Lightweight Python SDK mirroring the TypeScript SDK structure.

Install
-------

- Requires Python 3.8+
- From PyPI: `pip install dialnexa`
- From source (in repo root): `pip install .`

Environment
-----------

- `NEXA_API_KEY` (required)
- `NEXA_ORGANIZATION_ID` (required for Calls, Agents, Batch Calls, Voices)

You can place these in a `.env` file in your project root:

```
NEXA_API_KEY=your_api_key
NEXA_ORGANIZATION_ID=your_encrypted_org_id
```

The SDK automatically loads `.env` when imported.

Usage
-----

```
from dialnexa import create_client

# If you prefer to control loading yourself, you can also do:
# from dotenv import load_dotenv
# load_dotenv()

client = create_client()

# Languages
print(client.languages.list())
print(client.languages.get("en-US"))

# LLMs
print(client.llms.list())
print(client.llms.get("llm_123"))

# Calls
created = client.calls.create(
    phone_number="+15555551234",
    agent_id="agent_123",
    agent_version_number=1,
    metadata={"source": "sdk"},
)
print(client.calls.get(created.get("call_id")))

# Batch Calls
with open("./leads.csv", "rb") as f:
    resp = client.batch_calls.create(file=f, filename="leads.csv", title="My batch", agent_id="agent_123", agent_version_number=1)
    print(resp)

# Agents
created_agent = client.agents.create({
    "title": "Customer Support Agent",
    "prompts": {
        "prompt_text": "Hello!",
        "welcome_message": "Welcome! I'm here to help.",
        "conversation_start_type": "user",
    },
})
print(created_agent)
listed = client.agents.list()
print(listed)
agent_id = created_agent.get("data", {}).get("id") or created_agent.get("data", {}).get("agent_id")
print(client.agents.get(agent_id))
print(client.agents.update(agent_id, {"version_number": 1, "title": "Updated Title"}))

# Voices
print(client.voices.list(provider_name="elevenlabs", limit=10))
print(client.voices.get("voice_abc"))
```

Notes
-----

- The default base URL is `http://localhost:3005`. Override via `create_client(ClientInit(base_url=...))` if needed.
- Timeouts use seconds internally; pass `timeout_ms` in `ClientInit`.
- Multipart uploads rely on `requests` handling for simplicity.

