"""
Example: Create batch calls campaign

PowerShell:
  $env:NEXA_API_KEY='your_key'
  $env:NEXA_ORGANIZATION_ID='encrypted_org_id_base64_string'
  python examples/python/batch_calls.py path/to/leads.csv "My Campaign" agent_123 1

Requires local package path in sys.path:
  cd python && pip install -e .
"""

import os
import sys
import json
from dotenv import load_dotenv

load_dotenv()

# Allow running the example without installing the package
THIS_DIR = os.path.dirname(__file__)
REPO_PYTHON_DIR = os.path.abspath(os.path.join(THIS_DIR, "..", "..", "python"))
if REPO_PYTHON_DIR not in sys.path:
    sys.path.insert(0, REPO_PYTHON_DIR)

from sdk import BatchCallsClient


def main() -> int:
    if len(sys.argv) < 5:
        print(
            "Usage: python examples/python/batch_calls.py <file_path> <title> <agent_id> <agent_version_number>")
        return 1

    file_path = sys.argv[1]
    title = sys.argv[2]
    agent_id = sys.argv[3]
    try:
        agent_version_number = int(sys.argv[4])
    except Exception:
        print("agent_version_number must be an integer")
        return 1

    api_key = os.getenv("NEXA_API_KEY")
    base_url = os.getenv("NEXA_BASE_URL")
    x_org_id = os.getenv("NEXA_ORGANIZATION_ID")

    if not api_key:
        print("NEXA_API_KEY is not set")
        return 1
    if not x_org_id:
        print("NEXA_ORGANIZATION_ID is not set")
        return 1

    client = BatchCallsClient(api_key=api_key, base_url=base_url)
    try:
        resp = client.create_batch_calls(
            file_path=file_path,
            title=title,
            agent_id=agent_id,
            agent_version_number=agent_version_number,
            x_organization_id=x_org_id,
        )
        print(json.dumps(resp.raw or {
            "statusCode": resp.statusCode,
            "message": resp.message,
            "data": {
                "campaign_id": resp.data.campaign_id,
                "total_leads_imported": resp.data.total_leads_imported,
                "campaign_status": resp.data.campaign_status,
            },
        }, indent=2))
        return 0
    except Exception as e:
        print("Error:", e)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

