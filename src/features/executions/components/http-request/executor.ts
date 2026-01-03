import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type httpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // todo: publish loading state for manual httpRequestData

  if (!data.endpoint) {
    // todo: publish error state for http request
    throw new NonRetriableError(
      "HTTP Request node is not configured with an endpoint."
    );
  }

  const result = await step.run(`http-request-${nodeId}`, async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const option: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      option.body = data.body;
    }

    const response = await ky(endpoint, option);
    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType?.includes("application/json")
      ? await response.json().catch(() => response.text())
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  //todo: publish success state for http request

  return result;
};
