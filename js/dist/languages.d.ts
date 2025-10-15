export type Language = {
    code: string;
    name: string;
    nativeName?: string;
};
export type LanguagesResponse = {
    languages: Language[];
    defaultLocale?: string;
};
export type ClientConfig = {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
};
export declare function listLanguages({ apiKey, voiceModelId, baseUrl, timeoutMs, }: ClientConfig & {
    voiceModelId?: string;
}): Promise<LanguagesResponse>;
export declare function getLanguageById({ apiKey, id, baseUrl, timeoutMs, }: ClientConfig & {
    id: string;
}): Promise<Language>;
