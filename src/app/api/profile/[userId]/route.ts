import { NextResponse } from 'next/server';
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

// GET profile by userId
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // First try to find existing profile with user data
    const profile = await prisma.profile.findUnique({
      where: { userId: params.userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!profile) {
      // If profile doesn't exist, create a new one with user data
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const newProfile = await prisma.profile.create({
        data: {
          userId: params.userId,
          interests: [],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json(newProfile);
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT update profile
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { bio, location, interests, avatarUrl } = body;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: params.userId },
      update: {
        bio,
        location,
        interests,
        avatarUrl,
      },
      create: {
        userId: params.userId,
        bio,
        location,
        interests,
        avatarUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 