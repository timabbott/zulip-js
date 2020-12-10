import { Config } from "../zuliprc";
import { Caller, Narrow, ZulipSuccessResponse, ZulipErrorResponse } from "../types";
import { Message } from "./messages";
import { Emoji } from "./emojis";

export interface QueuesClient {
  register: Caller<RegisterEventQueueParams, RegisterEventQueueResponse>;
  deregister: Caller<DeregisterEventQueueParams, DeregisterEventQueueResponse>;
}

// SECTION REGISTER EVENT QUEUE
export interface RegisterEventQueueParams {
  /** Set to true if you would like the content to be rendered in HTML format (otherwise the API will return the raw text that the user entered) Defaults to false.*/
  apply_markdown?: boolean;
  /**
   * The client_gravatar field is set to true if clients can compute their own gravatars.
   * Defaults to false.
   */
  client_gravatar?: boolean;
  /**
   * A JSON-encoded array indicating which types of events you're interested in.
   * Values that you might find useful include:* message (messages), * subscription (changes in your subscriptions), * realm_user (changes in the list of users in your realm)If you do not specify this argument, you will receive all events, and have to filter out the events not relevant to your client in your client code.
   * For most applications, one is only interested in messages, so one specifies: event_types=['message']
   */
  event_types?: EventType[];
  /**
   * Set to True if you would like to receive events that occur within all public streams.
   * Defaults to false.
   */
  all_public_streams?: boolean;
  /**
   * Set to True if you would like to receive events that include the subscribers for each stream.
   * Defaults to false.
   */
  include_subscribers?: boolean
  /**
   * Same as the event_types argument except that the values in fetch_event_types are used to fetch initial data.
   * If fetch_event_types is not provided, event_types is used and if event_types is not provided, this argument defaults to None.
   */
  fetch_event_types?: EventType[];
  /**
   * A JSON-encoded array of length 2 indicating the narrow for which you'd like to receive events for.
   * For instance, to receive events for the stream Denmark, you would specify narrow=['stream', 'Denmark']. Another example is narrow=['is', 'private'] for private messages. Defaults to "narrow=[]".
   */
  narrow: Narrow[];
}
export type RegisterEventQueueResponse = RegisterEventQueueSuccess | RegisterEventQueueError;
export type RegisterEventQueueSuccess = ZulipSuccessResponse & EventMap & {
  last_event_id: number;
  queue_id: string;
};

export type EventMap = { [key in EventType]: Event<key> };

export interface RegisterEventQueueError extends ZulipErrorResponse { }

export type EventType =
  | "message"
  | "subscription"
  | "realm_user"
  | "realm_emoji";

export type Event<T extends EventType> =
T extends "message" ? { [key: number]: Message } :
T extends "subscription" ? UnknownEvent :
T extends "realm_user" ? UnknownEvent :
T extends "realm_emoji" ? { [key: number]: Emoji } : any;

export type UnknownEvent = { [key: number]: any };

// SECTION UNREGISTER EVENT QUEUE
export interface DeregisterEventQueueParams {
  /** The ID of a queue that you registered via POST /api/v1/register(see Register a queue. */
  queue_id: string;
}

export type DeregisterEventQueueResponse = DeregisterEventQueueSuccess | DeregisterEventQueueError;

export interface DeregisterEventQueueSuccess extends ZulipSuccessResponse {}

export interface DeregisterEventQueueError extends ZulipErrorResponse {
  code: string;
  queue_id?: string;
}


export function queues(config: Config): QueuesClient;