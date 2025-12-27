import { createSearchParamsCache } from "nuqs/server";
import { workflowsParams } from "../params";

export const workflowParamsCache = createSearchParamsCache(workflowsParams);
