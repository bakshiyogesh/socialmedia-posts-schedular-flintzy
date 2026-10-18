'use client';

import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { normalizeMediaUrl, isVideoMedia, getLowQualityUrl } from '@/lib/media';

export { normalizeMediaUrl, isVideoMedia, getLowQualityUrl };
export type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Debounce before fetching, so typing a URL doesn't fire a request per keystroke. */
  debounceMs?: number;
  onStateChange?: (state: ImageLoadState) => void;
  /** Compact mode hides the error label (for tiny thumbnails). */
  compact?: boolean;
  /** Explicitly flag as video if known from file upload metadata */
  isVideo?: boolean;
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
  isVideo = false,
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
    if (!debouncedSrc) {
      setState('idle');
      return;
    }
    setState('loading');
  }, [debouncedSrc]);

  // Safeguard: if an external image hangs or takes longer than 6 seconds, gracefully flag error
  useEffect(() => {
    if (state !== 'loading' || !debouncedSrc) return;
    const timer = setTimeout(() => {
      setState('error');
    }, 6000);
    return () => clearTimeout(timer);
  }, [state, debouncedSrc]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  const isVideoItem = isVideo || isVideoMedia(debouncedSrc);
  const lqip = (!isVideoItem && debouncedSrc) ? getLowQualityUrl(debouncedSrc) : null;
  const isLoaded = state === 'loaded';

  return (
    <div className={`relative w-full h-full overflow-hidden bg-zinc-900 ${className}`}>
      {/* 1. Shimmer skeleton */}
      {state === 'loading' && !lqipLoaded && (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#18181b_8%,#27272a_18%,#18181b_33%)] bg-[length:200%_100%]" />
      )}

      {/* 2. Low-quality blurred placeholder (for static images) */}
      {lqip && state !== 'error' && !isVideoItem && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`lqip-${lqip}`}
          src={lqip}
          alt=""
          aria-hidden
          referrerPolicy="no-referrer"
          loading="eager"
          onLoad={() => setLqipLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover scale-110 blur-md transition-opacity duration-200 ${
            lqipLoaded && !isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 3a. Video player frame */}
      {debouncedSrc && state !== 'error' && isVideoItem && (
        <video
          key={debouncedSrc}
          src={debouncedSrc}
          aria-label={alt}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onLoadedData={() => setState('loaded')}
          onError={() => setState('error')}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 3b. Full-resolution image */}
      {debouncedSrc && state !== 'error' && !isVideoItem && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={(el) => {
            // Immediate cache check: if browser already loaded/cached this image, mark loaded instantly
            if (el && el.complete && el.naturalWidth > 0 && state !== 'loaded') {
              setState('loaded');
            }
          }}
          key={debouncedSrc}
          src={debouncedSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="eager"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ease-out ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-102'
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
