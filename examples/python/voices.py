"""
Example usage for the Python Voices SDK

Run (PowerShell):
  $env:NEXA_API_KEY='your_key'
  python examples/python/voices.py [voice_id]

Filters via env vars (optional):
  NEXA_PROVIDER_NAME, NEXA_ACCENT, NEXA_GENDER, NEXA_VOICE_NAME, NEXA_PAGE, NEXA_LIMIT

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

# Allow running the example without installing the package system-wide
THIS_DIR = os.path.dirname(__file__)
REPO_PYTHON_DIR = os.path.abspath(os.path.join(THIS_DIR, "..", "..", "python"))
if REPO_PYTHON_DIR not in sys.path:
    sys.path.insert(0, REPO_PYTHON_DIR)

from sdk import VoicesClient


def main(voice_id: Optional[str] = None) -> int:
    api_key = os.getenv("NEXA_API_KEY")
    base_url = os.getenv("NEXA_BASE_URL")
    if not api_key:
        print("NEXA_API_KEY is not set. Set it in your environment and retry.")
        return 1

    client = VoicesClient(api_key=api_key, base_url=base_url)

    # Optional filters from env
    provider_name = os.getenv("NEXA_PROVIDER_NAME") or None
    accent = os.getenv("NEXA_ACCENT") or None
    gender = os.getenv("NEXA_GENDER") or None
    vname = os.getenv("NEXA_VOICE_NAME") or None
    page = int(os.getenv("NEXA_PAGE")) if os.getenv("NEXA_PAGE") else None
    limit = int(os.getenv("NEXA_LIMIT")) if os.getenv("NEXA_LIMIT") else None

    try:
        print("Listing voices with filters:", {
            "provider_name": provider_name,
            "accent": accent,
            "gender": gender,
            "name": vname,
            "page": page,
            "limit": limit,
        })
        resp = client.list_voices(
            provider_name=provider_name,
            accent=accent,
            gender=gender,
            name=vname,
            page=page,
            limit=limit,
        )
        def clean(d: dict) -> dict:
            return {k: v for k, v in d.items() if v is not None}
        print(json.dumps([clean(asdict(v)) for v in resp.voices], indent=2, ensure_ascii=False))

        if voice_id:
            print(f"\nFetching voice by id: {voice_id}")
            one = client.get_voice_by_id(voice_id=voice_id)
            print(json.dumps(clean(asdict(one)), indent=2, ensure_ascii=False))
        return 0
    except Exception as e:
        print("Error:", e)
        return 1


if __name__ == "__main__":
    vid = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].lower() != "null" else None
    raise SystemExit(main(vid))

