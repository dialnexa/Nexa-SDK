import fetch from "cross-fetch";

const DEFAULT_BASE_URL = "http://localhost:3005";

// Methods return only the parsed response body (no statusCode/headers)

export type ClientConfig = {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
};

export type ListCallsParams = {
    organizationId?: string;
    agent_id?: string;
    call_id?: string;
    batch_call_id?: string;
    from?: string;
};

export type CreateCallBody = {
    phone_number: string;
    agent_id: string;
    agent_version_number?: number;
    metadata: Record<string, any>;
};

export type CallCreateResponse = {
    status: string;
    call_id: string;
    message: string;
};

function buildUrl(baseUrl: string, path: string, params?: Record<string, string | undefined>): string {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            if (typeof v !== "undefined" && v !== null && String(v).length > 0) {
                url.searchParams.append(k, String(v));
            }
        }
    }
    return url.toString();
}

function headersToObject(headers: any): Record<string, string> {
    const out: Record<string, string> = {};
    headers.forEach((v: string, k: string) => {
        out[k] = v;
    });
    return out;
}

export async function listCalls(
    {
        apiKey,
        baseUrl = DEFAULT_BASE_URL,
        timeoutMs,
    }: ClientConfig,
    params: ListCallsParams
): Promise<any> {
    // Directly read from env if not provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgId = process.env.NEXA_ORGANIZATION_ID;
    if (!orgId) throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");

    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(
            buildUrl(baseUrl, "/calls", {
                agent_id: params.agent_id,
                call_id: params.call_id,
                batch_call_id: params.batch_call_id,
                from: params.from,
            }),
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "application/json",
                    "Organization-Id": orgId,
                    "X-Organization-Id": orgId,
                },
                signal: controller?.signal,
            }
        );

        const text = await response.text();
        let data: any;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!response.ok) {
            throw new Error(`Calls list failed (${response.status}): ${text}`);
        }

        return data;
    } finally {
        if (timer) clearTimeout(timer);
    }
}

export async function createCall(
    {
        apiKey,
        baseUrl = DEFAULT_BASE_URL,
        timeoutMs,
    }: ClientConfig,
    organizationId: string,
    body: CreateCallBody
): Promise<CallCreateResponse> {
    // Directly read from env if not provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgId = organizationId || (typeof process !== "undefined" ? (process as any).env?.NEXA_ORGANIZATION_ID : undefined);
    if (!orgId) throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
    if (!body?.phone_number) throw new Error("phone_number is required");
    if (!body?.agent_id) throw new Error("agent_id is required");
    if (!body?.metadata) throw new Error("metadata is required");

    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, "/calls"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                "Organization-Id": orgId,
                "X-Organization-Id": orgId,
            },
            body: JSON.stringify(body),
            signal: controller?.signal,
        });

        const text = await response.text();
        let data: any;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!response.ok) {
            throw new Error(`Create call failed (${response.status}): ${text}`);
        }
        return data as CallCreateResponse;
    } finally {
        if (timer) clearTimeout(timer);
    }
}

export async function getCallById(
    {
        apiKey,
        baseUrl = DEFAULT_BASE_URL,
        timeoutMs,
    }: ClientConfig,
    id: string
): Promise<any> {
    if (!id) throw new Error("id is required");

    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, `/calls/${encodeURIComponent(id)}`), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
            },
            signal: controller?.signal,
        });

        const text = await response.text();
        let data: any;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!response.ok) {
            throw new Error(`Get call failed (${response.status}): ${text}`);
        }
        return data;
    } finally {
        if (timer) clearTimeout(timer);
    }
}
