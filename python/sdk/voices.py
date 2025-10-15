from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
import requests


# Enumerations from Swagger
ProviderName = str  # values: "elevenlabs", "smallestai"
Accent = str  # values: "indian", "british", "american", "canadian", "african", "australian", "swedish"
Gender = str  # values: "male", "female", "non-binary"


@dataclass
class Voice:
    id: str
    name: Optional[str] = None
    provider: Optional[ProviderName] = None
    accent: Optional[Accent] = None
    gender: Optional[Gender] = None

    @staticmethod
    def from_dict(payload: Dict[str, Any]) -> "Voice":
        provider = (
            payload.get("provider")
        )
        return Voice(
            id=str(payload.get("id")),
            name=payload.get("name"),
            provider=provider,
            accent=payload.get("accent"),
            gender=payload.get("gender"),
        )


@dataclass
class VoicesResponse:
    voices: List[Voice]
    page: Optional[int] = None
    limit: Optional[int] = None
    total: Optional[int] = None
    raw: Optional[Any] = None

    @staticmethod
    def from_dict(payload: Any) -> "VoicesResponse":
        # If payload is a dict with 'voices' key and optional pagination
        if isinstance(payload, dict):
            items = payload.get("voices") or []
            page = payload.get("page")
            limit = payload.get("limit")
            total = payload.get("total")
        # If payload is a plain list
        elif isinstance(payload, list):
            items = payload
            page = limit = total = None
        else:
            items = []
            page = limit = total = None

        voices = [Voice.from_dict(item) for item in items]
        return VoicesResponse(
            voices=voices,
            page=page,
            limit=limit,
            total=total,
            raw=payload,
        )


class VoicesClient:
    BASE_URL = "http://localhost:3005"

    def __init__(self, api_key: str, base_url: Optional[str] = None, timeout: Optional[float] = 30.0):
        if not api_key:
            raise ValueError("API key is required")
        self.api_key = api_key
        self.base_url = (base_url or self.BASE_URL).rstrip("/")
        self.timeout = timeout
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }

    def list_voices(
        self,
        provider_name: Optional[ProviderName] = None,
        accent: Optional[Accent] = None,
        gender: Optional[Gender] = None,
        name: Optional[str] = None,
        page: Optional[int] = None,
        limit: Optional[int] = None,
    ) -> VoicesResponse:
        params = {
            "provider_name": provider_name,
            "accent": accent,
            "gender": gender,
            "name": name,
            "page": page,
            "limit": limit,
        }
        # remove None values
        params = {k: v for k, v in params.items() if v is not None}

        resp = requests.get(
            f"{self.base_url}/voices", headers=self.headers, params=params or None, timeout=self.timeout
        )
        self._ensure_success(resp)
        return VoicesResponse.from_dict(resp.json())

    def get_voice_by_id(self, voice_id: Optional[str] = None, id: Optional[str] = None) -> Voice:
        # Support both names; prefer voice_id and fall back to id
        vid = voice_id or id
        if not vid:
            raise ValueError("voice_id (or id) is required")
        resp = requests.get(f"{self.base_url}/voices/{vid}", headers=self.headers, timeout=self.timeout)
        self._ensure_success(resp)
        return Voice.from_dict(resp.json())

    def _ensure_success(self, resp: requests.Response) -> None:
        if not resp.ok:
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
            raise RuntimeError(f"Request failed ({resp.status_code}): {detail}")
