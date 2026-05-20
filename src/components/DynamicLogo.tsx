'use client';

import Image from 'next/image';
import React from 'react';
import { getLogoUrl } from '@/utils/branding';

export function DynamicLogo() {
  const logoUrl = getLogoUrl();
  const isImageUrl = logoUrl.toLowerCase().match(/\.(svg|png|jpg|jpeg|gif|webp)$/);

  if (isImageUrl) {
    return (
      <Image
        src={logoUrl}
        alt="Logo"
        width={120}
        height={40}
        priority
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = '/assets/netbird-logo.svg';
        }}
      />
    );
  }

  return <div className="text-lg font-bold">{logoUrl}</div>;
}
