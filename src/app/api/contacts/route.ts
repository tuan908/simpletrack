import { db } from "@/infra/db/client";
import { contact } from "@/infra/db/schema/contact";
import { NextResponse } from "next/server";
import { v7 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, status } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newRow = {
      id: uuidv4(),
      name: String(name).trim(),
      email: email ?? null,
      phone: phone ?? null,
      company: company ?? null,
      status: typeof status === "number" ? status : 0,
    };

    // Insert via drizzle
    // @ts-ignore
    await db.insert(contact).values(newRow as any);

    return NextResponse.json({ ok: true, id: newRow.id }, { status: 201 });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("POST /api/contacts error", err);
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
