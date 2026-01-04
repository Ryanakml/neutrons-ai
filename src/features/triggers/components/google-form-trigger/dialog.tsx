"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { generateGoogleFormScript } from "./utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params?.workflowId as string;

  // construct webhook URL
  const rawBaseUrl = process.env.NGROK_URL || "http://localhost:3000"; // todo: change to production URL alter
  const baseUrl = rawBaseUrl.startsWith("http")
    ? rawBaseUrl
    : `https://${rawBaseUrl}`;
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      toast.error(`Failed to copy webhook URL ${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Form Trigger</DialogTitle>
          <DialogDescription>
            Configure settings for Google Form trigger.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-sm font-medium">
              Webhook URL
            </Label>
            <div className="flex items-center gap-2">
              <Input
                value={webhookUrl}
                readOnly
                id="webhook-url"
                className="font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
                type="button"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-md font-medium">Setup Instructions :</h4>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
              <li>
                Open your Google Form and click the <strong>More (⋮)</strong>{" "}
                icon in the top right, then select{" "}
                <strong>Script Editor</strong>.
              </li>
              <li>
                Delete any existing code and{" "}
                <strong>paste the Automation Script</strong> provided below.
              </li>
              <li>
                Replace <code>YOUR_WEBHOOK_URL</code> in the script with the URL
                provided in the field below.
              </li>
              <li>
                Click the <strong>Triggers (Clock icon ⏰)</strong> on the left
                sidebar, then click <strong>+ Add Trigger</strong>.
              </li>
              <li>
                Select <code>onFormSubmit</code> as the function,{" "}
                <strong>From form</strong> as the event source, and{" "}
                <strong>On form submit</strong> as the event type.
              </li>
              <li>
                Click <strong>Save</strong> and authorize the required
                permissions (click <em>Advanced</em> if a security warning
                appears).
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="text-md font-medium">Google Apps Script :</h4>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const script = generateGoogleFormScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success("Google Apps Script copied to clipboard");
                } catch (error) {
                  toast.error(`Failed to copy Google Apps Script ${error}`);
                }
              }}
            >
              <CopyIcon className="size-4 mr-2" />
              Google Apps Script
            </Button>
            <p className="text-sm text-muted-foreground">
              This Script include your webhook url and hanlde from submission
            </p>
          </div>
          <div className="rounded-lg bg-muted p-2 space-y-2">
            <h4 className="font-medium text-md">Available Variables</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li className="bg-background px-1 py-0.5 rounded">
                <code>{"{{googleForm.respondentEmail}}"}</code> - responded
                email
              </li>
              <li className="bg-background px-1 py-0.5 rounded">
                <code>{"{{googleForm.responses['Question Name']}}"}</code> -
                specific answer
              </li>
              <li className="bg-background px-1 py-0.5 rounded">
                <code>{"{{json googleForm.responses}}"}</code> - all response
                json
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
