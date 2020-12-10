import { Config } from "./zuliprc";
import { ZulipSuccessResponse, ZulipErrorResponse } from "./types";

export function api(
        baseUrl: string,
        config: Config,
        method: any,
        params: any
    ): Promise<ZulipSuccessResponse | ZulipErrorResponse>;