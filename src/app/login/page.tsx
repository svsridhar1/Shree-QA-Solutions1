'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  KeyRound, 
  Sparkles,
  Building2,
  Award
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('demo@shreeqasolutions.com');
  const [password, setPassword] = useState('Demo@2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Failed to authenticate');
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@shreeqasolutions.com');
    setPassword('Demo@2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Emblem */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#F5A623] via-[#E08A3E] to-[#B33A2E] p-1 shadow-lg">
          <div className="w-full h-full rounded-full bg-[#FAF7F2] flex items-center justify-center border border-[#E08A3E]/40">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              className="w-10 h-10 text-[#B33A2E]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="18" cy="18" r="14" stroke="url(#goldGradLogin)" strokeWidth="1.5" strokeDasharray="2 2" />
              <circle cx="18" cy="18" r="11" stroke="#B33A2E" strokeWidth="1.2" />
              <path
                d="M18 8L20 14L26 12L22 17L28 19L22 21L26 26L20 24L18 30L16 24L10 26L14 21L8 19L14 17L10 12L16 14L18 8Z"
                fill="url(#goldGradLogin)"
                opacity="0.85"
              />
              <circle cx="18" cy="18" r="3.5" fill="#1B2A4A" />
              <circle cx="18" cy="18" r="1.5" fill="#FAF7F2" />
              <defs>
                <linearGradient id="goldGradLogin" x1="8" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F5A623" />
                  <stop offset="0.5" stopColor="#E08A3E" />
                  <stop offset="1" stopColor="#B33A2E" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <div className="mt-4 flex items-baseline justify-center space-x-2">
          <span className="font-serif text-3xl font-extrabold tracking-tight text-[#B33A2E]">
            SHREE
          </span>
          <span className="font-sans text-2xl font-bold tracking-tight text-[#1B2A4A]">
            QA Solutions
          </span>
        </div>
        <p className="mt-1 font-serif italic text-xs text-[#1B2A4A]/80">
          "Excelling the Excellence" — CMMI & ISO Lead Appraisal CRM
        </p>
        <p className="text-[11px] text-gray-600">
          Kukatpally, Hyderabad - 500072, Telangana, India
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FAF7F2] py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-[#DEC6A6] relative overflow-hidden">
          
          {/* Accent top stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />

          <div className="mb-6 pb-4 border-b border-[#DEC6A6]/60">
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
              Lead Appraiser Portal Login
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Access client appraisals, pipeline kanban, and risk monitors
            </p>
          </div>

          {/* Quick Demo Fill Alert Banner */}
          <div className="mb-6 p-3 rounded-lg bg-[#EBDDC9]/40 border border-[#DEC6A6] text-xs text-[#1B2A4A]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#B33A2E] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Evaluation User:</span>
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] font-bold text-[#1B2A4A] underline hover:text-[#B33A2E]"
              >
                Auto-Fill
              </button>
            </div>
            <div className="mt-1 font-mono text-[11px] text-gray-700 bg-white/70 p-1.5 rounded border border-[#DEC6A6]/40">
              <div>Email: <strong>demo@shreeqasolutions.com</strong></div>
              <div>Password: <strong>Demo@2026</strong></div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2A4A]">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-[#DEC6A6] rounded-md text-xs text-[#1B2A4A] bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#B33A2E] focus:border-[#B33A2E]"
                  placeholder="demo@shreeqasolutions.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2A4A]">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-[#DEC6A6] rounded-md text-xs text-[#1B2A4A] bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#B33A2E] focus:border-[#B33A2E]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-xs font-bold text-white bg-[#B33A2E] hover:bg-[#8F281E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B33A2E] disabled:opacity-50 transition-all"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to CRM Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-[#DEC6A6]/60 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B33A2E]" />
              <span>Protected Appraisal Management Environment</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
