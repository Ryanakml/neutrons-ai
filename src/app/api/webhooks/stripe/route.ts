import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing workflowId parameter.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const stripeData = {
      // event metadata
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    await sendWorkflowExecution({
      workflowId: workflowId,
      initialData: {
        stripe: stripeData,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Stripe workflow execution triggered successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling Stripe workflow:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process Stripe workflow.",
      },
      { status: 500 }
    );
  }
}
