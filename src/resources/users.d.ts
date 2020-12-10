import { Config } from "../zuliprc";
import { RetrieverClient, ZulipSuccessResponse, ZulipErrorResponse, Caller, Subscription } from "../types";

export interface UsersClient extends RetrieverClient {
  create: Caller<CreateUserParams, CreateUserResponse>;
  me: UsersMeClient;
}

export interface UsersMeClient {
  pointer: UsersMePointerClient;
  getProfile: Caller<GetProfileParams, GetProfileResponse>;
  subscriptions: SubscriptionsClient;
  alertWords: AlertWordsClient
}

export interface UsersMePointerClient {
  retrieve: Caller<GetUserInfoPointerParams, GetUserInfoPointerResponse>;
  update: Caller<UpdateUserInfoPointerParams, UpdateUserInfoPointerResponse>;
}

export interface SubscriptionsClient {
  add: Caller<AddUserSubscriptionsParams, AddUserSubscriptionsResponse>;
  remove: Caller<RemoveUserSubscriptionsParams, RemoveUserSubscriptionsResponse>;
}

export type AlertWordsClient = RetrieverClient<GetAlertWordsParams, GetAlertWordsResponse>;

// SECTION CREATE USER
export interface CreateUserParams {
  /** The email address of the new user. */
  email: string;
  /** The password of the new user. */
  password: string;
  /** The full name of the new user. */
  full_name: string;
  /** The short name of the new user. Not user-visible. */
  short_name: string;
}

export type CreateUserResponse = CreateUserSuccess | CreateUserError;

export interface CreateUserSuccess extends ZulipSuccessResponse {}

export interface CreateUserError extends ZulipErrorResponse { }

// SECTION GET MY INFO
export interface GetMyInfoParams {}

export type GetMyInfoResponse = GetMyInfoSuccess | GetMyInfoError;

export interface GetMyInfoSuccess extends ZulipSuccessResponse {
  avatar_url: string;
  client_id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_bot: boolean;
  max_message_id: number;
  pointer: number;
  profile_data: { [key: string]: ProfileData };
  short_name: string;
  user_id: number;
}

export interface GetMyInfoError extends ZulipErrorResponse { }

// SECTION GET USER INFO POINTER
// TODO Find documentation on Get User Info Pointer
export interface GetUserInfoPointerParams { }

export type GetUserInfoPointerResponse = GetUserInfoPointerSuccess | GetUserInfoPointerError;

export interface GetUserInfoPointerSuccess extends ZulipSuccessResponse { }

export interface GetUserInfoPointerError extends ZulipErrorResponse { }

// SECTION UPDATE USER INFO POINTER
// TODO Find documentation on Update User Info Pointer
export interface UpdateUserInfoPointerParams { }

export type UpdateUserInfoPointerResponse = UpdateUserInfoPointerSuccess | UpdateUserInfoPointerError;

export interface UpdateUserInfoPointerSuccess extends ZulipSuccessResponse { }

export interface UpdateUserInfoPointerError extends ZulipErrorResponse { }

// SECTION GET PROFILE
// TODO Find documentation on
export interface GetProfileParams { }

export type GetProfileResponse = GetProfileSuccess | GetProfileError;

export interface GetProfileSuccess extends ZulipSuccessResponse { }

export interface GetProfileError extends ZulipErrorResponse { }

// SECTION ADD USER SUBSCRIPTIONS
export interface AddUserSubscriptionsParams {
  /**
   * A list of dictionaries containing the the key name and value specifying the name of the stream to subscribe.
   * If the stream does not exist a new stream is created. The description of the stream created can be specified by
   * setting the dictionary key description with an appropriate value.Note: This argument is called streams and not
   * subscriptions in our Python API.
   */
  subscriptions: Subscription[];
  /**	A boolean specifying whether the streams specified in subscriptions are invite-only or not. Defaults to false. */
  invite_only?: boolean;
  /**
   * A list of email addresses of the users that will be subscribed to the streams specified in the subscriptions argument.
   * If not provided, then the requesting user/bot is subscribed. Defaults to [].
   */
  principals?: string[];
  /**
   * A boolean specifying whether authorization errors (such as when the requesting user is not authorized to access a private stream)
   * should be considered fatal or not. When True, an authorization error is reported as such. When set to False, the returned JSON
   * payload indicates that there was an authorization error, but the response is still considered a successful one. Defaults to true.
   */
  authorization_errors_fatal?: boolean;
  /**	A boolean indicating if the history should be available to newly subscribed members. Defaults to "None". */
  history_public_to_subscribers?: boolean;
  /**
   * A boolean indicating if the stream is an announcements only stream. Only organization admins can post to announcements only streams.
   * Defaults to false.
   */
  is_announcement_only?: boolean;
  /**
   * If announce is True and one of the streams specified in subscriptions has to be created (i.e. doesn't exist to begin with),
   * an announcement will be made notifying that a new stream was created.
   * */
  announce?: boolean;
}

export type AddUserSubscriptionsResponse = AddUserSubscriptionsSuccess | AddUserSubscriptionsError;

export interface AddUserSubscriptionsSuccess extends ZulipSuccessResponse {
  already_subscribed?: UserSubscriptionStatuses;
  subscribed?: UserSubscriptionStatuses;
  unauthorized?: string[];
}

export interface AddUserSubscriptionsError extends ZulipErrorResponse { }

// SECTION REMOVE USER SUBSCRIPTIONS
export interface RemoveUserSubscriptionsParams {
  /**	A list of stream names to unsubscribe from. This argument is called streams in our Python API. */
  subscriptions: string[] & { 0: string };
  /**
   * A list of email addresses of the users that will be unsubscribed from the streams specified in the subscriptions argument.
   * If not provided, then the requesting user/bot is unsubscribed. */
  principals?: string[];
}

export type RemoveUserSubscriptionsResponse = RemoveUserSubscriptionsSuccess | RemoveUserSubscriptionsError;

export interface RemoveUserSubscriptionsSuccess extends ZulipSuccessResponse {
  not_removed: string[];
  removed: string;
}

export interface RemoveUserSubscriptionsError extends ZulipErrorResponse {
  code: string;
  stream: string;
}

// SECTION GET ALERT WORDS
// TODO Find documentation on Get Alert Words
export interface GetAlertWordsParams { }

export type GetAlertWordsResponse = GetAlertWordsSuccess | GetAlertWordsError;

export interface GetAlertWordsSuccess extends ZulipSuccessResponse { }

export interface GetAlertWordsError extends ZulipErrorResponse { }

// SECTION GENERAL TYPES
export interface ProfileData {
  value: string;
  rendered_value?: string;
}

export interface UserSubscriptionStatuses {
  [key: string]: string[]
}

export function users(config: Config): UsersClient;
