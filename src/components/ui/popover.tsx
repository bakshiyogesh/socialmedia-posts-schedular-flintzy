'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getAvailableVerticalSpaces, determinePopoverSide } from './popover-position';;

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
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
  const triggerRef = React.useRef<HTMLDivElement | null>(null);
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
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block w-full">{children}</div>
    </PopoverContext.Provider>
  );
}

export const PopoverTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, onClick, ...props }, forwardedRef) => {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  const handleRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      context.triggerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [context.triggerRef, forwardedRef]
  );

  return (
    <div
      ref={handleRef}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          e.stopPropagation();
          context.setOpen((prev) => !prev);
        }
      }}
      className={cn('cursor-pointer w-full', className)}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverTrigger.displayName = 'PopoverTrigger';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'auto';
  sideOffset?: number;
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, className, align = 'start', side = 'auto', ...props }, forwardedRef) => {
    const context = React.useContext(PopoverContext);
    if (!context) throw new Error('PopoverContent must be used within Popover');
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Initial placement computation based on trigger element geometry if available
    const [currentPlacement, setCurrentPlacement] = React.useState<'top' | 'bottom'>(() => {
      if (side === 'top') return 'top';
      if (side === 'bottom') return 'bottom';
      if (context.triggerRef.current) {
        const { spaceBelow, spaceAbove } = getAvailableVerticalSpaces(context.triggerRef.current);
        // If space below is constrained (< 300px) and space above has more room, flip to top
        if (spaceBelow < 300 && spaceAbove > spaceBelow) {
          return 'top';
        }
      }
      return 'bottom';
    });

    React.useImperativeHandle(forwardedRef, () => contentRef.current as HTMLDivElement);

    // Dynamic collision detection and flip on mount/open/scroll/resize
    useIsomorphicLayoutEffect(() => {
      if (!context.open) return;

      const determinePlacement = () => {
        if (side !== 'auto') {
          setCurrentPlacement(side);
          return;
        }

        const triggerEl = context.triggerRef.current;
        if (!triggerEl) return;

        const { spaceBelow, spaceAbove } = getAvailableVerticalSpaces(triggerEl);
        const contentHeight = contentRef.current ? contentRef.current.offsetHeight : 300;

        // If not enough room below for the popover content and above has more space, open above
        if (spaceBelow < contentHeight + 8 && spaceAbove > spaceBelow) {
          setCurrentPlacement('top');
        } else {
          setCurrentPlacement('bottom');
        }
      };

      determinePlacement();

      // Use capture mode to catch scroll events on any scrollable parent container (e.g. modal body)
      window.addEventListener('scroll', determinePlacement, { capture: true, passive: true });
      window.addEventListener('resize', determinePlacement, { passive: true });

      return () => {
        window.removeEventListener('scroll', determinePlacement, { capture: true });
        window.removeEventListener('resize', determinePlacement);
      };
    }, [context.open, side, context.triggerRef]);

    React.useEffect(() => {
      if (!context.open) return;
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          (!context.triggerRef.current || !context.triggerRef.current.contains(target))
        ) {
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
        data-side={currentPlacement}
        className={cn(
          'absolute z-50 rounded-2xl bg-zinc-950 border border-zinc-800 p-3 text-zinc-100 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150',
          currentPlacement === 'top'
            ? 'bottom-full top-auto mb-1.5 origin-bottom'
            : 'top-full bottom-auto mt-1.5 origin-top',
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
  }
);
PopoverContent.displayName = 'PopoverContent';

export { getAvailableVerticalSpaces, determinePopoverSide }
