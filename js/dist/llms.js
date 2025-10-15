import fetch from "cross-fetch";
const DEFAULT_BASE_URL = "http://localhost:3005";
function buildUrl(baseUrl, path, params) {
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
function normalizeListPayload(payload) {
    if (Array.isArray(payload)) {
        return { llms: payload, raw: payload };
    }
    if (payload && typeof payload === "object") {
        const { llms, page, limit, total } = payload;
        if (Array.isArray(llms)) {
            return { llms, page, limit, total, raw: payload };
        }
    }
    return { llms: [], raw: payload };
}
export async function listLlms({ apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs, page, limit, sortBy, sortOrder, }) {
    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const params = { page, limit, sortBy, sortOrder };
        const response = await fetch(buildUrl(baseUrl, "/llms", params), {
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
        const json = await response.json();
        return normalizeListPayload(json);
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
export async function listLlmsArray(params) {
       const out = await listLlms(params);
           return out.llms || [];
      }
    
           export async function getLlmById({ apiKey, id, baseUrl = DEFAULT_BASE_URL, timeoutMs, }) {
    if (id === undefined || id === null)
        throw new Error("id is required");
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
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}

