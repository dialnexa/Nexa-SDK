import os
import json
import sys
import dotenv

dotenv.load_dotenv()

# Ensure local package is importable when not installed
sys.path.insert(0, 'python')
from sdk.agents2 import Agents2Client


api_key = os.getenv("NEXA_API_KEY")
base_url = os.getenv("NEXA_BASE_URL")
org_id = os.getenv("NEXA_ORGANIZATION_ID")

if not api_key:
    raise RuntimeError("NEXA_API_KEY is required")
if not org_id:
    raise RuntimeError("NEXA_ORGANIZATION_ID is required")

client = Agents2Client(api_key, base_url=base_url)

# Create
create_body = {
    "title": "Customer Support Agent",
    "language": {"id": None, "details": {"name": "", "code": ""}},
    "prompts": {"prompt_text": "Hello, how can I assist you today?", "allow_interruptions": True},
    # "llm": {"id": "gpt-4o-mini", "settings": {"temperature": 0.1, "structured_output": True}},
}

def to_versions_array(data):
    try:
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            if isinstance(data.get("versions"), list):
                return data["versions"]
            looks_like_version = any(k in data for k in ("number", "title", "llm"))
            if looks_like_version:
                return [data]
    except Exception:
        pass
    return data

created = client.create_agent(organization_id=org_id, body=create_body)
print("Created:", created.status_code)
print(json.dumps(to_versions_array(created.data), indent=2, ensure_ascii=False))

# List
listed = client.list_agents(organization_id=org_id)
print("List:", listed.status_code)
print(json.dumps(listed.data, indent=2, ensure_ascii=False))

# Get and Update (if ID found)
created_id = None
if isinstance(created.data, dict):
    created_id = created.data.get("id") or created.data.get("agent_id") or created.data.get("_id")

if created_id:
    one = client.get_agent_by_id(created_id, organization_id=org_id)
    print("Get:", one.status_code)
    print(json.dumps(one.data, indent=2, ensure_ascii=False))

    updated = client.update_agent(created_id, organization_id=org_id, body={
        "version_number": 1,
        "title": "Updated Title",
        "prompts": {"prompt_text": "Updated greeting message", "allow_interruptions": False},
    })
    print("Updated:", updated.status_code)
    print(json.dumps(updated.data, indent=2, ensure_ascii=False))
