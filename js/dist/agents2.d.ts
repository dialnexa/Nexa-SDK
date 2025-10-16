export type ClientConfig = {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
};
export type ApiResponse<T = any> = {
    statusCode: number;
    headers: Record<string, string>;
    data: T;
};
export type Agents2CreateRequest = Record<string, any>;
export type Agents2UpdateRequest = Record<string, any>;
export declare function createAgent2({ apiKey, baseUrl, timeoutMs }: ClientConfig, organizationId: string, body: Agents2CreateRequest): Promise<ApiResponse>;
export declare function listAgents2({ apiKey, baseUrl, timeoutMs }: ClientConfig, organizationId?: string): Promise<ApiResponse>;
export declare function getAgent2ById({ apiKey, baseUrl, timeoutMs }: ClientConfig, id: string, organizationId?: string): Promise<ApiResponse>;
export declare function updateAgent2({ apiKey, baseUrl, timeoutMs }: ClientConfig, id: string, organizationId: string, body: Agents2UpdateRequest): Promise<ApiResponse>;
