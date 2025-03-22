import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const cookieStore = await cookies(); // Ensure `cookies()` is called inside the function
  cookieStore.delete("authtoken");

  return NextResponse.json(
    { message: "success", success: true },
    { status: 200 }
  );
}
