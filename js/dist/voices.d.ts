export type ProviderName = "elevenlabs" | "smallestai";
export type Accent = "indian" | "british" | "american" | "canadian" | "african" | "australian" | "swedish";
export type Gender = "male" | "female" | "non-binary";
export type Voice = {
    id: string;
    name?: string;
    provider_name?: ProviderName;
    accent?: Accent;
    gender?: Gender;
};
export type VoicesResponse = {
    voices: Voice[];
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
export declare function listVoices({ apiKey, baseUrl, timeoutMs, ...query }: ClientConfig & ListVoicesParams): Promise<VoicesResponse>;
export declare function getVoiceById({ apiKey, id, baseUrl, timeoutMs, }: ClientConfig & {
    id: string;
}): Promise<Voice>;
