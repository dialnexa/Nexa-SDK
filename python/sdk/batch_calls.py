from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, Optional
import mimetypes
import os
import requests


@dataclass
class BatchCallsData:
    campaign_id: str
    total_leads_imported: int
    campaign_status: str

    @staticmethod
    def from_dict(payload: Dict[str, Any]) -> "BatchCallsData":
        return BatchCallsData(
            campaign_id=str(payload.get("campaign_id", "")),
            total_leads_imported=int(payload.get("total_leads_imported", 0)),
            campaign_status=str(payload.get("campaign_status", "")),
        )


@dataclass
class BatchCallsResponse:
    statusCode: int
    message: str
    data: BatchCallsData
    raw: Optional[Any] = None

    @staticmethod
    def from_dict(payload: Dict[str, Any]) -> "BatchCallsResponse":
        return BatchCallsResponse(
            statusCode=int(payload.get("statusCode", 0)),
            message=str(payload.get("message", "")),
            data=BatchCallsData.from_dict(payload.get("data") or {}),
            raw=payload,
        )


class BatchCallsClient:
    BASE_URL = "http://localhost:3005"

    def __init__(self, api_key: str, base_url: Optional[str] = None, timeout: Optional[float] = 60.0):
        if not api_key:
            raise ValueError("API key is required")
        self.api_key = api_key
        self.base_url = (base_url or self.BASE_URL).rstrip("/")
        self.timeout = timeout
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }

    def create_batch_calls(
        self,
        *,
        file_path: str,
        title: str,
        agent_id: str,
        agent_version_number: int,
        x_organization_id: str,
    ) -> BatchCallsResponse:
        if not os.path.isfile(file_path):
            raise ValueError("file_path must be a valid file path")
        if not title:
            raise ValueError("title is required")
        if not agent_id:
            raise ValueError("agent_id is required")
        if not isinstance(agent_version_number, int) or agent_version_number < 0:
            raise ValueError("agent_version_number must be a non-negative integer")
        if not x_organization_id:
            raise ValueError("x_organization_id header is required")

        url = f"{self.base_url}/batch-calls"
        headers = {**self.headers, "x-organization-id": x_organization_id}

        # Guess content type by extension; let requests override if needed
        ctype, _ = mimetypes.guess_type(file_path)
        if not ctype:
            # Accept CSV/Excel as per API
            ctype = "text/csv"

        with open(file_path, "rb") as fh:
            files = {
                "file": (os.path.basename(file_path), fh, ctype),
            }
            data = {
                "title": title,
                "agent_id": agent_id,
                "agent_version_number": str(int(agent_version_number)),
            }

            resp = requests.post(url, headers=headers, files=files, data=data, timeout=self.timeout)
        self._ensure_success(resp)
        return BatchCallsResponse.from_dict(resp.json())

    def _ensure_success(self, resp: requests.Response) -> None:
        if not resp.ok:
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
            raise RuntimeError(f"Request failed ({resp.status_code}): {detail}")
