"""
Example usage for the Python SDK (Calls)

Run (PowerShell):
  $env:NEXA_API_KEY='your_key'
  $env:NEXA_ORGANIZATION_ID='org_xxx'
  python examples/python/calls.py [call_id_to_get_or_null] [phone_to_create_or_null]

Note: install the Python package in editable mode first:
  cd python
  pip install -e .
"""

import os
import sys
import json
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Allow running without installing the package
THIS_DIR = os.path.dirname(__file__)
REPO_PYTHON_DIR = os.path.abspath(os.path.join(THIS_DIR, "..", "..", "python"))
if REPO_PYTHON_DIR not in sys.path:
    sys.path.insert(0, REPO_PYTHON_DIR)

from sdk import CallsClient  # type: ignore


def main(call_id: Optional[str], phone_to_create: Optional[str]) -> int:
    api_key = os.getenv("NEXA_API_KEY")
    base_url = os.getenv("NEXA_BASE_URL")
    org_id = os.getenv("NEXA_ORGANIZATION_ID")
    if not api_key:
        print("NEXA_API_KEY is not set. Set it in your environment and retry.")
        return 1
    # Log the Organization-Id being used (masked)
    masked_org = (org_id[:6] + "..." + org_id[-4:]) if org_id and len(org_id) > 10 else (org_id or "<not set>")
    print(f"Using NEXA_ORGANIZATION_ID from env: {masked_org}")
    if not org_id:
        print("NEXA_ORGANIZATION_ID is not set. Set it in your environment and retry.")
        return 1

    client = CallsClient(api_key=api_key, base_url=base_url, default_organization_id=org_id)
    try:
        print("Listing calls (first page)")
        listed = client.list_calls()
        print(json.dumps(listed, indent=2))

        if phone_to_create:
            print(f"\nCreating outbound call to: {phone_to_create}")
            created = client.create_call(
                phone_number=phone_to_create,
                agent_id=os.getenv("NEXA_AGENT_ID", "agent_123"),
                agent_version_number=int(os.getenv("NEXA_AGENT_VERSION", "0")) if os.getenv("NEXA_AGENT_VERSION") else None,
                metadata={"source": "sdk-example", "ts": __import__("time").time()},
            )
            # created is either dataclass or dict
            if hasattr(created, "__dict__"):
                payload = {"status": created.status, "call_id": created.call_id, "message": created.message}
            else:
                payload = created
            print(json.dumps(payload, indent=2))

        if call_id:
            print(f"\nFetching call by id: {call_id}")
            cid = call_id
            if hasattr(created, "data") and hasattr(created.data, "call_id") and (call_id is None):
                cid = created.data.call_id
            one = client.get_call_by_id(cid)
            print(json.dumps(one, indent=2))
        return 0
    except Exception as e:
        print("Error:", e)
        return 1


if __name__ == "__main__":
    cid = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].lower() != "null" else None
    phone = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2].lower() != "null" else None
    raise SystemExit(main(cid, phone))
