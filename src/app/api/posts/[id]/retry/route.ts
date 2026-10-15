import { NextResponse } from 'next/server';
import { postsStore } from '@/lib/api/postsStore';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // 1-second simulated network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const result = postsStore.retry(id);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || 'Simulated retry failure' },
      { status: 500 }
    );
  }

  return NextResponse.json(result.post);
}
