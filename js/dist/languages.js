import fetch from "cross-fetch";
const DEFAULT_BASE_URL = "http://localhost:3005";
function buildUrl(baseUrl, path, params) {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            url.searchParams.append(k, v);
        }
    }
    return url.toString();
}
export async function listLanguages({ apiKey, voiceModelId, baseUrl = DEFAULT_BASE_URL, timeoutMs, }) {
    // if (!voiceModelId)
    //     throw new Error("voice_model_id is required");
    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, "/languages", { voice_model_id: voiceModelId }), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
            },
            signal: controller?.signal,
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Languages request failed (${response.status}): ${body}`);
        }
        return response.json();
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
export async function getLanguageById({ apiKey, id, baseUrl = DEFAULT_BASE_URL, timeoutMs, }) {
    if (!id)
        throw new Error("id is required");
    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(buildUrl(baseUrl, `/languages/${encodeURIComponent(id)}`), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
            },
            signal: controller?.signal,
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Languages request failed (${response.status}): ${body}`);
        }
        return response.json();
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
