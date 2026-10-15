import { NextResponse } from 'next/server';
import { postsStore } from '@/lib/api/postsStore';
import { isFutureDate } from '@/lib/time';

export async function GET() {
  const posts = postsStore.getAll();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Invariant: scheduledAt must be in the future
    if (!body.scheduledAt || !isFutureDate(body.scheduledAt)) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future.' },
        { status: 400 }
      );
    }

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post content cannot be empty.' },
        { status: 400 }
      );
    }

    if (!body.platforms || !Array.isArray(body.platforms) || body.platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one target platform must be selected.' },
        { status: 400 }
      );
    }

    const created = postsStore.create({
      content: body.content,
      platforms: body.platforms,
      mediaUrl: body.mediaUrl || undefined,
      scheduledAt: body.scheduledAt,
      status: 'scheduled',
      platformOverrides: body.platformOverrides,
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create post. Invalid request payload.' },
      { status: 500 }
    );
  }
}
