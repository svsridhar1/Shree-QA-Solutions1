'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCRM } from '@/lib/crmStore';
import { BrandLogo, ShreeSymbol } from '@/components/BrandLogo';
import { AIAssistantModal } from '@/components/AIAssistantModal';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  LogOut, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { resetToDemoSeed, metrics } = useCRM();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#FAF7F2] shadow-xs border-b border-[#DEC6A6]/60">
      {/* Top corporate bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline EXACTLY matching business card format */}
          <div className="flex items-center space-x-3.5">
            {/* Editable Devanagari "श्री" Emblem */}
            <BrandLogo size="md" editable={true} />

            {/* Exact 3-line format matching business card */}
            <Link href="/" className="flex flex-col group leading-none select-none">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wide text-[#B33A2E] leading-tight">
                SHREE
              </span>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1B2A4A] leading-tight -mt-0.5">
                QA Solutions
              </span>
              <span className="text-[10px] sm:text-[11px] font-serif italic text-[#1B2A4A]/90 tracking-wide mt-0.5">
                Excelling the Excellence
              </span>
            </Link>
          </div>

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
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {!isLoginPage && isAuthenticated && (
              <>
                {/* AI Assistant Button with authentic Shree emblem inside */}
                <button
                  type="button"
                  onClick={() => setIsAIOpen(true)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#1B2A4A] to-[#2C3E6B] text-white text-xs font-bold shadow-xs hover:shadow-md border border-[#E08A3E]/40 hover:scale-105 transition-all"
                  title="Ask AI Assistant about clients, appraisals, or risk queries"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                    <ShreeSymbol />
                  </div>
                  <span className="hidden sm:inline">AI Assist</span>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </button>

                {/* Reset Data Button */}
                <button
                  onClick={() => {
                    if (confirm('Reset CRM database to fresh mock seed data?')) {
                      resetToDemoSeed();
                    }
                  }}
                  title="Reset Demo Data"
                  className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-medium text-[#1B2A4A]/80 hover:text-[#B33A2E] hover:bg-[#EBDDC9]/40 border border-[#DEC6A6]/60 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Seed</span>
                </button>

                {/* Appraiser badge - Mahesh Bhaskara */}
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-[#1B2A4A]">
                    {user?.name || 'Mahesh Bhaskara'}
                  </span>
                  <span className="text-[10px] font-semibold text-[#B33A2E]">
                    Lead Appraiser
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
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#DEC6A6] px-4 pt-2 pb-4 space-y-1.5">
          <button
            onClick={() => {
              setIsAIOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold bg-[#1B2A4A] text-white shadow-xs border border-[#E08A3E]/40"
          >
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                <ShreeSymbol />
              </div>
              <span>AI Appraisal Assistant</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>

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

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onSelectClient={(client) => {
          router.push(`/clients?selected=${client.id}`);
        }}
      />
    </header>
  );
};
