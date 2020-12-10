export interface Config {
    realm: string;
    username: string;
    password: string;
    apiURL: string;
    apiToken: string;
}

export function parseConfigFile(filename: string): Promise<Config>;