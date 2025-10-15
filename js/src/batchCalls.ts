import fetch from "cross-fetch";

const DEFAULT_BASE_URL = "http://localhost:3005";

export type BatchCallsData = {
  campaign_id: string;
  total_leads_imported: number;
  campaign_status: "created" | "running" | "completed" | "failed" | string;
};

export type BatchCallsResponse = {
  statusCode: number;
  message: string;
  data: BatchCallsData;
};

export type CreateBatchCallsInput = {
  apiKey: string;
  xOrganizationId: string; // RSA-encrypted base64
  file: Blob | File | Buffer | Uint8Array | any; // supports Node ReadStream
  filename?: string;
  title: string;
  agentId: string;
  agentVersionNumber: number;
  baseUrl?: string;
  timeoutMs?: number;
};

function buildUrl(baseUrl: string, path: string): string {
  return new URL(path.startsWith("/") ? path : `/${path}`, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).toString();
}

export async function createBatchCalls(input: CreateBatchCallsInput): Promise<BatchCallsResponse> {
  const { apiKey, xOrganizationId, file, filename, title, agentId, agentVersionNumber, baseUrl = DEFAULT_BASE_URL, timeoutMs } = input;

  if (!apiKey) throw new Error("apiKey is required");
  if (!xOrganizationId) throw new Error("xOrganizationId is required");
  if (!file) throw new Error("file is required");
  if (!title) throw new Error("title is required");
  if (!agentId) throw new Error("agentId is required");
  if (!Number.isFinite(agentVersionNumber) || agentVersionNumber < 0) throw new Error("agentVersionNumber must be >= 0");

  const isNode = typeof window === "undefined" && typeof process !== "undefined" && !!process.versions?.node;
  let form: any;
  let extraHeaders: Record<string, string> = {};
  if (isNode) {
    const FormDataNode = (await import('form-data')).default as any;
    form = new FormDataNode();
    const fname = filename || (typeof (file as any)?.name === 'string' ? (file as any).name : 'leads');
    const contentType = guessContentType(fname);
    const Buf: any = (globalThis as any).Buffer;
    if (file && typeof (file as any).pipe === 'function') {
      form.append('file', file as any, { filename: fname, contentType });
    } else if (typeof (Blob) !== 'undefined' && file instanceof Blob) {
      const ab = await (file as Blob).arrayBuffer();
      form.append('file', Buf.from(ab), { filename: fname, contentType });
    } else if ((Buf && typeof Buf.isBuffer === 'function' && Buf.isBuffer(file)) || file instanceof Uint8Array) {
      form.append('file', Buf.from(file as any), { filename: fname, contentType });
    } else {
      throw new Error('Unsupported file type in Node environment. Pass a ReadStream, Buffer, Uint8Array, or Blob.');
    }
    form.append('title', title);
    form.append('agent_id', agentId);
    form.append('agent_version_number', String(agentVersionNumber));
    // form-data requires boundary header
    extraHeaders = (form as any).getHeaders?.() || {};
  } else {
    form = new FormData();
    form.append("file", file as any, (filename || (typeof (file as any).name === 'string' ? (file as any).name : 'leads')) as any);
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
        // In Node with form-data, include boundary headers
        ...extraHeaders,
      } as any,
      body: form as any,
      signal: controller?.signal,
    } as any);

    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`Batch calls request failed (${resp.status}): ${body}`);
    }
    return resp.json();
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function guessContentType(filename: string): string {
  const lower = (filename || '').toLowerCase();
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.xls')) return 'application/vnd.ms-excel';
  if (lower.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  return 'application/octet-stream';
}
