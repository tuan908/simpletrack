import { Result } from "@/core/contracts/Result";
import { db } from "@/infra/db/client";
import { contact } from "@/infra/db/schema/contact";
import { ContactUseCase } from "@/modules/contact/application/usecases/contact.usecase";
import { contactRepo } from "@/modules/contact/infra/contact.repository";
import { NextRequest, NextResponse } from "next/server";
import { v7 as uuidv4 } from "uuid";

const contactUseCase = new ContactUseCase(contactRepo);

export async function POST(req: NextRequest) {
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

    await db.insert(contact).values(newRow);

    return NextResponse.json(Result.ok({ id: newRow.id }), { status: 201 });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("POST /api/v1/contacts error", err);
    return NextResponse.json(
      Result.fail([{ error: String(err?.message ?? err) }]),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams  = req.nextUrl.searchParams; // For future query params
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 200;
  const contacts = await contactUseCase.getContacts({page, pageSize});
  if (!contacts.ok) {
    return NextResponse.json(Result.fail(contacts.errors));
  }
 return NextResponse.json(Result.ok(contacts.value));
}
