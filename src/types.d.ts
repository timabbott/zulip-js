export type Caller<P = unknown, R = unknown> = (params: P) => Promise<R>;

export interface RetrieverClient<P = unknown, R = unknown> {
    retrieve: Caller<P, R>;
}

export interface ZulipApiResponse {
    msg: string;
}

export interface ZulipSuccessResponse extends ZulipApiResponse {
    result: "success";
}

export interface ZulipErrorResponse {
    result: "error";
}

// TODO Expand the possible types for Narrow operations
export interface Narrow {
    operator: string;
    operand: string | string[];
    negated?: boolean;
}


export interface Subscription {
    /** The unique ID of a stream. */
    stream_id: number;
    /** The name of a stream. */
    name: string;
    /** A short description of a stream. */
    description: string;
    /** Specifies whether a stream is private or not. Only people who have been invited can access a private stream. */
    invite_only: boolean;
    /** A list of email addresses of users who are also subscribed to a given stream. Included only if include_subscribers is true. */
    subscribers: string[];
    /** A boolean specifiying whether desktop notifications are enabled for the given stream. */
    desktop_notifications: boolean;
    /** A boolean specifiying whether push notifications are enabled for the given stream. */
    push_notifications: boolean;
    /** A boolean specifiying whether audible notifications are enabled for the given stream. */
    audible_notifications: boolean;
    /** A boolean specifying whether the given stream has been pinned to the top. */
    pin_to_top: boolean;
    /** Email address of the given stream. */
    email_address: string;
    /** Whether the given stream is muted or not. Muted streams do not count towards your total unread count and thus, do not show up in All messages view (previously known as Home view). */
    in_home_view: boolean;
    /** Stream color. (e.g. "#6f6c6f") */
    color: string;
}

export interface Topic {
    /** The name of the topic. */
    name: string;
    /** The message ID of the last message sent to this topic. */
    max_id: number;
}

/*
The following can be used for quickly creating new API accessors following the design of zulip-js

export interface XYZParams { }
export type XYZResponse = XYZSuccess | XYZError;
export interface XYZSuccess extends ZulipSuccessResponse { }
export interface XYZError extends ZulipErrorResponse { }
 */