"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export const FormSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Variable name must contain only letters, numbers, and underscores",
    }),
  username: z.string().optional(),
  content: z.string().min(1, { message: "Content is required" }).max(2000, {
    message: "Content must be at most 2000 characters",
  }),
  webhookUrl: z.string().min(1, { message: "Webhook URL is required" }),
});

export type DiscordFormValues = z.infer<typeof FormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DiscordFormValues) => void;
  defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<DiscordFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "myDiscord",
      username: defaultValues.username || "",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "myDiscord",
        username: defaultValues.username || "",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = useWatch({
    control: form.control,
    name: "variableName",
  });

  const onHandleSubmit = (values: DiscordFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Discord Configuration</DialogTitle>
          <DialogDescription>
            Configure the Discord webhook setting to this node
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onHandleSubmit)}
            className="space-y-6 mt-4"
          >
            {/* Variable Name Section */}
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="myDiscord" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Use this name to reference the result in other nodes:{" "}
                    <code>
                      {"{{"}
                      {watchVariableName || "variableName"}.text{"}}"}
                    </code>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model Selection Section */}
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    The Discord webhook URL to send messages to. get this from
                    your Discord channel settings.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* System Prompt Section */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summary: {{myGemini.text}}"
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    The message to send. use {"{{variables}}"} for simple value,
                    or {"{{json variable}}"} to stringify objects.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="workflow-bot" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    overwrite the webhooks default bot username.
                  </FormDescription>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Configuration</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
