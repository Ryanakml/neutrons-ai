import toposort from "toposort";
import { Connection, Node } from "@prisma-generated/index";
import { inngest } from "./client";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  // 1. Jika tidak ada koneksi, urutan tidak masalah
  if (connections.length === 0) return nodes;

  // 2. Siapkan "Kontrak" antar node (Edges)
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
    // 1. Validasi: "Apakah ini benar-benar object Error?"
    if (error instanceof Error) {
      // Sekarang aman untuk akses .message
      if (error.message.includes("Cyclic dependency")) {
        throw new Error("Workflow contains a cycle (loop)");
      }
      throw error; // Lempar kembali error asli jika bukan soal cycle
    }

    // 2. Fallback: Jika yang dilempar bukan Error (misal string/null)
    throw new Error("An unexpected error occurred during sorting");
  }
};

export const sendWorkflowExectution = async (data: {
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
  });
};
