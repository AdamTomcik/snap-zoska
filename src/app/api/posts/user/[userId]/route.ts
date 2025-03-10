import { NextResponse } from 'next/server';
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

// GET posts by userId
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: params.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch user posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
} 