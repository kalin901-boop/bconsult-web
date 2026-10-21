"use client";

import { useSyncExternalStore } from "react";

// The hostname stays fixed for the lifetime of this document.
function subscribe() {
  return () => {};
}

function getHostname() {
  return window.location.hostname;
}

function getServerHostname() {
  return "—";
}

export function CurrentHostname() {
  const hostname = useSyncExternalStore(
    subscribe,
    getHostname,
    getServerHostname,
  );

  return (
    <span className="hostname" aria-live="polite" aria-atomic="true">
      {hostname}
    </span>
  );
}
