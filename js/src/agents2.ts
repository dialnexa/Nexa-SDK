import fetch from "cross-fetch";

const DEFAULT_BASE_URL = "http://localhost:3005";

export type ClientConfig = {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
};

export type ApiResponse<T = any> = {
    statusCode: number;
    headers: Record<string, string>;
    data: T;
};

function buildUrl(baseUrl: string, path: string): string {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    return url.toString();
}

function headersToObject(headers: any): Record<string, string> {
    const out: Record<string, string> = {};
    headers.forEach((v: string, k: string) => {
        out[k] = v;
    });
    return out;
}

export type Agents2CreateRequest = Record<string, any>;
export type Agents2UpdateRequest = Record<string, any>;

export async function createAgent2(
    { apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs }: ClientConfig,
    organizationId: string,
    body: Agents2CreateRequest
): Promise<ApiResponse> {
    const xOrg = organizationId || (typeof process !== "undefined" ? (process as any).env?.NEXA_ORGANIZATION_ID : undefined);
    if (!xOrg) throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
    if (!body || typeof body !== "object") throw new Error("body is required");

    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, "/agents2"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                "Organization-Id": xOrg,
                "X-Organization-Id": xOrg,
                "x-organization-id": xOrg,
            },
            body: JSON.stringify(body),
            signal: controller?.signal,
        });
        const text = await response.text();
        let data: any;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!response.ok) {
            throw new Error(`Agents2 create failed (${response.status}): ${text}`);
        }
        return { statusCode: response.status, headers: headersToObject(response.headers), data };
    } finally {
        if (timer) clearTimeout(timer);
    }
}

export async function listAgents2(
    { apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs }: ClientConfig,
    organizationId?: string,
): Promise<ApiResponse> {
    const xOrg = organizationId || (typeof process !== "undefined" ? (process as any).env?.NEXA_ORGANIZATION_ID : undefined);
    if (!xOrg) throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");

    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, "/agents2"), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
                "Organization-Id": xOrg,
                "X-Organization-Id": xOrg,
                "x-organization-id": xOrg,
            },
            signal: controller?.signal,
        });
        const text = await response.text();
        let data: any;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!response.ok) {
            throw new Error(`Agents2 list failed (${response.status}): ${text}`);
        }
        return { statusCode: response.status, headers: headersToObject(response.headers), data };
    } finally {
        if (timer) clearTimeout(timer);
    }
}

export async function getAgent2ById(
    { apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs }: ClientConfig,
    id: string,
    organizationId?: string,
): Promise<ApiResponse> {
    if (!id) throw new Error("id is required");
    const xOrg = organizationId || (typeof process !== "undefined" ? (process as any).env?.NEXA_ORGANIZATION_ID : undefined);
    if (!xOrg) throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");

    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, `/agents2/${encodeURIComponent(id)}`), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
                "Organization-Id": xOrg,
                "X-Organization-Id": xOrg,
                "x-organization-id": xOrg,
            },
            signal: controller?.signal,
        });
        const text = await response.text();
        let data: any;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!response.ok) {
            throw new Error(`Agents2 get failed (${response.status}): ${text}`);
        }
        return { statusCode: response.status, headers: headersToObject(response.headers), data };
    } finally {
        if (timer) clearTimeout(timer);
    }
}

export async function updateAgent2(
    { apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs }: ClientConfig,
    id: string,
    organizationId: string,
    body: Agents2UpdateRequest
): Promise<ApiResponse> {
    if (!id) throw new Error("id is required");
    const xOrg = organizationId || (typeof process !== "undefined" ? (process as any).env?.NEXA_ORGANIZATION_ID : undefined);
    if (!xOrg) throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
    if (!body || typeof body !== "object") throw new Error("body is required");

    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, `/agents2/${encodeURIComponent(id)}`), {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                "Organization-Id": xOrg,
                "X-Organization-Id": xOrg,
                "x-organization-id": xOrg,
            },
            body: JSON.stringify(body),
            signal: controller?.signal,
        });
        const text = await response.text();
        let data: any;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!response.ok) {
            throw new Error(`Agents2 update failed (${response.status}): ${text}`);
        }
        return { statusCode: response.status, headers: headersToObject(response.headers), data };
    } finally {
        if (timer) clearTimeout(timer);
    }
}

