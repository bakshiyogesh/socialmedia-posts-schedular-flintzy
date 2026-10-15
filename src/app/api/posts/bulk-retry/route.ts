import { NextResponse } from 'next/server';
import { postsStore } from '@/lib/api/postsStore';

export async function POST() {
  // 1-second simulated delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const result = postsStore.bulkRetry();
  return NextResponse.json(result);
}
