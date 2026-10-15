'use client';

import React, { useState } from 'react';
import { Key, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { useRetryPostMutation } from '../hooks/usePosts';
import type { Post } from '@/types';
import { toast } from 'sonner';

interface OAuthReconnectModalProps {
  post: Post | null;
  onClose: () => void;
}

export function OAuthReconnectModal({ post, onClose }: OAuthReconnectModalProps) {
  const [isReconnecting, setIsReconnecting] = useState(false);
  const retryMutation = useRetryPostMutation();

  // Lock background scroll while the modal is open.
  // Must run before the early return so hook order is stable across renders.
  React.useEffect(() => {
    if (!post) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [post]);

  if (!post) return null;

  const handleReconnect = async () => {
    setIsReconnecting(true);
    await new Promise((r) => setTimeout(r, 1200)); // Simulate OAuth handshake
    toast.success('OAuth Token Refreshed Successfully!', {
      description: 'Account authorization verified. Retrying publishing pipeline...',
    });
    retryMutation.mutate(post.id);
    setIsReconnecting(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Refresh OAuth Authorization
              </h3>
              <p className="text-xs text-zinc-400">
                Resolve token expiration error for {post.platforms.join(', ').toUpperCase()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 space-y-2 text-xs text-zinc-300">
          <p className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Official Platform Graph API Security Protocol
          </p>
          <p className="text-zinc-400">
            Social APIs automatically revoke tokens every 60 days or when security settings change. Re-authorizing grants Flintzy write permissions to execute scheduled queue jobs.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReconnect}
            disabled={isReconnecting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 transition-colors shadow-lg shadow-amber-600/20"
          >
            {isReconnecting ? (
              <span>Exchanging Tokens...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize & Re-arm Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
