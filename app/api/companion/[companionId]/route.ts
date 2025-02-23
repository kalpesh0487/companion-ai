import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { name, description, instructions, seed, src, catagoryId } = body;

    if (!params.companionId) {
      console.log(params);
      return new NextResponse("companin Id is Required", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized Request", { status: 401 });
    }

    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !catagoryId
    ) {
      return new NextResponse("catagory " + catagoryId, { status: 400 });
    }

    const ispro = await checkSubscription();

    if (!ispro) {
      return new NextResponse("Pro subscription is required", { status: 403 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,
        userId: user.id,
      },
      data: {
        catagoryId,
        userId: user.id,
        userName: user.firstName,
        name,
        description,
        src,
        instructions,
        seed,
      },
    });
    return NextResponse.json(companion);
  } catch (error) {
    console.log("companion_PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("Companion_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
