import { http, HttpResponse, delay } from 'msw';
import { postsStore } from '@/lib/api/postsStore';
import { isFutureDate } from '@/lib/time';

export const handlers = [
  // GET /api/posts
  http.get('/api/posts', () => {
    const posts = postsStore.getAll();
    return HttpResponse.json(posts);
  }),

  // POST /api/posts
  http.post('/api/posts', async ({ request }) => {
    const body = (await request.json()) as any;

    if (!body.scheduledAt || !isFutureDate(body.scheduledAt)) {
      return HttpResponse.json(
        { error: 'Scheduled time must be in the future.' },
        { status: 400 }
      );
    }

    if (!body.content || body.content.trim().length === 0) {
      return HttpResponse.json(
        { error: 'Post content cannot be empty.' },
        { status: 400 }
      );
    }

    const created = postsStore.create({
      content: body.content,
      platforms: body.platforms || ['x'],
      mediaUrl: body.mediaUrl || undefined,
      scheduledAt: body.scheduledAt,
      status: 'scheduled',
      platformOverrides: body.platformOverrides,
    });

    return HttpResponse.json(created, { status: 201 });
  }),

  // POST /api/posts/:id/retry
  http.post('/api/posts/:id/retry', async ({ params }) => {
    const { id } = params;
    // 1-second simulated delay
    await delay(1000);

    const result = postsStore.retry(id as string);
    if (!result.success) {
      return HttpResponse.json(
        { error: result.error || 'Simulated retry failure' },
        { status: 500 }
      );
    }

    return HttpResponse.json(result.post);
  }),

  // POST /api/posts/bulk-retry
  http.post('/api/posts/bulk-retry', async () => {
    await delay(1000);
    const result = postsStore.bulkRetry();
    return HttpResponse.json(result);
  }),

  // PATCH /api/posts/:id
  http.patch('/api/posts/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as any;
    const updated = postsStore.update(id as string, updates);
    if (!updated) {
      return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  // DELETE /api/posts/:id
  http.delete('/api/posts/:id', ({ params }) => {
    const { id } = params;
    const deleted = postsStore.delete(id as string);
    if (!deleted) {
      return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, id });
  }),
];
