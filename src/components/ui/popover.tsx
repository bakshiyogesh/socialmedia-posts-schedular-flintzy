'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const next = typeof value === 'function' ? value(open) : value;
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange, open]
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </PopoverContext.Provider>
  );
}

export const PopoverTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        context.setOpen((prev) => !prev);
      }}
      className={cn('cursor-pointer w-full', className)}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end' }
>(({ children, className, align = 'start', ...props }, forwardedRef) => {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error('PopoverContent must be used within Popover');
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(forwardedRef, () => contentRef.current as HTMLDivElement);

  React.useEffect(() => {
    if (!context.open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        context.setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') context.setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [context]);

  if (!context.open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 mt-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 p-3 text-zinc-100 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150',
        align === 'start' && 'left-0',
        align === 'end' && 'right-0',
        align === 'center' && 'left-1/2 -translate-x-1/2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverContent.displayName = 'PopoverContent';
