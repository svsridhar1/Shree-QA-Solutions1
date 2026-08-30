'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo, ShreeSymbol } from '@/components/BrandLogo';

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
  const content = (
    <div className="flex items-center space-x-3 sm:space-x-3.5 group select-none">
      {/* Circular Emblem on Left */}
      <BrandLogo size={size} editable={editableLogo} />

      {/* Typography on Right matching media_1788055785667.jpg */}
      <div className="flex flex-col justify-center text-left">
        
        {/* Line 1: SHREE (Large Rust/Terracotta Red Serif) */}
        <span className="font-serif text-2xl sm:text-[28px] font-extrabold tracking-wider text-[#B33A2E] leading-none uppercase">
          SHREE
        </span>

        {/* Line 2: QA Solutions (Bold Black/Charcoal Serif) */}
        <span className="font-serif text-lg sm:text-[20px] font-bold tracking-tight text-[#111827] leading-none mt-1 sm:mt-1.5">
          QA Solutions
        </span>

        {/* Horizontal Divider Line matching image */}
        <div className="w-full h-[1px] bg-[#1E293B]/70 my-1 sm:my-1.5" />

        {/* Line 3: Excelling the Excellence (Clean Serif Subtitle) */}
        <span className="font-serif text-[11px] sm:text-[12px] font-medium tracking-tight text-[#1E293B] leading-none">
          Excelling the Excellence
        </span>

      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
