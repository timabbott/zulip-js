import { Config } from "../zuliprc";
import { Caller, ZulipSuccessResponse, ZulipErrorResponse } from "../types";

export interface TypingClient {
  send: Caller<SendTypingParams, SendTypingResponse>;
}

// SECTION SEND TYPING
export interface SendTypingParams {
  /** Whether the user has started (start) or stopped (stop) to type. Must be one of: start, stop. */
  op: TypingOperation;
  /** The recipients of the message being typed, in the same format used by the send_message API. Typing notifications are only supported for private messages, so this should be a JSON-encoded list of email addresses of the message's recipients. */
  to: string[];
}

export type SendTypingResponse = SendTypingSuccess | SendTypingError;

export interface SendTypingSuccess extends ZulipSuccessResponse {}

export interface SendTypingError extends ZulipErrorResponse {}

// SECTION GENERAL TYPES
export type TypingOperation = "start" | "stop";

export function typing(config: Config): TypingClient;
