import { NextResponse } from "next/server";
import { LeadSchema } from "@cameroon-merchants/config-schema";

// Zero-dependency RFC 4122 compliant UUIDv4 generator
const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Fast helper to generate random E2E reference codes (ex: REF-A93K)
const generateRefCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomStr = "";
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `REF-${randomStr}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const leadData = {
      id: uuidv4(),
      merchantId: body.merchantId,
      productIds: body.productIds,
      source: body.source,
      referenceCode: generateRefCode(),
      createdAt: new Date().toISOString(),
    };

    const parseResult = LeadSchema.safeParse(leadData);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation du lead échouée",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    // In a real application, we would save this to the database.
    // For Phase 1 / this task, we log the lead to server console.
    console.log("Logged Lead server-side:", parseResult.data);

    return NextResponse.json(parseResult.data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to process lead creation request", err);
    return NextResponse.json({ error: "Erreur interne du serveur", message }, { status: 500 });
  }
}
