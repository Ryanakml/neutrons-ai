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

    const formData = {
      formId: body.formId,
      title: body.title || body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    await sendWorkflowExecution({
      workflowId: workflowId,
      initialData: {
        googleForm: formData,
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
    console.error("Error handling Google Form workflow:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process Google Form workflow.",
      },
      { status: 500 }
    );
  }
}
