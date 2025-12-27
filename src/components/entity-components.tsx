import Link from "next/link";
import { Button } from "@/components/ui/button"; // Asumsi menggunakan shadcn/ui
import { PlusIcon, Loader2Icon } from "lucide-react";

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
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {renderButton()}
    </div>
  );
};
