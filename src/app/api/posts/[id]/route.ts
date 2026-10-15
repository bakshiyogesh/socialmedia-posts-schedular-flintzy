import { NextResponse } from 'next/server';
import { postsStore } from '@/lib/api/postsStore';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const updates = await request.json();

  const updated = postsStore.update(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const deleted = postsStore.delete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, id });
}
