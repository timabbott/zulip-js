import { Config } from "../zuliprc";
import { RetrieverClient, Caller, ZulipSuccessResponse, ZulipErrorResponse, Subscription, Topic } from "../types";

export interface StreamsClient extends RetrieverClient<GetStreamsParams, GetStreamsResponse> {
  getStreamId: Caller<GetStreamParams, GetStreamResponse>;
  subscriptions: StreamSubscriptions;
  topics: StreamTopics;
}

export type StreamSubscriptions = RetrieverClient<GetStreamSubscriptionParams, GetStreamSubscriptionResponse>;
export type StreamTopics = RetrieverClient<GetStreamTopicsParams, GetStreamTopicsResponse>;

// SECTION GET SUBSCRIPTIONS
export interface GetStreamsParams {
  /** Include all public streams. Defaults to true. */
  include_public?: boolean;
  /** Include all streams that the user is subscribed to. Defaults to true. */
  include_subscribed?: boolean;
  /** Include all active streams. The user must have administrative privileges to use this parameter. Defaults to false. */
  include_all_active?: boolean;
  /** Include all default streams for the user's realm. Defaults to false. */
  include_default?: boolean;
  /** If the user is a bot, include all streams that the bot's owner is subscribed to. Defaults to false. */
  include_owner_subscribed?: boolean;
}

export type GetStreamsResponse = GetStreamsSuccess | GetStreamsError;

export interface GetStreamsSuccess extends ZulipSuccessResponse {
  streams: Stream[];
}

export interface GetStreamsError extends ZulipErrorResponse {
  code: string;
}

// SECTION GET STREAM BY ID
export interface GetStreamParams {
  /** The name of the stream to retrieve the ID for. */
  stream: string;
}

export type GetStreamResponse = GetStreamSuccess | GetStreamError;

export interface GetStreamSuccess extends ZulipSuccessResponse {
  stream_id: number;
}

export interface GetStreamError extends ZulipErrorResponse {
  code: string;
}

// SECTION STREAM SUBSCRIPTIONS
export interface GetStreamSubscriptionParams {
  /** Set to true if you would like each stream's info to include a list of current subscribers to that stream. (This may be significantly slower in organizations with thousands of users.) Defaults to false. */
  include_subscribers?: boolean;
}

export type GetStreamSubscriptionResponse = GetStreamSubscriptionSuccess | GetStreamSubscriptionError;

export interface GetStreamSubscriptionSuccess extends ZulipSuccessResponse {
  subscriptions: Subscription[];
}

export interface GetStreamSubscriptionError extends ZulipErrorResponse {}

// SECTION STREAM TOPICS
export interface GetStreamTopicsParams {
  stream_id: number;
}

export type GetStreamTopicsResponse = GetStreamTopicsSuccess | GetStreamTopicsError;

export interface GetStreamTopicsSuccess extends ZulipSuccessResponse {
  topics: Topic[];
}

export interface GetStreamTopicsError extends ZulipErrorResponse {
  code: string;
}

// SECTION GENERAL TYPES
export interface Stream {
  /** The unique ID of a stream. */
  stream_id: number;
  /** The name of a stream. */
  name: string;
  /** A short description of a stream. */
  description: string;
  /** Specifies whether a stream is private or not. Only people who have been invited can access a private stream. */
  invite_only: boolean;
}

export function streams(config: Config): StreamsClient;