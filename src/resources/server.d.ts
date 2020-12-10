import { Config } from "../zuliprc";
import { Caller, ZulipSuccessResponse, ZulipErrorResponse } from "../types";

export interface ServerClient {
  settings: Caller;
}

export interface GetServerSettingsParams {}

export type GetServerSettingsResponse = GetServerSettingsSuccess | GetServerSettingsError;

export interface GetServerSettingsSuccess extends ZulipSuccessResponse {
  /** object in which each key-value pair in the object indicates whether the authentication method is enabled on this server. */
  authentication_methods: { [key in AuthenticationMethod]: boolean };
  /** the version of Zulip running in the server. */
  zulip_version: string;
  /** whether mobile/push notifications are enabled. */
  push_notifications_enabled: boolean;
  /** whether the Zulip client that has sent a request to this endpoint is deemed incompatible with the server. */
  is_incompatible: boolean;
  /** setting for allowing users authenticate with an email-password combination. */
  email_auth_enabled: boolean;
  /** whether usernames should have an email address format. This is important for clients to know whether the validate email address format in a login prompt; this value will be false if the server has LDAP authentication enabled with a username and password combination. */
  require_email_format_usernames: string;
  /** the organization's canonical URI. */
  realm_uri: string;
  /** the organization's name (for display purposes). */
  realm_name: string;
  /** the URI of the organization's logo as a square image, used for identifying the organization in small locations in the mobile and desktop apps. */
  realm_icon: string;
  /** HTML description of the organization, as configured by the organization profile. */
  realm_description: string;
  /** list of dictionaries describing the available external authentication methods (such as google/github/SAML) enabled for this organization. Each dictionary specifies the name and icon that should be displayed on the login buttons (display_name and display_icon, where display_icon can be null, if no icon is to be displayed), the URLs that should be accessed to initiate login/signup using the method (login_url and signup_url) and name, which is a unique, stable, machine-readable name for the authentication method. The list is sorted in the order in which these authentication methods should be displayed. */
  external_authentication_methods: ExternalAuthenticationMethod[];
}

export interface GetServerSettingsError extends ZulipErrorResponse { }

// SECTION GENERAL TYPES
export type AuthenticationMethod =
  | "azuread"
  | "dev"
  | "email"
  | "github"
  | "google"
  | "ldap"
  | "password"
  | "remoteuser"
  | "saml";


export type ExternalAuthenticationMethod =
  | SAMLAuthenticationMethod
  | GoogleAuthenticationMethod
  | GitHubAuthenticationMethod;

export interface SAMLAuthenticationMethod {
  display_icon: null,
  display_name: "SAML",
  login_url: string;
  name: "saml:idp_name",
  signup_url: string;
}

export interface GoogleAuthenticationMethod {
  display_icon: string;
  display_name: "Google";
  login_url: string;
  name: "google";
  signup_url: string;
}

export interface GitHubAuthenticationMethod {
  display_icon: string;
  display_name: "GitHub";
  login_url: string;
  name: "github";
  signup_url: string;
}

export function server(config: Config): ServerClient;
