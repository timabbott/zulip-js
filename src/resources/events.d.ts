import { Config } from "../zuliprc";
import { RetrieverClient, ZulipSuccessResponse, ZulipErrorResponse } from "../types";

export type EventsClient = RetrieverClient;

// SECTION GET EVENTS
export interface GetEventsParams {
  /** "1375801870:2942" 	No 	The ID of a queue that you registered via POST /api/v1/register (see Register a queue). */
  queue_id?: string;
  /** -1 	No 	The highest event ID in this queue that you've received and wish to acknowledge. See the code for call_on_each_event in the zulip Python module for an example implementation of correctly processing each event exactly once. */
  last_event_id?: number;
  /** true 	No 	Set to true if the client is requesting a nonblocking reply. If not specified, the request will block until either a new event is available or a few minutes have passed, in which case the server will send the client a heartbeat event. Defaults to false. */
  dont_block?: boolean;
}

export type GetEventsResponse = GetEventsSuccess | GetEventsError;

export interface GetEventsSuccess extends ZulipSuccessResponse {
  events: Event[]
}

export type Event = MessageEvent | any;

export interface MessageEvent {
  avatar_url: string;
  client: string;
  content: string;
  content_type: string;
  display_recipient: string;
  id: number;
  recipient_id: number;
  sender_email: string;
  sender_full_name: string;
  sender_id: number;
  sender_realm_str: string;
  sender_short_name: string;
  subject: string;
  subject_links: string[],
  timestamp: number;
  type: string;
}

export interface GetEventsError extends ZulipErrorResponse {
  code: string;
  queue_id: string;
}

export function events(config: Config): EventsClient;
