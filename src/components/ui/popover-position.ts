/**
 * Utility to calculate vertical space availability and smart flip positioning
 * for popovers, calendars, and dropdowns.
 */

export interface AvailableSpaces {
  spaceBelow: number;
  spaceAbove: number;
}

/**
 * Calculates available vertical space above and below an anchor element,
 * considering viewport boundaries and any scroll/clipping parent containers (e.g. modals).
 */
export function getAvailableVerticalSpaces(triggerEl: HTMLElement | null): AvailableSpaces {
  if (!triggerEl || typeof window === 'undefined') {
    return { spaceBelow: 500, spaceAbove: 500 };
  }

  const triggerRect = triggerEl.getBoundingClientRect();
  let minBottom = window.innerHeight;
  let maxTop = 0;

  let current = triggerEl.parentElement;
  const doc = typeof document !== 'undefined' ? document : null;
  while (current && (!doc || (current !== doc.body && current !== doc.documentElement))) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    const overflow = style.overflow;

    // Check if ancestor clips or scrolls content vertically
    if (
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflowY === 'hidden' ||
      overflowY === 'clip' ||
      overflow === 'auto' ||
      overflow === 'scroll' ||
      overflow === 'hidden' ||
      overflow === 'clip'
    ) {
      const parentRect = current.getBoundingClientRect();
      if (parentRect.height > 0) {
        minBottom = Math.min(minBottom, parentRect.bottom);
        maxTop = Math.max(maxTop, parentRect.top);
      }
    }
    current = current.parentElement;
  }

  const spaceBelow = minBottom - triggerRect.bottom;
  const spaceAbove = triggerRect.top - maxTop;

  return { spaceBelow, spaceAbove };
}

/**
 * Computes whether the popover should open on top or bottom based on available space.
 * Defaults to bottom unless space below is insufficient for contentHeight and space above has more room.
 */
export function determinePopoverSide(
  spaces: AvailableSpaces,
  contentHeight = 310,
  collisionBuffer = 8
): 'top' | 'bottom' {
  if (spaces.spaceBelow < contentHeight + collisionBuffer && spaces.spaceAbove > spaces.spaceBelow) {
    return 'top';
  }
  return 'bottom';
}
