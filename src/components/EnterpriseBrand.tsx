'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';

interface EnterpriseBrandProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  editableLogo?: boolean;
}

export const EnterpriseBrand: React.FC<EnterpriseBrandProps> = ({
  size = 'md',
  href = '/',
  editableLogo = true,
}) => {
  const textContent = (
    <div className="flex flex-col justify-center text-left select-none group/text">
      
      {/* Line 1: SHREE (Large Deep Red Serif) */}
      <span className="font-serif text-2xl sm:text-[27px] font-extrabold tracking-wider text-[#B33A2E] leading-none uppercase">
        SHREE
      </span>

      {/* Line 2: QA Solutions in a single line (Bold Dark Charcoal Serif) */}
      <span className="font-serif text-lg sm:text-[19px] font-bold tracking-tight text-[#0F172A] leading-none mt-1 sm:mt-1.5 whitespace-nowrap">
        QA Solutions
      </span>

      {/* Thin Horizontal Divider Line */}
      <div className="w-full h-[1px] bg-slate-400/80 my-1 sm:my-1.5" />

      {/* Line 3: Excelling the Excellence in a single line (Italic / Serif Subtitle) */}
      <span className="font-serif text-[11px] sm:text-[12px] font-medium italic tracking-tight text-[#1E293B] leading-none whitespace-nowrap">
        Excelling the Excellence
      </span>

    </div>
  );

  return (
    <div className="flex items-center space-x-3 sm:space-x-3.5 select-none">
      {/* Circular Emblem on Left (Standalone editable logo with portal modal) */}
      <BrandLogo size={size} editable={editableLogo} />

      {/* Typography on Right: clickable if href is provided */}
      {href ? (
        <Link href={href} className="inline-flex hover:opacity-95 transition-opacity">
          {textContent}
        </Link>
      ) : (
        textContent
      )}
    </div>
  );
};
