import { Config } from "../zuliprc";
import { RetrieverClient } from "../types";

export type FiltersClient = RetrieverClient;

// SECTION GET FILTERS FOR REALM
// TODO Find documentation on Get Filters for Realm

export function filters(config: Config): FiltersClient;
