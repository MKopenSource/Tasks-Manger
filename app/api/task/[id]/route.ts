import { auth } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: Request, { params }: { params: any }) => {
  try {
    const { id } = params;
    const task = await prisma.task.findUnique({ where: { id } });

    return NextResponse.json({ task, status: 500 });
  } catch (error) {
    console.log(error);
  }
};

export const PUT = async (req: Request, { params }: { params: any }) => {
  try {
    const { id } = params;
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }

    const { title, description, important, completed, date } = await req.json();

    const task = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        isImporatnt: important,
        completed,
        date,
        userId: userId,
      },
    });
    revalidatePath("/");
    return NextResponse.json({ task, status: 500 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error creating task", status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: any }) => {
  const { id } = params;
  console.log(id);
  try {
    await prisma.task.delete({ where: { id: id } });
    revalidatePath("/");
    return new NextResponse("Post has been deleted ", { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
};