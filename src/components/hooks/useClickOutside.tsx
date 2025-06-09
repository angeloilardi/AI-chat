import { useEffect } from "react";

/**
 * useClickOutside
 * Detects clicks outside a given element and triggers a handler.
 *
 * @param ref - React ref of the element to monitor
 * @param handler - Callback to trigger on outside click
 */
function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      console.log("Click outside listener triggered", {
        target: event.target,
        current: el,
        contains: el?.contains(event.target as Node),
      });
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener); // for mobile

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;
