"""DialNexa Python SDK

Clean, minimal client mirroring the TypeScript SDK.

Usage:
  from dialnexa import NexaClient
  client = NexaClient(api_key="...", organization_id="...")
  langs = client.languages.list()
"""
from dotenv import load_dotenv
from .client import NexaClient

load_dotenv()

__all__ = [
    "NexaClient",
]
