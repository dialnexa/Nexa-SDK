"""
Example usage for the Python SDK (LLMs)

Run (PowerShell):
  $env:NEXA_API_KEY='your_key'
  python examples/python/llms.py [page] [limit] [sortBy] [sortOrder] [id]

Note: install the Python package in editable mode first:
  cd python
  pip install -e .
"""

import os
import sys
import json
from dataclasses import asdict
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Allow running the example without installing the package
THIS_DIR = os.path.dirname(__file__)
REPO_PYTHON_DIR = os.path.abspath(os.path.join(THIS_DIR, "..", "..", "python"))
if REPO_PYTHON_DIR not in sys.path:
    sys.path.insert(0, REPO_PYTHON_DIR)

from sdk import LlmsClient


def main(
    page: Optional[int] = None,
    limit: Optional[int] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
    id: Optional[int] = None,
) -> int:
    api_key = os.getenv("NEXA_API_KEY")
    base_url = os.getenv("NEXA_BASE_URL")
    if not api_key:
        print("NEXA_API_KEY is not set. Set it in your environment and retry.")
        return 1

    client = LlmsClient(api_key=api_key, base_url=base_url)
    try:
        arr = client.list_llms_array(page=page, limit=limit, sort_by=sort_by, sort_order=sort_order)
        print(json.dumps(arr, indent=2, ensure_ascii=False))

        if id is not None:
            print(f"\nFetching LLM by id: {id}")
            one = client.get_llm_by_id(id=id)
            print(json.dumps(one.raw or {"id": one.id}, indent=2, ensure_ascii=False))
        return 0
    except Exception as e:
        print("Error:", e)
        return 1


if __name__ == "__main__":
    pg = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].lower() != "null" else None
    lm = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].lower() != "null" else None
    sb = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3].lower() != "null" else None
    so = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4].lower() != "null" else None
    lid = int(sys.argv[5]) if len(sys.argv) > 5 and sys.argv[5].lower() != "null" else None
    raise SystemExit(main(pg, lm, sb, so, lid))




