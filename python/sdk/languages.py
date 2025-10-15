from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
import requests


@dataclass
class Language:
    id: Optional[str] = None
    code: str = ""
    name: str = ""
    native_name: Optional[str] = None

    @staticmethod
    def from_dict(payload: Dict[str, Any]) -> "Language":
        return Language(
            id=payload.get("id"),
            code=str(payload.get("code")),
            name=str(payload.get("name")),
            native_name=payload.get("nativeName") or payload.get("native_name"),
        )

@dataclass
class LanguagesResponse:
    languages: List[Language]
    default_locale: Optional[str] = None
    raw: Optional[Any] = None  # could be list or dict

    @staticmethod
    def from_dict(payload: Any) -> "LanguagesResponse":
        # If payload is a dict with 'languages' key
        if isinstance(payload, dict):
            items = payload.get("languages") or []
            default_locale = payload.get("defaultLocale") or payload.get("default_locale")
        # If payload is a plain list
        elif isinstance(payload, list):
            items = payload
            default_locale = None
        else:
            items = []
            default_locale = None

        languages = [Language.from_dict(item) for item in items]
        return LanguagesResponse(
            languages=languages,
            default_locale=default_locale,
            raw=payload,
        )


class LanguagesClient:
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

    def list_languages(self, voice_model_id: Optional[str] = None) -> LanguagesResponse:
        params = {"voice_model_id": voice_model_id} if voice_model_id else None
        resp = requests.get(
            f"{self.base_url}/languages", headers=self.headers, params=params, timeout=self.timeout
        )
        self._ensure_success(resp)
        return LanguagesResponse.from_dict(resp.json())

    def get_language_by_id(self, language_id: Optional[str] = None, id: Optional[str] = None) -> Language:
        # Support both names; prefer language_id and fall back to id
        lang_id = language_id or id
        if not lang_id:
            raise ValueError("language_id (or id) is required")
        resp = requests.get(f"{self.base_url}/languages/{lang_id}", headers=self.headers, timeout=self.timeout)
        self._ensure_success(resp)
        return Language.from_dict(resp.json())

    def _ensure_success(self, resp: requests.Response) -> None:
        if not resp.ok:
            # try to include JSON message if present
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
            raise RuntimeError(f"Request failed ({resp.status_code}): {detail}")
