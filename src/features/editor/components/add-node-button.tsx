"use client";

import { Button } from "@/components/ui/button";
import { memo } from "react";
import { PlusIcon } from "lucide-react";

export const AddNodeButton = memo(() => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {}}
      className="bg-background"
    >
      <PlusIcon />
    </Button>
  );
});

AddNodeButton.displayName = "AddNodeButton";
