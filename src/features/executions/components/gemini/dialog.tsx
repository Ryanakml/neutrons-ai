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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
] as const;

export const FormSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Variable name must contain only letters, numbers, and underscores",
    }),
  model: z.enum(GEMINI_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: "User prompt is required" }),
});

export type GeminiFormValues = z.infer<typeof FormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "myApiCall",
      model: defaultValues.model || "gemini-2.5-flash",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "myApiCall",
        model: defaultValues.model || "gemini-2.5-flash",
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = useWatch({
    control: form.control,
    name: "variableName",
  });

  const onHandleSubmit = (values: GeminiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Gemini Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
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
                    <Input placeholder="myApiCall" {...field} />
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
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GEMINI_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    The Google Gemini model to use for completion.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* System Prompt Section */}
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., You are a helpful assistant that summarizes technical documentation."
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Sets the behavior of the assistant. Use{" "}
                    <code>{"{{variables}}"}</code> for simple values or{" "}
                    <code>{"{{json variable}}"}</code> to stringify objects.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* User Prompt Section */}
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Summarize this text: {{json httpResponse.data}}"
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    The prompt to send to the AI. You can inject dynamic data
                    from previous nodes.
                  </FormDescription>
                  <FormMessage />
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
