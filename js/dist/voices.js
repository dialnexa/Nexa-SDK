import fetch from "cross-fetch";
const DEFAULT_BASE_URL = "http://localhost:3005";
function buildUrl(baseUrl, path, params) {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null) {
                url.searchParams.append(k, String(v));
            }
        }
    }
    return url.toString();
}
export async function listVoices({ apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs, ...query }) {
    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, "/voices", {
            provider_name: query.provider_name,
            accent: query.accent,
            gender: query.gender,
            name: query.name,
            page: query.page,
            limit: query.limit,
        }), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
            },
            signal: controller?.signal,
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Voices request failed (${response.status}): ${body}`);
        }
        return response.json();
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
export async function getVoiceById({ apiKey, id, baseUrl = DEFAULT_BASE_URL, timeoutMs, }) {
    if (!id)
        throw new Error("id is required");
    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, `/voices/${encodeURIComponent(id)}`), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
            },
            signal: controller?.signal,
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Voices request failed (${response.status}): ${body}`);
        }
        return response.json();
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
