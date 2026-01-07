"use client";

import { useSuspenseExecution } from "../hooks/use-executions";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2Icon,
  Loader2Icon,
  XCircleIcon,
  ClockIcon,
} from "lucide-react";
import {
  EntityContainer,
  EntityHeader,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ReactNode } from "react";
import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ExecutionDTO = RouterOutput["executions"]["getOne"];
type ExecutionStatus = ExecutionDTO["status"];

const statusMeta: Record<
  ExecutionStatus,
  {
    label: string;
    icon: typeof CheckCircle2Icon;
    iconClassName: string;
    badgeClassName: string;
  }
> = {
  SUCCESS: {
    label: "Success",
    icon: CheckCircle2Icon,
    iconClassName: "text-emerald-600",
    badgeClassName: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  FAILED: {
    label: "Failed",
    icon: XCircleIcon,
    iconClassName: "text-red-600",
    badgeClassName: "text-red-700 bg-red-50 border-red-200",
  },
  RUNNING: {
    label: "Running",
    icon: Loader2Icon,
    iconClassName: "text-blue-600",
    badgeClassName: "text-blue-700 bg-blue-50 border-blue-200",
  },
};

const getDurationSeconds = (startedAt: Date, completedAt?: Date | null) => {
  if (!completedAt) return null;
  return Math.max(
    0,
    Math.round((completedAt.getTime() - startedAt.getTime()) / 1000)
  );
};

const formatJson = (value: unknown) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const ExecutionDetailsContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <EntityContainer
      header={
        <EntityHeader
          title="Execution"
          description="Inspect execution history and output"
        />
      }
      search={null}
      pagination={null}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionDetails = ({ executionId }: { executionId: string }) => {
  const { data } = useSuspenseExecution(executionId);
  const meta = statusMeta[data.status] ?? {
    label: "Queued",
    icon: ClockIcon,
    iconClassName: "text-muted-foreground",
    badgeClassName: "text-muted-foreground bg-muted/40 border-muted",
  };
  const StatusIcon = meta.icon;

  const startedAt = new Date(data.startedAt);
  const completedAt = data.completedAt ? new Date(data.completedAt) : null;
  const duration = getDurationSeconds(startedAt, completedAt);
  const output = formatJson(data.output);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="shadow-none">
        <CardHeader className="gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex size-9 items-center justify-center rounded-full border border-muted bg-background">
                <StatusIcon
                  className={`size-5 ${
                    data.status === "RUNNING" ? "animate-spin" : ""
                  } ${meta.iconClassName}`}
                />
              </div>
              <div>
                <div className="text-lg font-semibold">{meta.label}</div>
                <p className="text-sm text-muted-foreground">
                  Execution for {data.workflow?.name ?? "Deleted Workflow"}
                </p>
              </div>
            </div>
            <Badge className={`border ${meta.badgeClassName}`}>
              {meta.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">Workflow</p>
              <p className="text-sm font-medium">
                {data.workflow?.name ?? "Deleted Workflow"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">Status</p>
              <p className="text-sm font-medium">{meta.label}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">Started</p>
              <p className="text-sm font-medium">
                {formatDistanceToNow(startedAt, { addSuffix: true })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">
                {completedAt ? "Completed" : "Updated"}
              </p>
              <p className="text-sm font-medium">
                {completedAt
                  ? formatDistanceToNow(completedAt, { addSuffix: true })
                  : "In progress"}
              </p>
            </div>
            {duration !== null && (
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground">
                  Duration
                </p>
                <p className="text-sm font-medium">{duration}s</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">Event ID</p>
              <p className="text-sm font-medium break-all">
                {data.inngestEventId}
              </p>
            </div>
          </div>

          {data.status === "FAILED" && (
            <div className="rounded-md border border-red-200 bg-red-50/60 p-4 text-sm text-red-700">
              <div className="font-semibold">Error</div>
              <p className="mt-2">{data.error ?? "Unknown error."}</p>
              {data.errorStack && (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-auto px-0 text-red-700"
                    >
                      Show stack trace
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <pre className="whitespace-pre-wrap break-words rounded-md border border-red-200 bg-white/80 p-3 text-xs text-red-700">
                      {data.errorStack}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          )}

          {data.status === "SUCCESS" && (
            <div className="rounded-md border border-muted bg-muted/20 p-4">
              <div className="text-sm font-semibold">Output</div>
              {output ? (
                <pre className="mt-2 whitespace-pre-wrap break-words rounded-md bg-white/80 p-3 text-xs text-muted-foreground">
                  {output}
                </pre>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No output recorded.
                </p>
              )}
            </div>
          )}

          {data.status === "RUNNING" && (
            <div className="rounded-md border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-700">
              Execution is still running. Refresh to see the latest status.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const ExecutionDetailsLoading = () => (
  <LoadingView message="Loading execution details..." />
);

export const ExecutionDetailsError = () => (
  <ErrorView message="Failed to load execution details." />
);
