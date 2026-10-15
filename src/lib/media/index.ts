/**
 * Utility functions for media URL normalization and video format detection.
 */

/** Normalises user input into a valid URL without corrupting data: or blob: protocols. */
export function normalizeMediaUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/** Checks whether a given media URL or Data URL represents a video asset. */
export function isVideoMedia(src: string): boolean {
  if (!src) return false;
  const s = src.toLowerCase();
  if (s.startsWith('data:video/')) return true;
  return /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(s);
}

/**
 * Derives a tiny, low-quality placeholder (LQIP) URL for CDNs that support
 * on-the-fly resizing. Returns null when the host is unknown or media is local/video.
 */
export function getLowQualityUrl(src: string): string | null {
  try {
    if (src.startsWith('data:') || src.startsWith('blob:') || isVideoMedia(src)) return null;
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
