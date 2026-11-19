"use client";

import { useEffect, useMemo } from "react";

/** Temporary preview URL for a local File (revoked when the file changes or on unmount). */
export function useObjectUrl(file) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url]);
  return url;
}
