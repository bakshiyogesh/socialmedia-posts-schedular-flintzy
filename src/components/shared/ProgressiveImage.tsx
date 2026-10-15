'use client';

import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

export type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error';

/** Normalises user input like "images.unsplash.com/..." into an absolute https URL. */
export function normalizeMediaUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Derives a tiny, low-quality placeholder (LQIP) URL for CDNs that support
 * on-the-fly resizing. Returns null when the host is unknown, in which case
 * we fall back to blurring the full image while it streams in.
 */
export function getLowQualityUrl(src: string): string | null {
  try {
    const url = new URL(src);
    if (url.hostname.endsWith('images.unsplash.com')) {
      url.searchParams.set('w', '24');
      url.searchParams.set('q', '10');
      url.searchParams.set('blur', '50');
      url.searchParams.set('auto', 'format');
      return url.toString();
    }
    if (url.hostname.endsWith('picsum.photos')) {
      return `${src}${src.includes('?') ? '&' : '?'}blur=10`;
    }
    return null;
  } catch {
    return null;
  }
}

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Debounce before fetching, so typing a URL doesn't fire a request per keystroke. */
  debounceMs?: number;
  onStateChange?: (state: ImageLoadState) => void;
  /** Compact mode hides the error label (for tiny thumbnails). */
  compact?: boolean;
}

/**
 * Blur-up image loader:
 * 1. Shimmer skeleton while waiting.
 * 2. Low-quality blurred placeholder as soon as it arrives.
 * 3. Full-resolution image cross-fades in once decoded.
 * 4. Explicit error state (never silently swaps to a different image).
 */
export function ProgressiveImage({
  src,
  alt,
  className = '',
  debounceMs = 0,
  onStateChange,
  compact = false,
}: ProgressiveImageProps) {
  const normalized = normalizeMediaUrl(src);
  const [debouncedSrc, setDebouncedSrc] = useState(normalized);
  const [state, setState] = useState<ImageLoadState>(normalized ? 'loading' : 'idle');
  const [lqipLoaded, setLqipLoaded] = useState(false);

  useEffect(() => {
    if (debounceMs <= 0) {
      setDebouncedSrc(normalized);
      return;
    }
    const t = setTimeout(() => setDebouncedSrc(normalized), debounceMs);
    return () => clearTimeout(t);
  }, [normalized, debounceMs]);

  // Reset load state whenever the target URL changes
  useEffect(() => {
    setLqipLoaded(false);
    setState(debouncedSrc ? 'loading' : 'idle');
  }, [debouncedSrc]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  const lqip = debouncedSrc ? getLowQualityUrl(debouncedSrc) : null;
  const isLoaded = state === 'loaded';

  return (
    <div className={`relative w-full h-full overflow-hidden bg-zinc-900 ${className}`}>
      {/* 1. Shimmer skeleton */}
      {state === 'loading' && !lqipLoaded && (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#18181b_8%,#27272a_18%,#18181b_33%)] bg-[length:200%_100%]" />
      )}

      {/* 2. Low-quality blurred placeholder */}
      {lqip && state !== 'error' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`lqip-${lqip}`}
          src={lqip}
          alt=""
          aria-hidden
          onLoad={() => setLqipLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover scale-110 blur-md transition-opacity duration-300 ${
            lqipLoaded && !isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 3. Full-resolution image (blurred until loaded when no LQIP is available) */}
      {debouncedSrc && state !== 'error' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={debouncedSrc}
          src={debouncedSrc}
          alt={alt}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-105'
          }`}
        />
      )}

      {/* 4. Error state */}
      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-zinc-500">
          <ImageOff className="w-4 h-4" />
          {!compact && <span className="text-[10px]">Couldn&apos;t load media</span>}
        </div>
      )}
    </div>
  );
}
