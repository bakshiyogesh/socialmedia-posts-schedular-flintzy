import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function initMocks() {
  if (typeof window === 'undefined') {
    return;
  }
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    await worker.start();
  }
}
