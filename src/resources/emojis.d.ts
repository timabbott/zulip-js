import { Config } from "../zuliprc";
import { RetrieverClient, ZulipSuccessResponse, ZulipErrorResponse } from "../types";

export type EmojisClient = RetrieverClient;

// SECTION GET EMOJIS
export interface GetEmojisParams { }

export type GetEmojisResponse = GetEmojisSuccess | GetEmojisError;

export interface GetEmojisSuccess extends ZulipSuccessResponse {
  emoji: {
    [key: number]: Emoji;
  }
}

export interface Emoji {
  author: {
    email: string;
    full_name: string;
    id: number;
  },
  deactivated: boolean;
  id: string;
  name: string;
  source_url: string;
}

export interface GetEmojisError extends ZulipErrorResponse { }

// SECTION UPLOAD EMOJIS
// TODO Find documentation on Get Emojis
export interface UploadEmojisParams { }

export type UploadEmojisResponse = UploadEmojisSuccess | UploadEmojisError;

export interface UploadEmojisSuccess extends ZulipSuccessResponse { }

export interface UploadEmojisError extends ZulipErrorResponse { }


export default function emojis(config: Config): EmojisClient;
