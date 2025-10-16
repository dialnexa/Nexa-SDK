import fetch from "cross-fetch";
const DEFAULT_BASE_URL = "http://localhost:3005";
function buildUrl(baseUrl, path) {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    return url.toString();
}
function headersToObject(headers) {
    const out = {};
    headers.forEach((v, k) => {
        out[k] = v;
    });
    return out;
}
export async function createAgent2({ apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs }, organizationId, body) {
    const xOrg = organizationId || (typeof process !== "undefined" ? process.env?.NEXA_ORGANIZATION_ID : undefined);
    if (!xOrg)
        throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
    if (!body || typeof body !== "object")
        throw new Error("body is required");
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
        let data;
        try {
            data = text ? JSON.parse(text) : null;
        }
        catch {
            data = text;
        }
        if (!response.ok) {
            throw new Error(`Agents2 create failed (${response.status}): ${text}`);
        }
        return { statusCode: response.status, headers: headersToObject(response.headers), data };
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
export async function listAgents2({ apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs }, organizationId) {
    const xOrg = organizationId || (typeof process !== "undefined" ? process.env?.NEXA_ORGANIZATION_ID : undefined);
    if (!xOrg)
        throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
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
        let data;
        try {
            data = text ? JSON.parse(text) : null;
        }
        catch {
            data = text;
        }
        if (!response.ok) {
            throw new Error(`Agents2 list failed (${response.status}): ${text}`);
        }
        return { statusCode: response.status, headers: headersToObject(response.headers), data };
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
export async function getAgent2ById({ apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs }, id, organizationId) {
    if (!id)
        throw new Error("id is required");
    const xOrg = organizationId || (typeof process !== "undefined" ? process.env?.NEXA_ORGANIZATION_ID : undefined);
    if (!xOrg)
        throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
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
        let data;
        try {
            data = text ? JSON.parse(text) : null;
        }
        catch {
            data = text;
        }
        if (!response.ok) {
            throw new Error(`Agents2 get failed (${response.status}): ${text}`);
        }
        return { statusCode: response.status, headers: headersToObject(response.headers), data };
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
export async function updateAgent2({ apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs }, id, organizationId, body) {
    if (!id)
        throw new Error("id is required");
    const xOrg = organizationId || (typeof process !== "undefined" ? process.env?.NEXA_ORGANIZATION_ID : undefined);
    if (!xOrg)
        throw new Error("organizationId is required (set NEXA_ORGANIZATION_ID or pass organizationId)");
    if (!body || typeof body !== "object")
        throw new Error("body is required");
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
        let data;
        try {
            data = text ? JSON.parse(text) : null;
        }
        catch {
            data = text;
        }
        if (!response.ok) {
            throw new Error(`Agents2 update failed (${response.status}): ${text}`);
        }
        return { statusCode: response.status, headers: headersToObject(response.headers), data };
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
