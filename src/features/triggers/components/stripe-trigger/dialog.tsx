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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STRIPE_VARIABLES = [
  { key: "stripe.amount", label: "Payment amount" },
  { key: "stripe.currency", label: "Currency code" },
  { key: "stripe.customerId", label: "Customer ID" },
  { key: "json stripe", label: "Full event data as JSON" },
];

export const StripeVariableList = () => {
  return (
    <ul className="text-sm text-muted-foreground space-y-1">
      {STRIPE_VARIABLES.map((item) => (
        <li key={item.key}>
          <code className="bg-background px-1 py-0.5 rounded">
            {"{{"}
            {item.key}
            {"}}"}
          </code>
          {" — "}
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params?.workflowId as string;

  // construct webhook URL
  const rawBaseUrl = process.env.NGROK_URL || "http://localhost:3000"; // todo: change to production URL alter
  const baseUrl = rawBaseUrl.startsWith("http")
    ? rawBaseUrl
    : `https://${rawBaseUrl}`;
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

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
          <DialogTitle>Stripe Trigger</DialogTitle>
          <DialogDescription>
            Configure settings for Stripe trigger.
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
              <li>Open stipe dasboard</li>
              <li>go to developer - webhook</li>
              <li>click add endpoint</li>
              <li>copy paste the url above</li>
              <li>
                select event to listen to, e.g.{" "}
                <em>checkout.session.completed</em>
              </li>
              <li>copy and paste the sign in secret</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-2 space-y-2">
            <h4 className="font-medium text-md">Available Variables</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{stripe.amount}}"}
                  </code>
                  {" — "}Payment amount
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{stripe.currency}}"}
                  </code>
                  {" — "}Currency code
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{stripe.customerId}}"}
                  </code>
                  {" — "}Customer ID
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{json stripe}}"}
                  </code>
                  {" — "}Full event data as JSON
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{stripe.eventType}}"}
                  </code>
                  {" — "}Payment intent success
                </li>
              </ul>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
