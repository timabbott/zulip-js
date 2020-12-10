import { Config } from "../zuliprc";
import { RetrieverClient, ZulipSuccessResponse, ZulipErrorResponse } from "../types";

export type AccountsClient = RetrieverClient;

// SECTION GET ACCOUNTS
// TODO Find documentation on Get Accounts
export interface GetAccountsParams { }
export type GetAccountsResponse = GetAccountsSuccess | GetAccountsError;
export interface GetAccountsSuccess extends ZulipSuccessResponse { }
export interface GetAccountsError extends ZulipErrorResponse { }

export default function accounts(config: Config): AccountsClient;