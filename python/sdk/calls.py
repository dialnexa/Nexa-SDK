from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, Optional
import os
import requests


@dataclass
class ApiResponse:
    status_code: int
    headers: Dict[str, str]
    data: Any


@dataclass
class CallCreateResponse:
    status: str
    call_id: str
    message: str


class CallsClient:
    BASE_URL = "http://localhost:3005"

    def __init__(self, api_key: str, base_url: Optional[str] = None, timeout: Optional[float] = 30.0,
                 default_organization_id: Optional[str] = None):
        if not api_key:
            raise ValueError("API key is required")
        self.api_key = api_key
        self.base_url = (base_url or self.BASE_URL).rstrip("/")
        self.timeout = timeout
        # Prefer explicit default_organization_id; otherwise fall back to env
        self.default_org_id = default_organization_id or os.getenv("NEXA_ORGANIZATION_ID")
        self._base_headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }

    def _headers(self, organization_id: Optional[str] = None) -> Dict[str, str]:
        headers = dict(self._base_headers)
        if organization_id:
            headers["Organization-Id"] = organization_id
        return headers

    def list_calls(
        self,
        organization_id: Optional[str] = None,
        *,
        agent_id: Optional[str] = None,
        call_id: Optional[str] = None,
        batch_call_id: Optional[str] = None,
        from_: Optional[str] = None,
    ) -> Any:
        # Resolve org: explicit > default set on client > env
        org = organization_id or self.default_org_id or os.getenv("NEXA_ORGANIZATION_ID")
        if not org:
            raise ValueError("organization_id is required")
        params = {
            "agent_id": agent_id,
            "call_id": call_id,
            "batch_call_id": batch_call_id,
            "from": from_,
        }
        # remove Nones
        params = {k: v for k, v in params.items() if v is not None and str(v) != ""}
        headers = self._headers(org)
        # Send both header variants for compatibility
        headers.setdefault("X-Organization-Id", headers.get("Organization-Id"))
        resp = requests.get(f"{self.base_url}/calls", headers=headers, params=params or None, timeout=self.timeout)
        data: Any
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        if not resp.ok:
            raise RuntimeError(f"Calls list failed ({resp.status_code}): {data}")
        return data

    def create_call(
        self,
        *,
        organization_id: Optional[str] = None,
        phone_number: str,
        agent_id: str,
        metadata: Dict[str, Any],
        agent_version_number: Optional[int] = None,
    ) -> Any:
        # Resolve org: explicit > default set on client > env
        organization_id = organization_id or self.default_org_id or os.getenv("NEXA_ORGANIZATION_ID")
        if not organization_id:
            raise ValueError("organization_id is required")
        if not phone_number:
            raise ValueError("phone_number is required")
        if not agent_id:
            raise ValueError("agent_id is required")
        if metadata is None:
            raise ValueError("metadata is required")

        body: Dict[str, Any] = {
            "phone_number": phone_number,
            "agent_id": agent_id,
            "metadata": metadata,
        }
        if agent_version_number is not None:
            body["agent_version_number"] = agent_version_number

        headers = {**self._headers(organization_id), "Content-Type": "application/json"}
        headers.setdefault("X-Organization-Id", headers.get("Organization-Id"))
        resp = requests.post(
            f"{self.base_url}/calls",
            headers=headers,
            json=body,
            timeout=self.timeout,
        )
        parsed: Any
        try:
            parsed = resp.json()
        except Exception:
            parsed = resp.text
        if not resp.ok:
            raise RuntimeError(f"Create call failed ({resp.status_code}): {parsed}")
        if isinstance(parsed, dict) and all(k in parsed for k in ("status", "call_id", "message")):
            return CallCreateResponse(status=str(parsed["status"]), call_id=str(parsed["call_id"]), message=str(parsed["message"]))
        return parsed

    def get_call_by_id(self, id: str) -> Any:
        if not id:
            raise ValueError("id is required")
        resp = requests.get(f"{self.base_url}/calls/{id}", headers=self._headers(), timeout=self.timeout)
        data: Any
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        if not resp.ok:
            raise RuntimeError(f"Get call failed ({resp.status_code}): {data}")
        return data
