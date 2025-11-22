import { Result } from "@/core/contracts/Result";
import { ContactUseCase } from "@/modules/contact/application/usecases/contact.usecase";
import { ContactStatus } from "@/modules/contact/domain/Contact";
import { contactRepo } from "@/modules/contact/infra/contact.repository";
import { NextRequest, NextResponse } from "next/server";

const contactUseCase = new ContactUseCase(contactRepo);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, status } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await contactUseCase.createContact({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      status: typeof status === "number" ? status : ContactStatus.New,
    });

    if (!result.ok) {
      return NextResponse.json(Result.fail(result.errors), { status: 400 });
    }

    return NextResponse.json(Result.ok({ id: result.value.id }), {
      status: 201,
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("POST /api/v1/contacts error", err);
    return NextResponse.json(
      Result.fail([{ error: String(err?.message ?? err) }]),
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, status, id } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await contactUseCase.updateContact({
      id,
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      status: typeof status === "number" ? status : ContactStatus.New,
    });

    if (!result.ok) {
      return NextResponse.json(Result.fail(result.errors), { status: 400 });
    }

    return NextResponse.json(Result.ok({ id: result.value.id }), {
      status: 201,
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("POST /api/v1/contacts error", err);
    return NextResponse.json(
      Result.fail([{ error: String(err?.message ?? err) }]),
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams; // For future query params
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const contacts = await contactUseCase.getContacts({ page, pageSize });
  if (!contacts.ok) {
    return NextResponse.json(Result.fail(contacts.errors));
    pageSize;
  }
  return NextResponse.json(Result.ok(contacts.value));
}
