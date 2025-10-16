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


class Agents2Client:
    BASE_URL = "http://localhost:3005"

    def __init__(self, api_key: str, base_url: Optional[str] = None, timeout: Optional[float] = 30.0,
                 default_organization_id: Optional[str] = None):
        if not api_key:
            raise ValueError("API key is required")
        self.api_key = api_key
        self.base_url = (base_url or self.BASE_URL).rstrip("/")
        self.timeout = timeout
        self.default_org_id = default_organization_id or os.getenv("NEXA_ORGANIZATION_ID")
        self._base_headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }

    def _resolve_org(self, organization_id: Optional[str]) -> str:
        org = organization_id or self.default_org_id or os.getenv("NEXA_ORGANIZATION_ID")
        if not org:
            raise ValueError("organization_id is required")
        return org

    def _headers(self, organization_id: str, content_type: Optional[str] = None) -> Dict[str, str]:
        headers = dict(self._base_headers)
        if content_type:
            headers["Content-Type"] = content_type
        # Set multiple casings for maximum compatibility
        headers["Organization-Id"] = organization_id
        headers["X-Organization-Id"] = organization_id
        headers["x-organization-id"] = organization_id
        return headers

    def create_agent(self, *, organization_id: Optional[str], body: Dict[str, Any]) -> ApiResponse:
        org = self._resolve_org(organization_id)
        if not isinstance(body, dict):
            raise ValueError("body must be a JSON object (dict)")
        resp = requests.post(
            f"{self.base_url}/agents2",
            headers=self._headers(org, content_type="application/json"),
            json=body,
            timeout=self.timeout,
        )
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        if not resp.ok:
            raise RuntimeError(f"Agents2 create failed ({resp.status_code}): {data}")
        return ApiResponse(status_code=resp.status_code, headers=dict(resp.headers), data=data)

    def list_agents(self, organization_id: Optional[str] = None) -> ApiResponse:
        org = self._resolve_org(organization_id)
        resp = requests.get(
            f"{self.base_url}/agents2",
            headers=self._headers(org),
            timeout=self.timeout,
        )
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        if not resp.ok:
            raise RuntimeError(f"Agents2 list failed ({resp.status_code}): {data}")
        return ApiResponse(status_code=resp.status_code, headers=dict(resp.headers), data=data)

    def get_agent_by_id(self, id: str, organization_id: Optional[str] = None) -> ApiResponse:
        if not id:
            raise ValueError("id is required")
        org = self._resolve_org(organization_id)
        resp = requests.get(
            f"{self.base_url}/agents2/{id}",
            headers=self._headers(org),
            timeout=self.timeout,
        )
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        if not resp.ok:
            raise RuntimeError(f"Agents2 get failed ({resp.status_code}): {data}")
        return ApiResponse(status_code=resp.status_code, headers=dict(resp.headers), data=data)

    def update_agent(self, id: str, *, organization_id: Optional[str], body: Dict[str, Any]) -> ApiResponse:
        if not id:
            raise ValueError("id is required")
        org = self._resolve_org(organization_id)
        if not isinstance(body, dict):
            raise ValueError("body must be a JSON object (dict)")
        resp = requests.patch(
            f"{self.base_url}/agents2/{id}",
            headers=self._headers(org, content_type="application/json"),
            json=body,
            timeout=self.timeout,
        )
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        if not resp.ok:
            raise RuntimeError(f"Agents2 update failed ({resp.status_code}): {data}")
        return ApiResponse(status_code=resp.status_code, headers=dict(resp.headers), data=data)

