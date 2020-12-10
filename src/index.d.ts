import { Config } from "./zuliprc";
import { AccountsClient } from "./resources/accounts";
import { StreamsClient } from "./resources/streams";
import { QueuesClient } from "./resources/queues";
import { EventsClient } from "./resources/events";
import { UsersClient } from "./resources/users";
import { EmojisClient } from "./resources/emojis";
import { TypingClient } from "./resources/typing";
import { ReactionsClient } from "./resources/reactions";
import { ServerClient } from "./resources/server";
import { FiltersClient } from "./resources/filters";
import { MessagesClient } from "./resources/messages";

export type HttpMethod =
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "OPTIONS"
    | "CONNECT"
    | "PATCH";

export interface Params {
    [key: string]: any;
    [key: number]: any;
}

export interface ZuliprcConfig {
    zuliprc: string;
}

export interface ZulipClient {
    config: Config;
    callEndpoint: typeof callEndpoint;
    accounts: AccountsClient;
    streams: StreamsClient;
    messages: MessagesClient;
    queues: QueuesClient;
    events: EventsClient;
    users: UsersClient;
    emojis: EmojisClient;
    typing: TypingClient;
    reactions: ReactionsClient;
    server: ServerClient;
    filters: FiltersClient;
}

export type InitialConfig = ZuliprcConfig | Pick<Config, "realm">;

export function getCallEndpoint(config: Config): typeof callEndpoint;

export function callEndpoint(endpoint: string, method: HttpMethod, params: Params): Promise<unknown>;

export function resources(config: Config): ZulipClient;

export function zulip(initialConfig: Partial<InitialConfig>): Promise<ZulipClient>;

export * from "./types";