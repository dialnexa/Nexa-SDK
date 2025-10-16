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
export declare function listCalls({ apiKey, baseUrl, timeoutMs, }: ClientConfig, params: ListCallsParams): Promise<any>;
export declare function createCall({ apiKey, baseUrl, timeoutMs, }: ClientConfig, organizationId: string, body: CreateCallBody): Promise<CallCreateResponse>;
export declare function getCallById({ apiKey, baseUrl, timeoutMs, }: ClientConfig, id: string): Promise<any>;
