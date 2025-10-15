"""
Example usage for the Python SDK

Run (PowerShell):
  $env:NEXA_API_KEY='your_key'
  python examples/python/languages.py [voice_model_id] [language_id]

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

from sdk import LanguagesClient


def main(voice_model_id: Optional[str] = None, language_id: Optional[str] = None) -> int:
    api_key = os.getenv("NEXA_API_KEY")
    base_url = os.getenv("NEXA_BASE_URL")
    if not api_key:
        print("NEXA_API_KEY is not set. Set it in your environment and retry.")
        return 1

    client = LanguagesClient(api_key=api_key, base_url=base_url)
    try:
        print("Listing languages", f"(filtered by {voice_model_id})" if voice_model_id else "(all)")
        resp = client.list_languages(voice_model_id=voice_model_id)
        # Normalize to array of objects like JS example, dropping None fields
        def clean(d: dict) -> dict:
            return {k: v for k, v in d.items() if v is not None}

        langs = [clean(asdict(l)) for l in resp.languages]
        print(json.dumps(langs, indent=2, ensure_ascii=False))

        if language_id:
            print(f"\nFetching language by id: {language_id}")
            one = client.get_language_by_id(language_id=language_id)
            print(json.dumps(clean(asdict(one)), indent=2, ensure_ascii=False))
        return 0
    except Exception as e:
        print("Error:", e)
        return 1


if __name__ == "__main__":
    vm = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].lower() != "null" else None
    lid = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2].lower() != "null" else None
    raise SystemExit(main(vm, lid))
