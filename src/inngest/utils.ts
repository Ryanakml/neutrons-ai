import toposort from "toposort";
import { Connection, Node } from "@prisma-generated/index";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  if (connections.length === 0) return nodes;

  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  try {
    const sortedIds = toposort(edges);
    const sortedIdsSet = new Set(sortedIds);
    const isolatedNodeIds = nodes
      .filter((n) => !sortedIdsSet.has(n.id))
      .map((n) => n.id);

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    return [...isolatedNodeIds, ...sortedIds]
      .map((id) => nodeMap.get(id))
      .filter((n): n is Node => !!n);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("Cyclic dependency")) {
        throw new Error("Workflow contains a cycle (loop)");
      }
      throw error;
    }

    throw new Error("An unexpected error occurred during sorting");
  }
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  initialData?: Record<string, unknown>;
  [key: string]: unknown;
}) => {
  return inngest.send({
    name: "workflows/execute.workflow",
    data: {
      workflowId: data.workflowId,
      initialData: data.initialData,
    },
    id: createId(),
  });
};
