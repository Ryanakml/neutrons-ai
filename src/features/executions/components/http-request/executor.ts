import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import * as HandleBars from "handlebars";

HandleBars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type httpRequestData = {
  variableName?: string;
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

  if (!data.variableName) {
    // todo: publish error state for http request
    throw new NonRetriableError(
      "HTTP Request node is not configured with a variable name."
    );
  }

  const result = await step.run(`http-request-${nodeId}`, async () => {
    const endpoint = HandleBars.compile(data.endpoint)(context);
    const method = data.method || "GET";

    const option: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = HandleBars.compile(data.body || "")(context);
      JSON.parse(resolved); // validate JSON
      option.body = resolved;
      option.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, option);
    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json")
      ? await response.json().catch(() => response.text())
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName!]: responsePayload,
    };
  });

  // todo: publish success state for http request

  return result;
};
