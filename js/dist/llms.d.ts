export type SortOrder = "ASC" | "DESC";
export type Llm = {
    id?: number;
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
export declare function listLlms({ apiKey, baseUrl, timeoutMs, page, limit, sortBy, sortOrder, }: ClientConfig & {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
}): Promise<LlmsResponse>;
export declare function getLlmById({ apiKey, id, baseUrl, timeoutMs, }: ClientConfig & {
    id: number;
}): Promise<Llm>;
