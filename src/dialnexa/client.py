from __future__ import annotations

import os
from dotenv import load_dotenv
from dataclasses import dataclass
from typing import Optional

from .http import HttpClient
from .languages import LanguagesClient
from .llms import LlmsClient
from .voices import VoicesClient
from .calls import CallsClient
from .batch_calls import BatchCallsClient
from .agents import AgentsClient

load_dotenv()

DEFAULT_BASE_URL = "http://api.dialnexa.com"


@dataclass(frozen=True)
class ClientInit:
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    organization_id: Optional[str] = None
    timeout_ms: Optional[int] = None


class NexaClient:
    def __init__(
        self,
        api_key: str,
        base_url: str = DEFAULT_BASE_URL,
        organization_id: Optional[str] = None,
        timeout_ms: Optional[int] = None,
    ) -> None:
        if not api_key:
            raise ValueError("NEXA_API_KEY is required")

        self._api_key = api_key
        self._base_url = base_url.rstrip("/") if base_url else DEFAULT_BASE_URL
        self._organization_id = organization_id
        self._timeout = (timeout_ms / 1000.0) if timeout_ms else None

        http = HttpClient(
            base_url=self._base_url,
            api_key=self._api_key,
            organization_id=self._organization_id,
            timeout=self._timeout,
        )

        self.languages = LanguagesClient(http)
        self.llms = LlmsClient(http)
        self.voices = VoicesClient(http)
        self.calls = CallsClient(http)
        self.batch_calls = BatchCallsClient(http)
        self.agents = AgentsClient(http)


def create_client(init: Optional[ClientInit] = None) -> NexaClient:
    init = init or ClientInit()
    api_key = init.api_key or os.getenv("NEXA_API_KEY")
    base_url = init.base_url or DEFAULT_BASE_URL
    org_id = init.organization_id or os.getenv("NEXA_ORGANIZATION_ID")
    timeout_ms = init.timeout_ms

    # Only enforce org_id for endpoints that require it within the specific clients.
    return NexaClient(
        api_key=api_key or "",
        base_url=base_url,
        organization_id=org_id,
        timeout_ms=timeout_ms,
    )
