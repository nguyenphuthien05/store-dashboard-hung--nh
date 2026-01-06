"use client";

import { Trash } from "lucide-react";
import { useTransition } from "react";
import { deleteProduct } from "./actions";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to delete this product?")) {
          startTransition(async () => {
            await deleteProduct(id);
          });
        }
      }}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
}
