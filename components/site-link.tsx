"use client";

import NextLink from "next/link";
import { forwardRef, type ComponentProps } from "react";

/** Use document navigation: the current Vinext client router can stall before fetching. */
const SiteLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(function SiteLink(
  { onClick, onNavigate, replace, ...props }, ref,
) {
  return <NextLink {...props} prefetch={false} ref={ref} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.currentTarget;
    if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const destination = new URL(anchor.href);
    if (destination.origin !== window.location.origin) return;
    event.preventDefault();
    let cancelled = false;
    onNavigate?.({ preventDefault: () => { cancelled = true; } });
    if (cancelled) return;
    if (replace) window.location.replace(destination.href);
    else window.location.assign(destination.href);
  }} />;
});

export default SiteLink;
