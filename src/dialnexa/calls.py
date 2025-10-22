from __future__ import annotations

from typing import Any, Dict, Optional

from .http import HttpClient


class CallsClient:
    def __init__(self, http: HttpClient) -> None:
        self._http = http

    def list(
        self,
        *,
        agent_id: Optional[str] = None,
        call_id: Optional[str] = None,
        batch_call_id: Optional[str] = None,
        from_: Optional[str] = None,
    ) -> Any:
        self._http.ensure_org()
        params: Dict[str, Any] = {}
        if agent_id: params["agent_id"] = agent_id
        if call_id: params["call_id"] = call_id
        if batch_call_id: params["batch_call_id"] = batch_call_id
        if from_: params["from"] = from_
        return self._http.get_json("/calls", params=params, prefix="Calls request failed")

    def create(
        self,
        *,
        phone_number: str,
        agent_id: str,
        metadata: Dict[str, Any],
        agent_version_number: Optional[int] = None,
    ) -> Dict[str, Any]:
        self._http.ensure_org()
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
        return self._http.post_json("/calls", body, prefix="Calls request failed")

    def get(self, call_id: str) -> Dict[str, Any]:
        self._http.ensure_org()
        if not call_id:
            raise ValueError("id is required")
        return self._http.get_json(f"/calls/{call_id}", prefix="Calls request failed")
