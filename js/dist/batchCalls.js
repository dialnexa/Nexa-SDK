import fetch from "cross-fetch";
const DEFAULT_BASE_URL = "http://localhost:3005";
function buildUrl(baseUrl, path) {
    return new URL(path.startsWith("/") ? path : `/${path}`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).toString();
}
export async function createBatchCalls(input) {
    const { apiKey, xOrganizationId, file, filename, title, agentId, agentVersionNumber, baseUrl = DEFAULT_BASE_URL, timeoutMs } = input;
    if (!apiKey)
        throw new Error("apiKey is required");
    if (!xOrganizationId)
        throw new Error("xOrganizationId is required");
    if (!file)
        throw new Error("file is required");
    if (!title)
        throw new Error("title is required");
    if (!agentId)
        throw new Error("agentId is required");
    if (!Number.isFinite(agentVersionNumber) || agentVersionNumber < 0)
        throw new Error("agentVersionNumber must be >= 0");
    const isNode = typeof window === "undefined" && typeof process !== "undefined" && !!process.versions?.node;
    let form;
    let extraHeaders = {};
    if (isNode) {
        const FormDataNode = (await import('form-data')).default;
        form = new FormDataNode();
        const fname = filename || (typeof file?.name === 'string' ? file.name : 'leads');
        const contentType = guessContentType(fname);
        if (file && typeof file.pipe === 'function') {
            form.append('file', file, { filename: fname, contentType });
        }
        else if (typeof Blob !== 'undefined' && file instanceof Blob) {
            const ab = await file.arrayBuffer();
            form.append('file', Buffer.from(ab), { filename: fname, contentType });
        }
        else if (Buffer.isBuffer(file) || file instanceof Uint8Array) {
            form.append('file', Buffer.from(file), { filename: fname, contentType });
        }
        else {
            throw new Error('Unsupported file type in Node environment. Pass a ReadStream, Buffer, Uint8Array, or Blob.');
        }
        form.append('title', title);
        form.append('agent_id', agentId);
        form.append('agent_version_number', String(agentVersionNumber));
        extraHeaders = form.getHeaders?.() || {};
    }
    else {
        form = new FormData();
        form.append("file", file, (filename || (typeof file.name === 'string' ? file.name : 'leads')));
        form.append("title", title);
        form.append("agent_id", agentId);
        form.append("agent_version_number", String(agentVersionNumber));
    }
    const controller = typeof AbortController !== "undefined" && timeoutMs ? new AbortController() : undefined;
    const timer = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
    try {
        const resp = await fetch(buildUrl(baseUrl, "/batch-calls"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "x-organization-id": xOrganizationId,
                ...extraHeaders,
            },
            body: form,
            signal: controller?.signal,
        });
        if (!resp.ok) {
            const body = await resp.text();
            throw new Error(`Batch calls request failed (${resp.status}): ${body}`);
        }
        return resp.json();
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}

function guessContentType(filename) {
    const lower = (filename || '').toLowerCase();
    if (lower.endsWith('.csv'))
        return 'text/csv';
    if (lower.endsWith('.xls'))
        return 'application/vnd.ms-excel';
    if (lower.endsWith('.xlsx'))
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return 'application/octet-stream';
}
