import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 select-none',
          variant === 'default' &&
            'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] shadow-sm',
          variant === 'outline' &&
            'border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-200 active:scale-[0.98]',
          variant === 'secondary' &&
            'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
          variant === 'ghost' &&
            'hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-100',
          variant === 'destructive' &&
            'bg-rose-600 text-white hover:bg-rose-500 shadow-sm',
          size === 'default' && 'h-9 px-3.5 py-2',
          size === 'sm' && 'h-7 rounded-lg px-2.5 text-[11px]',
          size === 'lg' && 'h-10 rounded-xl px-5 text-sm',
          size === 'icon' && 'h-8 w-8 rounded-lg p-0',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
