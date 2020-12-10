import { Config } from "../zuliprc";

export interface ReactionsClient {
  add: Promise<unknown>;
  remove: Promise<unknown>;
}

// SECTION ADD REACTIONS
// TODO Find documentation for Add Reactions

// SECTION REMOVE REACTIONS
// TODO Find documentation for Remove Reactions

export function reactions(config: Config): ReactionsClient;
