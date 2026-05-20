'use client';

import React, { useEffect, useState } from 'react';
import { getIconUrl } from '@/utils/branding';

export function DynamicIcon() {
  const [iconUrl, setIconUrl] = useState<string>('/favicon.ico');

  useEffect(() => {
    const url = getIconUrl();
    setIconUrl(url);

    const link =
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
      document.createElement('link');

    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;

    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(link);
    }
  }, []);

  return null;
}
