import fetch from "cross-fetch";

const DEFAULT_BASE_URL = "http://localhost:3005";

export type SortOrder = "ASC" | "DESC";

export type Llm = {
    id?: number;
    // Allow any additional properties returned by the API
    [key: string]: any;
};

export type LlmsResponse = {
    llms: Llm[];
    page?: number;
    limit?: number;
    total?: number;
    raw?: any;
};

export type ClientConfig = {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
};

function buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null && v !== "") {
                url.searchParams.append(k, String(v));
            }
        }
    }
    return url.toString();
}

function normalizeListPayload(payload: any): LlmsResponse {
    if (Array.isArray(payload)) {
        return { llms: payload as Llm[], raw: payload };
    }
    if (payload && typeof payload === "object") {
        const { llms, page, limit, total } = payload as any;
        if (Array.isArray(llms)) {
            return { llms, page, limit, total, raw: payload };
        }
    }
    return { llms: [], raw: payload };
}

export async function listLlms({
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
    timeoutMs,
    page,
    limit,
    sortBy,
    sortOrder,
}: ClientConfig & { page?: number; limit?: number; sortBy?: string; sortOrder?: SortOrder }): Promise<LlmsResponse> {
    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const params = { page, limit, sortBy, sortOrder };
        const response = await fetch(
            buildUrl(baseUrl, "/llms", params),
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "application/json",
                },
                signal: controller?.signal,
            }
        );

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`LLMs request failed (${response.status}): ${body}`);
        }

        const json = await response.json();
        return normalizeListPayload(json);
    } finally {
        if (timer) clearTimeout(timer);
    }\n}\n\nexport async function listLlmsArray(params: Parameters<typeof listLlms>[0]): Promise<Llm[]> {\n    const out = await listLlms(params);\n    return out.llms || [];\n}\n\nexport async function getLlmById({
    apiKey,
    id,
    baseUrl = DEFAULT_BASE_URL,
    timeoutMs,
}: ClientConfig & { id: number }): Promise<Llm> {
    if (id === undefined || id === null) throw new Error("id is required");

    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, `/llms/${encodeURIComponent(String(id))}`), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
            },
            signal: controller?.signal,
        });

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`LLMs request failed (${response.status}): ${body}`);
        }

        return response.json();
    } finally {
        if (timer) clearTimeout(timer);
    }
}
