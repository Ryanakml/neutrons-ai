import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Loader2Icon,
  AlertTriangleIcon,
  PackageOpenIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import React from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "./ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const EntityContainer = ({
  header,
  search,
  children,
  pagination,
}: {
  header: React.ReactNode;
  search: React.ReactNode;
  children: React.ReactNode;
  pagination: React.ReactNode;
}) => {
  return (
    <div className="p-6 space-y-4">
      {header}
      {search}
      <div className="min-h-100">{children}</div>
      {pagination}
    </div>
  );
};

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  title,
  description,
  newButtonLabel = "Create",
  newButtonHref,
  disabled,
  isCreating,
  onNew,
}: EntityHeaderProps) => {
  const renderButton = () => {
    const content = (
      <>
        {isCreating ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <PlusIcon className="size-4 mr-2" />
        )}
        {newButtonLabel}
      </>
    );

    if (newButtonHref) {
      return (
        <Button asChild disabled={disabled || isCreating}>
          <Link href={newButtonHref}>{content}</Link>
        </Button>
      );
    }

    if (onNew) {
      return (
        <Button onClick={onNew} disabled={disabled || isCreating}>
          {content}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-row items-center justify-between gap-x-4 pb-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-bold">{title}</h1>
        {description && (
          <p className="text-lg text-muted-foreground font-bold">
            {description}
          </p>
        )}
      </div>
      {renderButton()}
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

export const LoadingView = ({ message }: StateViewProps) => {
  return (
    <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
      <Loader2Icon className="size-4 mr-2 animate-spin" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-4 mr-2" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="border border-dashed min-h-100 flex flex-col items-center justify-center p-10 text-center">
      <EmptyHeader className="flex flex-col items-center">
        <EmptyMedia className="mb-4">
          <PackageOpenIcon className="size-16 text-muted-foreground/60" />
        </EmptyMedia>
        <EmptyTitle className="text-xl font-bold">
          Data Tidak Ditemukan
        </EmptyTitle>
      </EmptyHeader>

      {!!message && (
        <EmptyDescription className="max-w-sm mt-2 text-slate-500">
          {message}
        </EmptyDescription>
      )}

      {!!onNew && (
        <EmptyContent className="mt-8">
          <Button onClick={onNew} className="px-8 shadow-sm">
            Buat Baru
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  return (
    <div className={className}>
      {items.length === 0
        ? emptyView
        : items.map((item, index) => (
            <div key={getKey(item, index)}>{renderItem(item, index)}</div>
          ))}
    </div>
  );
}

interface EntityListItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntityListItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityListItemProps) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving || !onRemove) return;
    await onRemove();
  };

  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "p-4 hover:bg-background bg-white transition shadow-none border",
          className
        )}
      >
        <CardContent className="flex items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div className="flex flex-col">
              <span className="font-medium text-sm">{title}</span>
              {subtitle && (
                <div className="text-xs text-muted-foreground">{subtitle}</div>
              )}
            </div>
          </div>

          {/* Bagian Actions & Menu */}
          <div className="flex items-center gap-x-2">
            {actions}

            {onRemove && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.preventDefault()}
                >
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={handleRemove}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
