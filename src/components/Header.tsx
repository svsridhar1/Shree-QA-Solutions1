'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCRM } from '@/lib/crmStore';
import { EnterpriseBrand } from '@/components/EnterpriseBrand';
import { ShreeSymbol } from '@/components/BrandLogo';
import { AIAssistantModal } from '@/components/AIAssistantModal';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  ShieldCheck,
  FileText,
  BarChart3,
  Search,
  Bell,
  Sparkles,
  RotateCcw,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { resetToDemoSeed, metrics, clients } = useCRM();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isLoginPage = pathname === '/login';

  const totalRiskCount = metrics.renewalsAtRiskCount + metrics.coldLeadsCount + metrics.stalledEngagementsCount;

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
    { 
      href: '/clients?service=CMMI+DEV', 
      label: 'CMMI & ISO', 
      icon: ShieldCheck 
    },
    { 
      href: '/clients?risk=renewals_at_risk', 
      label: 'Risk Radar', 
      icon: AlertTriangle,
      badge: totalRiskCount > 0 ? totalRiskCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-saas-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Enterprise Brand Identity */}
          <div className="flex items-center space-x-6">
            <EnterpriseBrand size="md" href="/" editableLogo={true} />

            {/* Subtle vertical separator */}
            <div className="hidden xl:block h-7 w-[1px] bg-slate-200" />

            {/* Desktop Navigation Links */}
            {!isLoginPage && isAuthenticated && (
              <nav className="hidden lg:flex items-center space-x-1">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#0F172A] text-white shadow-saas-xs'
                          : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                            item.badgeColor 
                              ? item.badgeColor 
                              : isActive
                                ? 'bg-amber-400/20 text-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
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
          </div>

          {/* Right Action Center */}
          {!isLoginPage && isAuthenticated && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Global Quick Search Bar Trigger */}
              <button
                type="button"
                onClick={() => setIsAIOpen(true)}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-500 transition-colors"
                title="Search clients, appraisals, or standards"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search appraisals...</span>
                <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* AI Appraisal Assistant Trigger */}
              <button
                type="button"
                onClick={() => setIsAIOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white text-xs font-semibold shadow-saas-xs hover:shadow-saas-md border border-amber-500/30 hover:scale-105 transition-all"
                title="Open AI Appraisal Intelligence"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white p-0.5 shadow-xs">
                  <ShreeSymbol />
                </div>
                <span className="hidden sm:inline">AI Assist</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </button>

              {/* Notifications / Risk Alerts Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Risk & Appraisal Alerts"
                >
                  <Bell className="w-4 h-4" />
                  {totalRiskCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-saas-lg p-3 z-50 animate-fade-in text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-bold text-slate-900">Appraisal Risk Alerts</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                        {totalRiskCount} Pending
                      </span>
                    </div>
                    <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                      {metrics.renewalsAtRiskCount > 0 && (
                        <Link
                          href="/clients?risk=renewals_at_risk"
                          onClick={() => setNotificationsOpen(false)}
                          className="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {metrics.renewalsAtRiskCount} Renewals at Risk
                            </span>
                            <span className="text-[11px] text-slate-500">Expiring in &lt;90 days without contact</span>
                          </div>
                        </Link>
                      )}
                      {metrics.stalledEngagementsCount > 0 && (
                        <Link
                          href="/clients?risk=stalled_engagements"
                          onClick={() => setNotificationsOpen(false)}
                          className="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {metrics.stalledEngagementsCount} Stalled Appraisals
                            </span>
                            <span className="text-[11px] text-slate-500">No milestone progress in 21+ days</span>
                          </div>
                        </Link>
                      )}
                      {metrics.coldLeadsCount > 0 && (
                        <Link
                          href="/clients?risk=cold_leads"
                          onClick={() => setNotificationsOpen(false)}
                          className="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {metrics.coldLeadsCount} Cold Lead Inquiries
                            </span>
                            <span className="text-[11px] text-slate-500">Idle proposals awaiting follow-up</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Data Button */}
              <button
                onClick={() => {
                  if (confirm('Reset CRM database to fresh mock seed data?')) {
                    resetToDemoSeed();
                  }
                }}
                title="Reset Demo Data"
                className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset</span>
              </button>

              {/* User Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 pl-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] text-[#F59E0B] font-bold text-xs flex items-center justify-center border border-amber-500/40 shadow-xs">
                    MB
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-slate-900">
                      {user?.name || 'Mahesh Bhaskara'}
                    </span>
                    <span className="text-[10px] font-medium text-amber-600">
                      Lead Appraiser
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-saas-lg p-2 z-50 animate-fade-in text-xs">
                    <div className="p-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user?.name || 'Mahesh Bhaskara'}</p>
                      <p className="text-[11px] text-slate-500">{user?.email || 'demo@shreeqasolutions.com'}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        CMMI & ISO Certified Lead Appraiser
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/clients"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Client Registry</span>
                      </Link>
                      <Link
                        href="/pipeline"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <Kanban className="w-3.5 h-3.5 text-slate-400" />
                        <span>In-Appraisal Pipeline</span>
                      </Link>
                      <a
                        href="https://www.shreeqasolutions.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <span className="flex items-center space-x-2">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          <span>Official Portal</span>
                        </span>
                      </a>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-rose-50 text-rose-600 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          )}

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && !isLoginPage && isAuthenticated && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1.5 animate-fade-in">
          <button
            onClick={() => {
              setIsAIOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#0F172A] text-white shadow-saas-xs"
          >
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white p-0.5">
                <ShreeSymbol />
              </div>
              <span>AI Appraisal Assistant</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-[#0F172A] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <button
              onClick={() => {
                resetToDemoSeed();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 py-1 text-slate-700 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Demo Seed</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 py-1 text-rose-600 font-medium"
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
