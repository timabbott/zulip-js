import { Config } from "../zuliprc";
import { RetrieverClient, Caller, ZulipSuccessResponse, ZulipErrorResponse, Narrow } from "../types";

// SECTION MESSAGE CLIENT
export interface MessagesClient extends RetrieverClient<GetMessageParams, GetMessageResponse> {
  send: Caller<SendMessageParams, SendMessageResponse>;
  render: Caller<RenderMessageParams, RenderMessageResponse>;
  update: Caller<UpdateMessageParams, UpdateMessageResponse>;
  getById: Caller<GetMessageParams, GetMessageResponse>;
  getHistoryById: Caller<GetMessageEditHistoryParams, GetMessageEditHistoryResponse>;
  // TODO: Find documentation on Delete Reaction
  deleteReactionById: Caller;
  deleteById: Caller<DeleteMessageParams, DeleteMessageResponse>;
  flags: MessagesFlagsClient;
}

export interface MessagesFlagsClient {
  add: Caller<InitialUpdateMessageFlagsParams, UpdateMessageFlagsResponse>;
  remove: Caller<InitialUpdateMessageFlagsParams, UpdateMessageFlagsResponse>;
}

// SECTION GET MESSAGE
export interface GetMessageParams {
  /** The message ID to fetch messages near. Required unless use_first_unread_anchor is set to true. */
  anchor?: number;
  /** Whether to use the (computed by the server) first unread message matching the narrow as the anchor. Mutually exclusive with anchor. Defaults to false. */
  use_first_unread_anchor?: boolean;
  /** The number of messages with IDs less than the anchor to retrieve. */
  num_before: number;
  /** The number of messages with IDs greater than the anchor to retrieve. */
  num_after?: number;
  /** The narrow where you want to fetch the messages from. See how to construct a narrow. Defaults to []. */
  narrow?: Array<Narrow>;
  /** Whether the client supports computing gravatars URLs. If enabled, avatar_url will be included in the response only if there is a Zulip avatar, and will be null for users who are using gravatar as their avatar. This option significantly reduces the compressed size of user data, since gravatar URLs are long, random strings and thus do not compress well. Defaults to false. */
  client_gravatar?: boolean;
  /** If true, message content is returned in the rendered HTML format. If false, message content is returned in the raw markdown-format text that user entered. Defaults to true. */
  apply_markdown?: boolean;
}

export type GetMessageResponse = GetMessageSuccess | GetMessageError;

export interface GetMessageSuccess extends ZulipSuccessResponse {
  anchor: number;
  found_anchor: boolean;
  found_oldest: boolean;
  found_newest: boolean;
  messages: Message[];
}

export interface Message {
  avatar_url: string;
  client: string;
  content: string;
  content_type: MessageContentType;
  display_recipient: string;
  flags: MessageFlag[];
  id: number;
  is_me_message: boolean;
  reactions: [];
  recipient_id: number;
  sender_email: string;
  sender_full_name: string;
  sender_id: number;
  sender_realm_str: string;
  sender_short_name: string;
  stream_id: number;
  subject: string;
  subject_links: [];
  submessages: [];
  timestamp: number;
  type: MessageType
}

export type MessageContentType = "text/html" | string;
export type MessageFlag =
  | "read"
  | "starred"
  | "collapsed"
  | "mentioned"
  | "wildcard_mentioned"
  | "has_alert_word"
  | "historical";

export interface GetMessageError extends ZulipErrorResponse {}

// SECTION SEND MESSAGE
export interface SendMessageParams {
  /** The type of message to be sent. private for a private message and stream for a stream message. Must be one of: private, stream. */
  type: MessageType;
  /** The destination stream, or a CSV/JSON-encoded list containing the usernames (emails) of the recipients. */
  to: string;
  /** The topic of the message. Only required if type is stream, ignored otherwise. Maximum length of 60 characters. */
  topic?: string;
  /** The content of the message. Maximum message size of 10000 bytes. */
  content: string;
}

export type SendMessageResponse = SendMessageSuccess | SendMessageError;

export interface SendMessageSuccess extends ZulipSuccessResponse {
  id: number;
}

export interface SendMessageError extends ZulipErrorResponse {
  code: CRUDMessageErrorCode;
  stream: string;
}

export type CRUDMessageErrorCode = "STREAM_DOES_NOT_EXIST" | "BAD_REQUEST" | string;

// SECTION RENDER MESSAGE
export interface RenderMessageParams {
  /** The content of the message. */
  content: string;
}

export type RenderMessageResponse = RenderMessageSuccess | RenderMessageError;

export interface RenderMessageSuccess extends ZulipSuccessResponse {
  rendered: string;
}

export interface RenderMessageError extends ZulipErrorResponse {}

// SECTION UPDATE MESSAGE
export interface UpdateMessageParams {
  /** The ID of the message that you wish to edit/update. */
  message_id: number;
  /** The topic of the message. Only required for stream messages. Maximum length of 60 characters. */
  topic?: string;
  /** Which message(s) should be edited: just the one indicated in message_id, messages in the same topic that had been sent after this one, or all of them. Must be one of: change_one, change_later, change_all. Defaults to "change_one". */
  propagate_mode?: PropogateMode;
  /** The content of the message. Maximum message size of 10000 bytes. */
  content?: string;
}

export type UpdateMessageResponse = UpdateMessageSuccess | UpdateMessageError;

export interface UpdateMessageSuccess extends ZulipSuccessResponse {}

export interface UpdateMessageError extends ZulipErrorResponse {
  code: CRUDMessageErrorCode;
}

// SECTION GET RAW MESSAGE
export interface GetRawMessageParams {
  /** The ID of the message that you wish to get the raw message of. */
  message_id: number;
}

export type GetRawMessageResponse = GetRawMessageSuccess | GetRawMessageError;

export interface GetRawMessageSuccess extends ZulipSuccessResponse {
  raw_content: string;
}

export interface GetRawMessageError extends ZulipErrorResponse {
  code: CRUDMessageErrorCode;
}

// SECTION UPLOAD A FILE
/* // TODO Define types when implemented in client
export interface UploadFileParams {}

export type UploadFileResponse = UploadFileSuccess | UploadFileError;

export interface UploadFileSuccess extends ZulipSuccessResponse {}

export interface UploadFileError extends ZulipErrorResponse {}
*/

// SECTION DELETE A MESSAGE
export interface DeleteMessageParams {
  /** The ID of the message that you wish to delete. */
  message_id: number;
}

export type DeleteMessageResponse = DeleteMessageSuccess | DeleteMessageError;

export interface DeleteMessageSuccess extends ZulipSuccessResponse {}

export interface DeleteMessageError extends ZulipErrorResponse {
  code: CRUDMessageErrorCode;
}

// SECTION GET MESSAGE EDIT HISTORY
export interface GetMessageEditHistoryParams {
  /** The ID of the message that you wish to get the edit history of. */
  message_id: number;
}

export type GetMessageEditHistoryResponse = GetMessageEditHistorySuccess | GetMessageEditHistoryError;

export interface GetMessageEditHistorySuccess extends ZulipSuccessResponse {
  message_history: [NewestMessage] | (EditedMessage[] & { 0: NewestMessage });
}

export interface HistoricalMessage {
  content: string;
  timestamp: number;
  topic: string;
  user_id: number;
}

export interface NewestMessage extends HistoricalMessage {
  rendered_content: string;
}

export interface EditedMessage extends NewestMessage {
  content_html_diff: string;
  prev_content: string;
  prev_rendered_content: string;
  prev_topic: string;
}

export interface GetMessageEditHistoryError extends ZulipErrorResponse {
  code: string;
}

// SECTION UPDATE MESSAGE FLAGS
export interface InitialUpdateMessageFlagsParams {
  /** An array containing the IDs of the target messages. */
  messages: number[];
  /** The flag that should be added/removed. */
  flag: MessageFlag;
}

export interface UpdateMessageFlagsParams extends InitialUpdateMessageFlagsParams {
  /** Whether to add the flag or remove it. Must be one of: add, remove. */
  op: "add" | "remove";
}

export type UpdateMessageFlagsResponse = UpdateMessageFlagsSuccess | UpdateMessageFlagsError;

export interface UpdateMessageFlagsSuccess extends ZulipSuccessResponse {
  messages: number[],
}

export interface UpdateMessageFlagsError extends ZulipErrorResponse {}

// SECTION MARK MESSAGES READ
export interface MarkMessagesReadParams {
  /** The ID of the stream whose messages should be marked as read. */
  stream_id: number;
}

export type MarkMessagesReadResponse = MarkMessagesReadSuccess | MarkMessagesReadError;

export interface MarkMessagesReadSuccess extends ZulipSuccessResponse {}

export interface MarkMessagesReadError extends ZulipErrorResponse {}

// SECTION GENERAL TYPES
export type PrivateMessage = "private";
export type StreamMessage = "stream";
export type MessageType = PrivateMessage | StreamMessage;

export type PropogateMode = "change_one" | "change_later" | "change_all";

export function messages(config: Config): MessagesClient;