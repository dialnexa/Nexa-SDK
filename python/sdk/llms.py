from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
import requests


@dataclass
class Llm:
    id: Optional[int] = None
    raw: Optional[Dict[str, Any]] = None

    @staticmethod
    def from_dict(payload: Dict[str, Any]) -> "Llm":
        return Llm(
            id=payload.get("id"),
            raw=payload,
        )


@dataclass
class LlmsResponse:
    llms: List[Llm]
    page: Optional[int] = None
    limit: Optional[int] = None
    total: Optional[int] = None
    raw: Optional[Any] = None

    @staticmethod
    def from_dict(payload: Any) -> "LlmsResponse":
        # Accept either list or object with 'llms' key, normalize
        if isinstance(payload, dict):
            items = payload.get("llms") or []
            page = payload.get("page")
            limit = payload.get("limit")
            total = payload.get("total")
        elif isinstance(payload, list):
            items = payload
            page = limit = total = None
        else:
            items = []
            page = limit = total = None

        llms = [Llm.from_dict(item) for item in items if isinstance(item, dict)]
        return LlmsResponse(llms=llms, page=page, limit=limit, total=total, raw=payload)


class LlmsClient:
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

    def list_llms(
        self,
        page: Optional[int] = None,
        limit: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
    ) -> LlmsResponse:
        params: Dict[str, Any] = {}
        if page is not None:
            params["page"] = page
        if limit is not None:
            params["limit"] = limit
        if sort_by:
            params["sortBy"] = sort_by
        if sort_order:
            params["sortOrder"] = sort_order

        resp = requests.get(
            f"{self.base_url}/llms", headers=self.headers, params=params or None, timeout=self.timeout
        )
        self._ensure_success(resp)
        return LlmsResponse.from_dict(resp.json())

    def list_llms_array(
        self,
        page: Optional[int] = None,
        limit: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
    ) -> List[dict]:
        """Return list of LLM objects (as dicts) without wrapper fields.
        Accepts both array and object-with-llms responses from server.
        """
        params: Dict[str, Any] = {}
        if page is not None:
            params["page"] = page
        if limit is not None:
            params["limit"] = limit
        if sort_by:
            params["sortBy"] = sort_by
        if sort_order:
            params["sortOrder"] = sort_order

        resp = requests.get(
            f"{self.base_url}/llms", headers=self.headers, params=params or None, timeout=self.timeout
        )
        self._ensure_success(resp)
        data = resp.json()
        if isinstance(data, list):
            return data
        if isinstance(data, dict) and isinstance(data.get("llms"), list):
            return data["llms"]
        return []

    def get_llm_by_id(self, id: Optional[int] = None) -> Llm:
        if id is None:
            raise ValueError("id is required")
        resp = requests.get(f"{self.base_url}/llms/{id}", headers=self.headers, timeout=self.timeout)
        self._ensure_success(resp)
        data = resp.json()
        if isinstance(data, dict):
            return Llm.from_dict(data)
        return Llm(id=id, raw=data)

    def _ensure_success(self, resp: requests.Response) -> None:
        if not resp.ok:
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
            raise RuntimeError(f"Request failed ({resp.status_code}): {detail}")
