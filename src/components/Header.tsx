'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCRM } from '@/lib/crmStore';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  LogOut, 
  RotateCcw, 
  ShieldCheck, 
  Award,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { resetToDemoSeed, metrics } = useCRM();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, don't show full navigation
  const isLoginPage = pathname === '/login';

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { 
      href: '/clients', 
      label: 'Clients', 
      icon: Users,
      badge: metrics.totalClients 
    },
    { 
      href: '/pipeline', 
      label: 'Appraisal Pipeline', 
      icon: Kanban,
      badge: metrics.inAppraisalCount 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2] shadow-sm border-b border-[#E6DCce]">
      {/* Top corporate bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            {/* Gold-to-orange circular emblem */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#F5A623] via-[#E08A3E] to-[#B33A2E] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#FAF7F2] flex items-center justify-center border border-[#E08A3E]/30">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  className="w-7 h-7 text-[#B33A2E]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="18" cy="18" r="14" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="18" cy="18" r="11" stroke="#B33A2E" strokeWidth="1.2" />
                  {/* Central Chakra / Rosette symbol */}
                  <path
                    d="M18 8L20 14L26 12L22 17L28 19L22 21L26 26L20 24L18 30L16 24L10 26L14 21L8 19L14 17L10 12L16 14L18 8Z"
                    fill="url(#goldGrad)"
                    opacity="0.85"
                  />
                  <circle cx="18" cy="18" r="3.5" fill="#1B2A4A" />
                  <circle cx="18" cy="18" r="1.5" fill="#FAF7F2" />
                  <defs>
                    <linearGradient id="goldGrad" x1="8" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5A623" />
                      <stop offset="0.5" stopColor="#E08A3E" />
                      <stop offset="1" stopColor="#B33A2E" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#B33A2E]">
                  SHREE
                </span>
                <span className="font-sans text-xl font-bold tracking-tight text-[#1B2A4A]">
                  QA Solutions
                </span>
              </div>
              <span className="text-[11px] font-serif italic text-[#1B2A4A]/80 tracking-wide">
                Excelling the Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isLoginPage && isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#1B2A4A] text-white shadow-sm'
                        : 'text-[#1B2A4A] hover:bg-[#EBDDC9]/50 hover:text-[#B33A2E]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#E08A3E]' : 'text-[#1B2A4A]/70'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? 'bg-[#E08A3E] text-white'
                            : 'bg-[#EBDDC9] text-[#1B2A4A]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Action Items */}
          <div className="flex items-center space-x-3">
            {/* CMMI Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#EBDDC9]/40 border border-[#DEC6A6] text-[11px] text-[#1B2A4A] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B33A2E]" />
              <span>CMMI & ISO Appraisal Body</span>
            </div>

            {!isLoginPage && isAuthenticated && (
              <>
                {/* Reset Data Button */}
                <button
                  onClick={() => {
                    if (confirm('Reset CRM database to fresh mock seed data?')) {
                      resetToDemoSeed();
                    }
                  }}
                  title="Reset Demo Data"
                  className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-medium text-[#1B2A4A]/80 hover:text-[#B33A2E] hover:bg-[#EBDDC9]/40 border border-[#DEC6A6]/60 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Seed</span>
                </button>

                {/* User badge */}
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-[#1B2A4A]">
                    {user?.name || 'Lead Appraiser'}
                  </span>
                  <span className="text-[10px] text-[#B33A2E]">
                    Kukatpally, Hyderabad
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 rounded-md text-[#1B2A4A]/70 hover:text-[#B33A2E] hover:bg-[#EBDDC9]/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile menu trigger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-md text-[#1B2A4A]"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Brand Accent Bar: Orange-to-Red gradient (#E08A3E to #B33A2E) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && !isLoginPage && isAuthenticated && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#DEC6A6] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-[#1B2A4A] text-white'
                    : 'text-[#1B2A4A] hover:bg-[#EBDDC9]/50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E08A3E]' : 'text-[#1B2A4A]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#E08A3E] text-white font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#DEC6A6]/60 flex items-center justify-between text-xs text-[#1B2A4A]">
            <button
              onClick={() => {
                resetToDemoSeed();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1 py-1 text-[#B33A2E] font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed Data</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-1 py-1 text-[#1B2A4A] hover:text-[#B33A2E]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
