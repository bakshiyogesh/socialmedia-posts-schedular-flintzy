import React from 'react';
import type { PlatformId } from '@/types';

interface PlatformIconProps extends React.SVGProps<SVGSVGElement> {
  platform: PlatformId;
  size?: number;
  className?: string;
}

export function PlatformIcon({ platform, size = 18, className = '', ...props }: PlatformIconProps) {
  switch (platform) {
    case 'x':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-label="X"
          {...props}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-label="Instagram"
          {...props}
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-label="TikTok"
          {...props}
        >
          {/* Authentic TikTok chromatic glitch layers */}
          <path
            d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.896 2.896 2.896 0 0 1-2.896-2.896 2.896 2.896 0 0 1 2.896-2.891c.328 0 .64.049.938.139V9.434a6.32 6.32 0 0 0-.938-.07 6.34 6.34 0 0 0-6.34 6.342 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.217 8.217 0 0 0 5.176 1.832V7.467a4.81 4.81 0 0 1-1.41-.781z"
            fill="#25F4EE"
            transform="translate(-0.6, -0.4)"
          />
          <path
            d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.896 2.896 2.896 0 0 1-2.891 2.896 2.896 2.896 0 0 1-2.896-2.896 2.896 2.896 0 0 1 2.896-2.891c.328 0 .64.049.938.139V9.434a6.32 6.32 0 0 0-.938-.07 6.34 6.34 0 0 0-6.34 6.342 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.217 8.217 0 0 0 5.176 1.832V7.467a4.81 4.81 0 0 1-1.41-.781z"
            fill="#FE2C55"
            transform="translate(0.6, 0.4)"
          />
          <path
            d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.896 2.896 2.896 0 0 1-2.896-2.896 2.896 2.896 0 0 1 2.896-2.891c.328 0 .64.049.938.139V9.434a6.32 6.32 0 0 0-.938-.07 6.34 6.34 0 0 0-6.34 6.342 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.217 8.217 0 0 0 5.176 1.832V7.467a4.81 4.81 0 0 1-1.41-.781z"
            fill="currentColor"
          />
        </svg>
      );
    case 'facebook':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-label="Facebook"
          {...props}
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-label="LinkedIn"
          {...props}
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
  }
}
