"use client";

import {
  EntityHeader,
  EntityList,
  EntityContainer,
  LoadingView,
  ErrorView,
  EmptyView,
} from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ExecutionDTO = RouterOutput["executions"]["getMany"]["items"][number];
type ExecutionStatus = ExecutionDTO["status"];

interface EntityItemProps {
  href: string;
  title: string;
  subtitle: React.ReactNode;
  image: React.ReactNode;
}

interface EntityPaginationProps {
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const EntityItem = ({ href, title, subtitle, image }: EntityItemProps) => (
  <Link
    href={href}
    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b"
  >
    {image}
    <div className="flex flex-col">
      <span className="font-medium text-sm capitalize">
        {title.toLowerCase()}
      </span>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </div>
  </Link>
);

const EntityPagination = ({
  totalPages,
  page,
  onPageChange,
  disabled,
}: EntityPaginationProps) => (
  <div className="flex items-center justify-end gap-2 p-4">
    <Button
      variant="outline"
      size="sm"
      disabled={page <= 1 || disabled}
      onClick={() => onPageChange(page - 1)}
    >
      <ChevronLeft className="size-4" />
    </Button>
    <span className="text-sm font-medium">
      Page {totalPages > 0 ? page : 0} of {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      disabled={page >= totalPages || disabled}
      onClick={() => onPageChange(page + 1)}
    >
      <ChevronRight className="size-4" />
    </Button>
  </div>
);

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={
        <EntityHeader
          title="Executions"
          description="View your workflow history"
        />
      }
      pagination={<ExecutionsPaginationComponent />}
      search={null}
    >
      {children}
    </EntityContainer>
  );
};

const ExecutionsPaginationComponent = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case "SUCCESS":
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case "FAILED":
      return <XCircleIcon className="size-5 text-red-600" />;
    case "RUNNING":
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

export const ExecutionItem = ({
  data,
}: {
  data: Omit<ExecutionDTO, "workflow"> & {
    workflow: {
      id: string;
      name: string;
    } | null;
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000
      )
    : null;

  const subtitle = (
    <div className="flex items-center gap-1">
      <span className="font-semibold">
        {data.workflow?.name ?? "Deleted Workflow"}
      </span>
      <span>&bull;</span>
      <span>
        Started{" "}
        {formatDistanceToNow(new Date(data.startedAt), { addSuffix: true })}
      </span>
      {duration !== null && (
        <>
          <span>&bull;</span>
          <span>Took {duration}s</span>
        </>
      )}
    </div>
  );

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.status}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};

export const ExecutionsLoading = () => (
  <LoadingView message="loading executions, please wait!" />
);
export const ExecutionsError = () => (
  <ErrorView message="Error executions, try again!" />
);
export const ExecutionsEmpty = () => (
  <EmptyView message="Empty executions, run your workflow!" />
);
