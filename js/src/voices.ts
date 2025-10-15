import fetch from "cross-fetch";

const DEFAULT_BASE_URL = "http://localhost:3005";

export type ProviderName = "elevenlabs" | "smallestai";
export type Accent = "indian" | "british" | "american" | "canadian" | "african" | "australian" | "swedish";
export type Gender = "male" | "female" | "non-binary";

export type Voice = {
    id: string;
    name?: string;
    provider?: ProviderName; // API returns `provider`; accept this shape
    accent?: Accent;
    gender?: Gender;
};

export type VoicesResponse = {
    voices: Voice[];
    // Pagination fields are optional as the spec doesn't define response shape
    page?: number;
    limit?: number;
    total?: number;
};

export type ClientConfig = {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
};

export type ListVoicesParams = {
    provider_name?: ProviderName;
    accent?: Accent;
    gender?: Gender;
    name?: string;
    page?: number;
    limit?: number;
};

function buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | undefined>): string {
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

export async function listVoices({
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
    timeoutMs,
    ...query
}: ClientConfig & ListVoicesParams): Promise<VoicesResponse> {
    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const response = await fetch(
            buildUrl(baseUrl, "/voices", {
                provider_name: query.provider_name,
                accent: query.accent,
                gender: query.gender,
                name: query.name,
                page: query.page,
                limit: query.limit,
            }),
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
            throw new Error(`Voices request failed (${response.status}): ${body}`);
        }

        return response.json();
    } finally {
        if (timer) clearTimeout(timer);
    }
}

export async function getVoiceById({
    apiKey,
    id,
    baseUrl = DEFAULT_BASE_URL,
    timeoutMs,
}: ClientConfig & { id: string }): Promise<Voice> {
    if (!id) throw new Error("id is required");

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
    } finally {
        if (timer) clearTimeout(timer);
    }
}
