export const NODE_TYPES = [
  "INITIAL",
  "MANUAL_TRIGGER",
  "HTTP_REQUEST",
] as const;

export const NodeType = {
  INITIAL: "INITIAL",
  MANUAL_TRIGGER: "MANUAL_TRIGGER",
  HTTP_REQUEST: "HTTP_REQUEST",
} as const;

export type NodeType = (typeof NODE_TYPES)[number];
